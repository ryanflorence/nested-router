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
      expect(state.matches.length).toEqual(1);
      expect(state.path).toEqual('/b');
      expect(state.matches[0].props.name).toEqual('b');
      done();
    });
  });

  it('matches deepest routes', (done) => {
    run(routes, '/a/b/b', (state) => {
      expect(state.matches.length).toEqual(3);
      expect(state.path).toEqual('/a/b/b');
      expect(state.matches[0].props.name).toEqual('a');
      expect(state.matches[1].props.name).toEqual('a.b');
      expect(state.matches[2].props.name).toEqual('a.b.b');
      done();
    });
  });

  it('calls back with a proper-looking state', (done) => {
    run(routes, '/a/b', (state) => {
      expect(state).toEqual({
        path: '/a/b',
        matches: [
          { path: '/a', props: { name: 'a' } },
          { path: '/a/b', props: { name: 'a.b' } }
        ]
      });
      done();
    });
  });

  it('passes a copy of router data');

  it('does not copy user props');
});
