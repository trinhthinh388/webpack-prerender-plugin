import {
  PuppeteerRenderer,
  PuppeteerRendererOptions,
} from '@webpack-prerender/renderer';
import type { Compiler, Compilation } from 'webpack';
import path from 'path';

export type PrerenderPluginOptions = PuppeteerRendererOptions & {
  routes?: Array<string>;
  outputDir?: string;
};

export const PLUGIN_NAME = 'WebpackPrerenderPlugin';
export const DEFAULT_OPTS = {
  staticDir: 'dist',
  outputDir: 'dist/prerender',
  routes: ['/'],
};

export class PrerenderPlugin {
  private _options: PrerenderPluginOptions = {};
  private _routes: Array<string> = [];

  constructor(opts: PrerenderPluginOptions = {}) {
    const { routes = [], ...others } = opts;
    this._options = {
      ...this._options,
      ...DEFAULT_OPTS,
      ...others,
    };

    this._routes = [...DEFAULT_OPTS.routes, ...routes];

    this.afterEmit = this.afterEmit.bind(this);
    this.apply = this.apply.bind(this);
    this.writeFile = this.writeFile.bind(this);
    this.mkdirp = this.mkdirp.bind(this);
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise({ name: PLUGIN_NAME }, this.afterEmit);
  }

  async afterEmit(compilation: Compilation) {
    const {
      compiler: { outputFileSystem },
    } = compilation;

    /**
     * Initialize renderer
     */
    const renderer = new PuppeteerRenderer({
      ...this._options,
      staticDir: path.resolve(
        process.cwd(),
        this._options.staticDir || DEFAULT_OPTS.staticDir
      ),
    });

    /**
     * Normalize path to create directory
     */
    const dirs = path
      .normalize(this._options.outputDir || DEFAULT_OPTS.outputDir)
      .split('/')
      .filter(dir => dir !== 'dist' && dir !== '..' && dir !== '.');
    let currentDir = path.resolve(
      process.cwd(),
      this._options.staticDir || DEFAULT_OPTS.staticDir
    );
    for (const dir of dirs) {
      currentDir = path.resolve(currentDir, dir);
      await this.mkdirp(outputFileSystem)(currentDir);
    }

    await renderer.launch();

    /**
     * Render routes
     */
    for (const route of this._routes) {
      const result = await renderer.render(route);
      const routeName = route.slice(1).replaceAll('/', '-') || 'index';
      await this.writeFile(outputFileSystem)(result.html, `${routeName}.html`);
    }

    await renderer.destroy();
  }

  writeFile(fs: Compiler['outputFileSystem']) {
    return (data: string | Buffer, fileName: string) =>
      new Promise<void>((resolve, reject) => {
        const writePath = path.resolve(
          process.cwd(),
          this._options.outputDir || DEFAULT_OPTS.outputDir,
          fileName
        );
        fs.writeFile(writePath, data, err => {
          if (err) reject(err);
          resolve();
        });
      });
  }

  mkdirp(fs: Compiler['outputFileSystem']) {
    return (path: string) =>
      new Promise<void>((resolve, reject) => {
        fs.mkdir(path, err => {
          if (err && err.code !== 'EEXIST') reject(err);
          resolve();
        });
      });
  }
}
