import { HTTPResponse } from 'puppeteer';
import csstree, { CssNode } from 'css-tree';
import { load, CheerioAPI } from 'cheerio';
import fs from 'fs';
import { RendererPlugin, isSuccessResponse } from '../misc';

export class CSSOptimizer extends RendererPlugin {
  private $: CheerioAPI;
  constructor(_html: string, _response: HTTPResponse) {
    super(_html, _response);
    this.$ = load(this.originHtmlTemplate);
  }

  async process() {
    if (!isSuccessResponse(this.response)) return this.originHtmlTemplate;

    const resType = this.response.request().resourceType();

    if (resType === 'stylesheet') {
      const text = await this.response.text();
      const ast = csstree.parse(text);

      this.removeUnusedSelector(ast);

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

  private removeUnusedSelector(ast: CssNode) {
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

  private getSelector(rule: CssNode) {
    const block = csstree.generate(rule);
    block.trim();
    const selector = block.split('{').at(0);
    return selector;
  }
}
