import { Compiler } from 'webpack';
import { PrerenderPlugin, DEFAULT_OPTS, PLUGIN_NAME } from '../PrerenderPlugin';

const mockFs = {
  mkdir: jest.fn().mockImplementation((_, fn) => {
    fn();
  }),
  writeFile: jest.fn().mockImplementation((_, __, fn) => {
    fn();
  }),
};

const mockPuppeteerRenderer = {
  launch: jest.fn().mockImplementation(() => void 0),
  destroy: jest.fn().mockImplementation(() => void 0),
  render: jest.fn().mockImplementation(() => ({
    html: '',
  })),
};

jest.mock('@webpack-prerender/renderer', () => {
  const actualModule = jest.requireActual('@webpack-prerender/renderer');
  return {
    ...actualModule,
    PuppeteerRenderer: function () {
      this.launch = mockPuppeteerRenderer.launch;
      this.destroy = mockPuppeteerRenderer.destroy;
      this.render = mockPuppeteerRenderer.render;
    },
  };
});

describe('WebpackPrerenderPlugin', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    mockFs.mkdir = jest.fn().mockImplementation((_, fn) => {
      fn();
    });
    mockFs.writeFile = jest.fn().mockImplementation((_, __, fn) => {
      fn();
    });
  });

  it('Should use default options', () => {
    const plugin = new PrerenderPlugin();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(plugin._options.staticDir).toBe(DEFAULT_OPTS.staticDir);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(plugin._options.outputDir).toBe(DEFAULT_OPTS.outputDir);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(plugin._routes).toEqual(DEFAULT_OPTS.routes);
  });

  it('Should add plugin to afterEmit hook', () => {
    const plugin = new PrerenderPlugin();
    const mockCompiler = {
      hooks: {
        afterEmit: {
          tapPromise: jest.fn(),
        },
      },
    };
    plugin.apply(mockCompiler as unknown as Compiler);
    expect(mockCompiler.hooks.afterEmit.tapPromise.mock.lastCall[0]).toEqual({
      name: PLUGIN_NAME,
    });
  });

  describe('writeFile', () => {
    it('should call with proper params', async () => {
      const plugin = new PrerenderPlugin();
      mockFs.writeFile = jest.fn((data, fileName, fn) => {
        expect(data.includes('/test')).toBe(true);
        expect(fileName).toBe('test');
        fn();
      });
      await plugin.writeFile(mockFs as unknown as Compiler['outputFileSystem'])(
        'test',
        'test'
      );
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should call with default output dir', async () => {
      const plugin = new PrerenderPlugin({
        outputDir: undefined,
      });
      mockFs.writeFile = jest.fn((path, data, fn) => {
        expect(path.includes('/test')).toBe(true);
        expect(path.includes(DEFAULT_OPTS.outputDir)).toBe(true);
        expect(data).toBe('test');
        fn();
      });
      await plugin.writeFile(mockFs as unknown as Compiler['outputFileSystem'])(
        'test',
        'test'
      );
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should throw err', async () => {
      const plugin = new PrerenderPlugin({
        outputDir: undefined,
      });
      const mockErr = new Error('HAHA');
      mockFs.writeFile = jest.fn((path, data, fn) => {
        expect(path.includes('/test')).toBe(true);
        expect(data).toBe('test');
        fn(mockErr);
      });
      try {
        await plugin.writeFile(
          mockFs as unknown as Compiler['outputFileSystem']
        )('test', 'test');
      } catch (err) {
        expect(err).toBe(mockErr);
        expect(mockFs.writeFile).toHaveBeenCalled();
      }
    });
  });

  describe('mkdirp', () => {
    it('should call with proper params', async () => {
      const plugin = new PrerenderPlugin();
      mockFs.mkdir = jest.fn((path, fn) => {
        expect(path.includes('test')).toBe(true);
        fn();
      });
      await plugin.mkdirp(mockFs as unknown as Compiler['outputFileSystem'])(
        'test'
      );
      expect(mockFs.mkdir).toHaveBeenCalled();
    });

    it('should throw err', async () => {
      const plugin = new PrerenderPlugin({
        outputDir: undefined,
      });
      const mockErr = new Error('HAHA');
      mockFs.mkdir = jest.fn((path, fn) => {
        expect(path.includes('test')).toBe(true);
        fn(mockErr);
      });
      try {
        await plugin.mkdirp(mockFs as unknown as Compiler['outputFileSystem'])(
          'test'
        );
      } catch (err) {
        expect(err).toBe(mockErr);
        expect(mockFs.mkdir).toHaveBeenCalled();
      }
    });
  });

  describe('afterEmit', () => {
    it('Should call Renderer apis', async () => {
      const plugin = new PrerenderPlugin();

      try {
        await plugin.afterEmit({
          compiler: {
            outputFileSystem: mockFs,
          },
        } as any);
      } catch (err) {
        console.log(err);
      }

      expect(mockPuppeteerRenderer.launch).toHaveBeenCalled();
      expect(mockPuppeteerRenderer.render).toHaveBeenCalled();
      expect(mockPuppeteerRenderer.destroy).toHaveBeenCalled();
    });

    it('Should call Renderer apis with exact params', async () => {
      const plugin = new PrerenderPlugin({
        outputDir: undefined,
        staticDir: undefined,
        routes: undefined,
      });

      try {
        await plugin.afterEmit({
          compiler: {
            outputFileSystem: mockFs,
          },
        } as any);
      } catch (err) {
        console.log(err);
      }

      expect(mockPuppeteerRenderer.launch).toHaveBeenCalled();
      expect(mockPuppeteerRenderer.render).toHaveBeenCalled();
      expect(mockPuppeteerRenderer.destroy).toHaveBeenCalled();
    });
  });
});
