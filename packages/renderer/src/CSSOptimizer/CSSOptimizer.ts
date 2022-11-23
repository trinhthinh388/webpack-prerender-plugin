import { HTTPResponse } from 'puppeteer';
import csstree from 'css-tree';
import { RendererPlugin, isSuccessResponse } from '../misc';

export class CSSOptimizer extends RendererPlugin {
  constructor(_html: string, _response: HTTPResponse) {
    super(_html, _response);
    this.updatedHtml = _html;
  }

  async process() {
    if (!isSuccessResponse(this.response)) return this.originHtmlTemplate;

    const resType = this.response.request().resourceType();

    if (resType === 'stylesheet') {
      const text = await this.response.text();
      const ast = csstree.parse(text);

      console.log(ast);
    }

    return this.updatedHtml;
  }
}
