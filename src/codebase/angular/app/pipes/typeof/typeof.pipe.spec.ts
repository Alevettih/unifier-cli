import { TypeofPipe } from './typeof.pipe';

describe('IsPipe', () => {
  it('create an instance', () => {
    const pipe = new TypeofPipe();
    expect(pipe).toBeTruthy();
  });
});
