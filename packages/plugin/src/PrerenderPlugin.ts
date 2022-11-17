import path from 'path';
import chalk from 'chalk';

export type PrerenderPluginOptions = {};

export class PrerenderPlugin {
  private _options: PrerenderPluginOptions = {};
  private _staticDir = '';
  private _routes = '';

  constructor(opts: PrerenderPluginOptions) {
    this._options = { ...opts, ...this._options };
  }
}
