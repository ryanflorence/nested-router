var pathToRegexp = require('path-to-regexp');
var qs = require('qs');

var map = exports.map = (getMatches, parent) => {
  var routes = [];
  getMatches((path, props, getChildMatches) => {
    if ('function' === typeof props)
      getChildMatches = props;
    var route = { path, props, parent };
    route.matcher = makePathMatcher(path);
    route.children = (getChildMatches && map(getChildMatches, route) || []);
    routes.push(route);
  });
  return routes;
};

var run = exports.run = (routes, path, callback) => {
  var { pathname, query } = parsePath(path);
  var route = matchDeepestRoute(routes, pathname);
  var params = parseParams(route, pathname);
  var query = parseQuery(query);
  var routes = flattenRoute(route);
  callback({ path, routes, params, query });
};

var parseQuery = (query) => {
  return qs.parse(query) || {};
};

var parsePath = (path) => {
  var split = path.split('?');
  return { pathname: split[0], query: split[1] };
};

var parseParams = (route, path) => {
  var { keys, regexp } = route.matcher;
  return regexp.exec(path).slice(1).reduce((params, value, index) => {
    params[keys[index].name] = value;
    return params;
  }, {});
};

var matchDeepestRoute = (routes, path) => {
  return routes.reduce((siblingMatch, route) => {
    if (siblingMatch)
      return siblingMatch;
    var childMatch = matchDeepestRoute(route.children, path);
    if (childMatch)
      return childMatch;
    var selfMatch = route.matcher.regexp.test(path);
    if (selfMatch)
      return route;
  }, null);
};

var flattenRoute = (route) => {
  var routes = [];
  var parent = route;
  while (parent) {
    routes.unshift(copyRoute(parent));
    parent = parent.parent;
  }
  return routes;
};

var copyRoute = (route) => {
  return {
    props: route.props,
    path: route.path,
  };
};

var makePathMatcher = function(path) {
  var keys = [];
  var regexp = pathToRegexp(path, keys);
  return { keys, regexp };
};

