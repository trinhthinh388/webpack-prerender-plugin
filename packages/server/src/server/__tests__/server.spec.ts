import path from 'path';
import { RendererServer } from '../server';

let mockCallbacks: any[] = [];
const mockGet = jest.fn().mockImplementation((_, fn) => mockCallbacks.push(fn));
const mockUse = jest.fn();
const mockClose = jest.fn().mockImplementation(fn => fn());
const mockListen = jest.fn().mockImplementation((_, fn) => {
  fn();
  return {
    close: mockClose,
  };
});
const mockSendfile = jest.fn();

jest.mock('express', () => {
  const mockExpress = () => ({
    get: mockGet,
    listen: mockListen,
    use: mockUse,
  });
  Object.defineProperty(mockExpress, 'static', {
    value: jest.fn(),
  });
  return mockExpress;
});

jest.mock('portfinder', () => ({
  getPortPromise: jest.fn().mockImplementation(async () => 3000),
}));

describe('RendererServer', () => {
  afterEach(() => {
    mockCallbacks = [];
  });
  it('Should server static assets', async () => {
    const server = new RendererServer({
      port: 3000,
      staticDir: path.resolve(__dirname, '../../mocks/assets'),
    });
    await server.initialize();
    expect(mockUse).toHaveBeenCalled();
    expect(mockListen.mock.lastCall[0]).toBe(3000);
    expect(mockCallbacks).toHaveLength(1);
    mockCallbacks.forEach(fn => fn(undefined, { sendFile: mockSendfile }));
    expect(mockSendfile).toHaveBeenCalledWith(
      path.resolve(__dirname, '../../mocks/assets/index.html')
    );
    await server.destroy();
  });

  it('Should call close server instance', async () => {
    const server = new RendererServer({
      port: 3000,
      staticDir: path.resolve(__dirname, '../../mocks/assets'),
    });
    await server.initialize();
    await server.destroy();
    expect(mockClose).toHaveBeenCalled();
  });
});
