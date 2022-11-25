import { HTTPResponse, Page } from 'puppeteer';
import csstree, { CssNode, keyword } from 'css-tree';
import { load, CheerioAPI } from 'cheerio';
import fs from 'fs';
import { RendererPlugin, isSuccessResponse } from '../misc';

export class CSSOptimizer extends RendererPlugin {
  private $: CheerioAPI;
  constructor(_html: string, _response: HTTPResponse, _page: Page) {
    super(_html, _response, _page);
    this.$ = load(this.originHtmlTemplate);
  }

  async process() {
    if (!isSuccessResponse(this.response)) return this.originHtmlTemplate;

    const resType = this.response.request().resourceType();

    if (resType === 'stylesheet') {
      const text = await this.response.text();
      const ast = csstree.parse(text);

      await this.removeUnusedSelector(ast);

      await this.removeUnmatchMedia(ast);

      const res = csstree.generate(ast);

      fs.writeFileSync(this.response.request().url().split('/').at(-1)!, res);

      // console.log(this.response.request().url());
      // console.log('Has unused keyframes: ', res.includes('Unused-keyframes'));
      // console.log('Has unused class: ', res.includes('App-unused'));
      // console.log('Has unused type selector: ', res.includes('pre'));
      // console.log('Has unused id selector: ', res.includes('#no-root'));
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
    csstree.walk(ast, {
      visit: 'Rule',
      enter: (node, item, list) => {
        const selector = this.getSelector(node);
        if (selector && !this.isSelectorInuse(selector)) {
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
        }
      }
    }
  }
}
