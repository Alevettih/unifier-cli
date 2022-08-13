import { PrettifyUrlPipe } from './prettify-url.pipe';

describe('PrettifyUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new PrettifyUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
