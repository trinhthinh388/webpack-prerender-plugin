import type {
  HTTPResponse,
  PuppeteerLaunchOptions,
  WaitForOptions,
} from 'puppeteer';

export interface PuppeteerRendererOptions extends PuppeteerLaunchOptions {
  maxConcurrentRoutes?: number;
  port?: number;
  skipThirdPartyRequests?: boolean;
  navigationOptions?: WaitForOptions & { referer?: string };
  renderAfterElementExists?: string;
  inlineCSS?: boolean;
  ignoreErrorRequest?: boolean;
}

export abstract class RendererPlugin {
  protected originHtmlTemplate: string;
  protected response: HTTPResponse;

  constructor(_html: string, _response: HTTPResponse) {
    this.originHtmlTemplate = _html;
    this.response = _response;
  }

  abstract process(): Promise<string>;
}
