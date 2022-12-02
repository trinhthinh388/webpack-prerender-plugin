/* eslint-disable no-undef */
module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS === 'true',
    args: [
      '--disable-infobars', 
      '--window-size=1200,800',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process',
    ],
    ignoreDefaultArgs: ['--disable-extensions'],
    defaultViewport: null,
    executablePath: '/usr/bin/chromium-browser',
    debuggingPort: 9004
  },
  browserContext: 'default',
}