var expect = require('expect');
var { map, run } = require('./index');

describe('matching', () => {
  var routes = map((match) => {
    match('/a', { name: 'a'}, (match) => {
      match('/a/a', { name: 'a.a'});
      match('/a/b', { name: 'a.b'}, (match) => {
        match('/a/b/a', { name: 'a.b.a' });
        match('/a/b/b', { name: 'a.b.b' });
        match('/a/b/c', { name: 'a.b.c' });
      });
    });
    match('/b', { name: 'b' });
  });

  it('matches shallowest routes', (done) => {
    run(routes, '/b', (state) => {
      expect(state.routes.length).toEqual(1);
      expect(state.path).toEqual('/b');
      expect(state.routes[0].props.name).toEqual('b');
      done();
    });
  });

  it('matches deepest routes', (done) => {
    run(routes, '/a/b/b', (state) => {
      expect(state.routes.length).toEqual(3);
      expect(state.path).toEqual('/a/b/b');
      expect(state.routes[0].props.name).toEqual('a');
      expect(state.routes[1].props.name).toEqual('a.b');
      expect(state.routes[2].props.name).toEqual('a.b.b');
      done();
    });
  });

  it('calls back with a proper-looking state', (done) => {
    run(routes, '/a/b', (state) => {
      expect(state).toEqual({
        path: '/a/b',
        params: {},
        query: {},
        routes: [
          { path: '/a', props: { name: 'a' } },
          { path: '/a/b', props: { name: 'a.b' } }
        ]
      });
      done();
    });
  });

  it('passes a copy of route data');
  it('does not copy user props');
  it('respects trailing slashes by default');
  it('optionally ignores trailing slashes');
});

describe('parameter parsing', () => {
  var routes = map((match) => {
    match('/:flavor', { name: 'a'}, (match) => {
      match('/:flavor/:food', { name: 'a.b'});
    });
  });

  it('generally works', (done) => {
    run(routes, '/cheese/cake', (state) => {
      expect(state.params).toEqual({flavor: 'cheese', food: 'cake'});
      done();
    });
  });
});

describe('match', () => {
  it('has optional props', (done) => {
    var routes = map((match) => {
      match('/', (match) => {
        match('/foo');
      });
    });
    run(routes, '/foo', (state) => {
      expect(state.routes.length).toEqual(2);
      done();
    });
  });
});

describe('query parsing', () => {
  var routes = map((match) => {
    match('/', (match) => {
      match('/foo', { name: 'foo'});
    });
  });

  it('generally works', (done) => {
    run(routes, '/foo?bar=baz', (state) => {
      expect(state.query).toEqual({bar: 'baz'});
      done();
    });
  });
});

it('deals with hashes and hashes with query strings');

