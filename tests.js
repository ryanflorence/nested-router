var expect = require('expect');
var { map, startHash } = require('./index');

var BROWSER = 'object' === typeof window;
if (!BROWSER)
  console.warn('BROWSER TESTS WILL NOT BE RUN BECAUSE YOU ARE NOT IN A BROWSER');

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

  it('calls back with a proper-looking match info', () => {
    var matchInfo = matchPath('/a/b');
    expect(matchInfo).toEqual({
      path: '/a/b',
      params: {},
      query: {},
      handlers: [{ name: 'a' }, { name: 'a.b' }]
    });
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

if (BROWSER) {
  describe('startHash', () => {
    beforeEach(() => {
      window.location.hash = '';
    });

    it('callsback with the hash url', (done) => {
      window.location.hash = '/foo/bar';
      var listener = startHash((path) => {
        expect(path).toEqual('/foo/bar');
        listener.dispose();
        done();
      });
    });

    //it('replaces the url', (done) => {
      //startHash((path, actions) => {
        //expect(path).toEqual('/foo/bar');
        //done();
      //});
    //});
  });
}

it('handles no matches gracefully');
it('respects trailing slashes by default');
it('optionally ignores trailing slashes');


