var expect = require('expect');
var { map, match } = require('./index');

describe('matching', () => {
  var routes = map((match) => {
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
    var matchInfo = match('/b', routes);
    expect(matchInfo.handlers.length).toEqual(1);
    expect(matchInfo.path).toEqual('/b');
    expect(matchInfo.handlers[0].name).toEqual('b');
  });

  it('matches deepest routes', () => {
    var matchInfo = match('/a/b/b', routes);
    expect(matchInfo.handlers.length).toEqual(3);
    expect(matchInfo.path).toEqual('/a/b/b');
    expect(matchInfo.handlers[0].name).toEqual('a');
    expect(matchInfo.handlers[1].name).toEqual('a.b');
    expect(matchInfo.handlers[2].name).toEqual('a.b.b');
  });

  it('returns proper-looking match info', () => {
    var matchInfo = match('/a/b', routes);
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
    var matchInfo = match('/bersterbleghhthphht', routes);
    expect(matchInfo).toBe(null);
  });

  it('concats nested paths', () => {
    var routes = map((match) => {
      match('/foo', null, (match) => {
        match('bar', null, (match) => {
          match('baz', null);
        });
      });
    });
    expect(match('/foo', routes).handlers.length).toEqual(1);
    expect(match('/foo/bar', routes).handlers.length).toEqual(2);
    expect(match('/foo/bar/baz', routes).handlers.length).toEqual(3);
  });
});

describe('parameter parsing', () => {
  var routes = map((match) => {
    match('/:flavor', { name: 'a'}, (match) => {
      match('/:flavor/:food', { name: 'a.b'});
    });
  });

  it('generally works', () => {
    var matchInfo = match('/cheese/cake', routes);
    expect(matchInfo.params).toEqual({flavor: 'cheese', food: 'cake'});
  });
});

describe('query parsing', () => {
  var routes = map((match) => {
    match('/', null, (match) => {
      match('/foo', null);
    });
  });

  it('generally works', () => {
    var matchInfo = match('/foo?bar=baz', routes);
    expect(matchInfo.query).toEqual({bar: 'baz'});
  });
});

it('respects trailing slashes by default');
it('optionally ignores trailing slashes');

