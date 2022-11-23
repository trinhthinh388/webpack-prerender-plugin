import { PuppeteerRenderer } from '../PuppeteerRenderer';

describe('PuppeteerRenderer coverage', () => {
  jest.setTimeout(30000);
  it('should generate CSS coverage', async () => {
    const renderer = new PuppeteerRenderer({
      port: 3000,
      inlineCSS: true,
    });

    await renderer.launch();

    const res = await renderer.render('/');

    // console.log(100 - res.CSSCoverage);

    await renderer.destroy();
  });
});
