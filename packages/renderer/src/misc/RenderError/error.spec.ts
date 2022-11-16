import { RenderError } from './RenderError';

describe('RenderError', () => {
  it('should throw an RenderError', () => {
    const throwErrFn = jest.fn(() => {
      throw new RenderError('something unexpected');
    });
    try {
      throwErrFn();
    } catch (err: any) {
      expect(err.name).toBe('WebpackPrerenderPluginError');
      expect(err.message).toBe('something unexpected');
    }
  });
});
