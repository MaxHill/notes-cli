import { appendIfNotExist, joinPaths, prependIfNotExist } from './utils';

describe('appendIfNotExist()', () => {
  it('Possible to suffix a string', () => {
    const addTestToString = appendIfNotExist('test');
    expect(addTestToString('string')).toEqual('stringtest');
  });

  it('It does not append if suffix is already set', () => {
    const addTestToString = appendIfNotExist('test');
    expect(addTestToString('stringtest')).toEqual('stringtest');
  });
});

describe('prependIfNotExist()', () => {
  it('Possible to prepend a string', () => {
    const addTestToString = prependIfNotExist('test');
    expect(addTestToString('string')).toEqual('teststring');
  });

  it('It does not prepend if prefix is already set', () => {
    const addTestToString = prependIfNotExist('test');
    expect(addTestToString('teststring')).toEqual('teststring');
  });
});

describe('joinPaths', () => {
  it('can join paths ', () => {
    const path = joinPaths('/path/1/', '/path/2/');
    expect(path).toEqual('/path/1/path/2/');
  });

  it('removes duplicate /', () => {
    const path = joinPaths('/path/1//', '/path/2///');
    expect(path).toEqual('/path/1/path/2/');
  });

  it('does not remove starting and ending', () => {
    const path = joinPaths('/path/1/', '/path/2/');
    expect(path).toEqual('/path/1/path/2/');

    const path2 = joinPaths('path/1/', '/path/2');
    expect(path2).toEqual('path/1/path/2');
  });
});
