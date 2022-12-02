import { HTTPResponse } from 'puppeteer';

export function isSuccessResponse(res: HTTPResponse) {
  if (res.status() >= 400) return false;
  return true;
}
