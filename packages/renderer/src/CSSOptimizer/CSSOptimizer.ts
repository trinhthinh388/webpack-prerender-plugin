import { HTTPResponse, Page } from 'puppeteer';
import csstree, { CssNode, keyword } from 'css-tree';
import { load, CheerioAPI } from 'cheerio';
import { RendererPlugin, isSuccessResponse } from '../misc';

export class CSSOptimizer extends RendererPlugin {
  private $: CheerioAPI;
  static anims: Set<string> = new Set();
  static keyframes: Set<string> = new Set();

  constructor(_html: string, _response: HTTPResponse, _page: Page) {
    super(_html, _response, _page);
    this.$ = load(this.originHtmlTemplate);

    this.isSelectorInuse = this.isSelectorInuse.bind(this);
    this.getAnims = this.getAnims.bind(this);
    this.getSelector = this.getSelector.bind(this);
    this.isMediaQueryMatches = this.isMediaQueryMatches.bind(this);
    this.process = this.process.bind(this);
    this.removeUnmatchMedia = this.removeUnmatchMedia.bind(this);
    this.removeUnusedSelector = this.removeUnusedSelector.bind(this);
  }

  async process() {
    if (!isSuccessResponse(this.response)) return this.originHtmlTemplate;

    const resType = this.response.request().resourceType();

    if (resType === 'stylesheet') {
      const text = await this.response.text();
      const ast = csstree.parse(text);

      this.getAnims(ast);

      await this.removeUnusedSelector(ast);

      await this.removeUnmatchMedia(ast);
    }

    return this.$.html();
  }

  private isSelectorInuse(selector: string) {
    return !!this.$(selector).length;
  }

  private async isMediaQueryMatches(query: string) {
    return await this.page.evaluate(`window.matchMedia("${query}").matches`);
  }

  private async removeUnusedSelector(ast: CssNode) {
    const getSelector = this.getSelector;
    const isSelectorInuse = this.isSelectorInuse;
    csstree.walk(ast, {
      visit: 'Rule',
      enter(node, item, list) {
        if (this.atrule && keyword(this.atrule.name).basename === 'keyframes') {
          return;
        }
        const selector = getSelector(node);
        if (selector && !isSelectorInuse(selector)) {
          list.remove(item);
        }
      },
    });
  }

  private async removeUnmatchMedia(ast: CssNode) {
    const promises: Array<Promise<void>> = [];
    const fn = async (
      atrule: CssNode,
      item: csstree.ListItem<CssNode>,
      list: csstree.List<CssNode>
    ) => {
      const selector = this.getSelector(atrule);
      if (selector && !(await this.isMediaQueryMatches(selector))) {
        list.remove(item);
      }
    };
    csstree.walk(ast, {
      visit: 'Atrule',
      enter: (...args) => {
        promises.push(fn(...args));
      },
    });

    await Promise.all(promises);
  }

  private getSelector(rule: CssNode) {
    const block = csstree.generate(rule);
    block.trim();
    switch (rule.type) {
      case 'Rule':
        return block.trim().split('{').at(0);
      case 'Atrule': {
        switch (keyword(rule.name).basename) {
          case 'media':
            return block.trim().split('{').at(0)?.split('media').at(-1);
          case 'keyframes': {
            CSSOptimizer.keyframes.add(csstree.generate(rule));
            return;
          }
        }
      }
    }
  }

  static removeUnusedKeyframes() {
    const anims = CSSOptimizer.anims;
    const keyframes = CSSOptimizer.keyframes;
    Array.from(CSSOptimizer.keyframes).forEach(kf => {
      const ast = csstree.parse(kf);
      csstree.walk(ast, {
        visit: 'Atrule',
        enter(atrule) {
          const keyword = csstree.keyword(atrule.name);

          if (keyword.basename === 'keyframes') {
            const name = csstree.generate(atrule.prelude as CssNode);
            if (!anims.has(name)) {
              keyframes.delete(kf);
            }
          }
        },
      });
    });
  }

  private getAnims(ast: CssNode) {
    const anims = csstree.findAll(
      ast,
      node => node.type === 'Declaration' && node.property === 'animation'
    );
    anims.forEach(a => {
      csstree.walk(a, {
        visit: 'Identifier',
        enter: node => {
          CSSOptimizer.anims.add(node.name);
        },
      });
    });
  }
}
