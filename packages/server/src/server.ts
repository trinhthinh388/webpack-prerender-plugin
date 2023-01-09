import express from 'express';
import { getPortPromise } from 'portfinder';
import { Server } from 'http';
import { Express } from 'express';
import path from 'path';
import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';

export type RendererServerOpts = {
  port?: number;
  staticDir?: string;
  indexPath?: string;
};

const DEFAULT_OPTIONS: Required<RendererServerOpts> = {
  port: 8008,
  staticDir: 'dist',
  indexPath: 'index.html',
};

export class RendererServer {
  private _app: Express;
  private _server: Server | undefined;
  private _options: Required<RendererServerOpts> = { ...DEFAULT_OPTIONS };

  constructor(opts: RendererServerOpts = { ...DEFAULT_OPTIONS }) {
    this._app = express();
    this._options = { ...this._options, ...omitBy(opts, isUndefined) };
  }

  async initialize(): Promise<number> {
    const workingPort = await getPortPromise({
      port: this._options.port,
    });

    this._app.use(
      express.static(this._options.staticDir, {
        dotfiles: 'allow',
      })
    );

    this._app.get('*', (req, res) => {
      res.sendFile(path.join(this._options.staticDir, this._options.indexPath));
    });

    return new Promise(resolve => {
      this._server = this._app.listen(workingPort, () => {
        resolve(workingPort);
      });
    });
  }

  async destroy() {
    return new Promise(resolve => {
      this._server?.close(resolve);
    });
  }
}
