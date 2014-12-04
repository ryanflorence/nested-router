var qs = require('qs');

var run = module.exports = (routes, path, callback) => {
  var { pathname, query } = parsePath(path);
  var route = matchDeepestRoute(routes, pathname);
  callback({
    path,
    params: parseParams(route, pathname),
    query: parseQuery(query),
    routes: flattenRoute(route)
  });
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

var flattenRoute = (parent) => {
  var routes = [];
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

