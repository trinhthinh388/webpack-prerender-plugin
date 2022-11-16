export class RenderError extends Error {
  constructor(message: string) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RenderError);
    }

    this.name = 'WebpackPrerenderPluginError';
    this.message = message;
  }
}
