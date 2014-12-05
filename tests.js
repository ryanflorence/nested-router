var expect = require('expect');
var { map } = require('./index');

describe('matching', () => {
  var matchPath = map((match) => {
    match('/a', { name: 'a' }, (match) => {
      match('/a/a', { name: 'a.a' });
      match('/a/b', { name: 'a.b' }, (match) => {
        match('/a/b/a', { name: 'a.b.a' });
        match('/a/b/b', { name: 'a.b.b' });
        match('/a/b/c', { name: 'a.b.c' });
      });
    });
    match('/b', { name: 'b' });
  });

  it('matches shallowest routes', () => {
    var matchInfo = matchPath('/b');
    expect(matchInfo.handlers.length).toEqual(1);
    expect(matchInfo.path).toEqual('/b');
    expect(matchInfo.handlers[0].name).toEqual('b');
  });

  it('matches deepest routes', () => {
    var matchInfo = matchPath('/a/b/b');
    expect(matchInfo.handlers.length).toEqual(3);
    expect(matchInfo.path).toEqual('/a/b/b');
    expect(matchInfo.handlers[0].name).toEqual('a');
    expect(matchInfo.handlers[1].name).toEqual('a.b');
    expect(matchInfo.handlers[2].name).toEqual('a.b.b');
  });

  it('returns proper-looking match info', () => {
    var matchInfo = matchPath('/a/b');
    expect(matchInfo).toEqual({
      path: '/a/b',
      params: {},
      query: {},
      handlers: [
        { name: 'a' },
        { name: 'a.b' }
      ]
    });
  });

  it('returns null when there is no match', () => {
    var matchInfo = matchPath('/bersterbleghhthphht');
    expect(matchInfo).toBe(null);
  });

  it('concats nested paths', () => {
    var matchPath = map((match) => {
      match('/foo', null, (match) => {
        match('bar', null, (match) => {
          match('baz', null);
        });
      });
    });
    expect(matchPath('/foo').handlers.length).toEqual(1);
    expect(matchPath('/foo/bar').handlers.length).toEqual(2);
    expect(matchPath('/foo/bar/baz').handlers.length).toEqual(3);
  });

});

describe('parameter parsing', () => {
  var matchPath = map((match) => {
    match('/:flavor', { name: 'a'}, (match) => {
      match('/:flavor/:food', { name: 'a.b'});
    });
  });

  it('generally works', () => {
    var matchInfo = matchPath('/cheese/cake');
    expect(matchInfo.params).toEqual({flavor: 'cheese', food: 'cake'});
  });
});

describe('query parsing', () => {
  var matchPath = map((match) => {
    match('/', null, (match) => {
      match('/foo', null);
    });
  });

  it('generally works', () => {
    var matchInfo = matchPath('/foo?bar=baz');
    expect(matchInfo.query).toEqual({bar: 'baz'});
  });
});

it('handles no matches gracefully');
it('respects trailing slashes by default');
it('optionally ignores trailing slashes');


