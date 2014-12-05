var pathToRegexp = require('path-to-regexp');
var qs = require('qs');

exports.version = require('./package.json').version;

var map = exports.map = (getMatches, parent) => {
  var routes = [];
  getMatches((path, handler, getChildMatches) => {
    path = inheritPath(path, parent && parent.path);
    var route = { path, handler, parent };
    route.matcher = makePathMatcher(path);
    route.children = getChildMatches ?
      map(getChildMatches, route) : [];
    routes.push(route);
  });
  return routes;
};

var match = exports.match = (path, routes) => {
  var { pathname, query } = parsePath(path);
  var route = matchDeepestRoute(routes, pathname);
  return route ? {
    path,
    params: parseParams(route, pathname),
    query: parseQuery(query),
    handlers: getHandlers(route)
  } : null;
};

var inheritPath = (childPath, parentPath) => {
  return (parentPath && childPath.charAt(0) !== '/') ?
    `${parentPath}/${childPath}` : childPath;
};

var makePathMatcher = (path) => {
  var keys = [];
  var regexp = pathToRegexp(path, keys);
  return { keys, regexp };
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

var getHandlers = (route) => {
  var handlers = [];
  while (route) {
    handlers.unshift(route.handler);
    route = route.parent;
  }
  return handlers;
};

