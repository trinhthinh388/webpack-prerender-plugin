import { HTTPResponse } from 'puppeteer';
import { RendererPlugin, isSuccessResponse } from '../misc';

export class CSSOptimizer extends RendererPlugin {
  constructor(_html: string, _response: HTTPResponse) {
    super(_html, _response);
    this.updatedHtml = _html;
  }

  process() {
    if (!isSuccessResponse(this.response)) return this.originHtmlTemplate;

    const resType = this.response.request().resourceType();

    if (resType === 'stylesheet') {
      console.log(this.response);
    }

    return this.updatedHtml;
  }
}
