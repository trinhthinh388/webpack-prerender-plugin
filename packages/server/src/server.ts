import express from 'express';

export type RendererServerOpts = {
  port?: number;
  staticDir?: string;
};

const initialize = ({
  port = 8008,
  staticDir = 'dist',
}: RendererServerOpts = {}) => {
  const app = express();

  app.use(express.static(staticDir));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

export { initialize };
