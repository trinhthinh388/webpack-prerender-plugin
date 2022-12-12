import { PuppeteerRenderer } from './puppeteer';

export type RendererOptions = {
  renderer?: 'puppeteer' | 'jsdom';
};

export default function getRenderer({ renderer }: RendererOptions) {
  switch (renderer) {
    case 'puppeteer':
      return PuppeteerRenderer;
  }
}
