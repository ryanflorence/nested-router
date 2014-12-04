var clone = require('clone');

var map = exports.map = (fn, parent) => {
  var routes = [];
  fn((path, props, fn) => {
    var route = { path, props, parent };
    route.children = (fn && map(fn, route) || []);
    routes.push(route);
  });
  return routes;
};

var run = exports.run = (routes, location, callback) => {
  callback({
    matches: flattenRoute(matchDeepestRoute(routes, location)),
    path: location
  });
};

var matchDeepestRoute = (routes, path) => {
  return routes.reduce((siblingMatch, route) => {
    if (siblingMatch)
      return siblingMatch;
    var childMatch = matchDeepestRoute(route.children, path);
    if (childMatch)
      return childMatch;
    var selfMatch = routeDoesMatch(route.path, path);
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

var routeDoesMatch = (routePath, actualPath) => {
  return routePath === actualPath;
};

var copyRoute = (route) => {
  var copy = clone(route, true, 1);
  delete copy.parent;
  delete copy.children;
  return copy;
};

