import { HTTPResponse } from 'puppeteer';
import csstree, { CssNode } from 'css-tree';
import { load, CheerioAPI } from 'cheerio';
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

      // const res = csstree.generate(ast);

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
    let block = 0;
    csstree.walk(ast, {
      visit: 'Rule',
      enter(node, item, list) {
        block++;
      },
    });
    console.log(block);
  }

  private getFullSelector(node: CssNode) {
    const selectors: Array<string> = [];
    csstree.walk(node, _n => {
      switch (_n.type) {
        case 'ClassSelector': {
          selectors.push(`.${_n.name}`);
          break;
        }
        case 'TypeSelector': {
          selectors.push(_n.name);
          break;
        }
        case 'IdSelector': {
          selectors.push(`#${_n.name}`);
          break;
        }
      }
    });
    return selectors.join(' ');
  }
}
