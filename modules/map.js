var pathToRegexp = require('path-to-regexp');

var map = module.exports = (getMatches, parent) => {
  var routes = [];
  getMatches((path, props, getChildMatches) => {
    if ('function' === typeof props)
      getChildMatches = props;
    var route = { path, props, parent };
    route.matcher = makePathMatcher(path);
    route.children = getChildMatches ? map(getChildMatches, route) : [];
    routes.push(route);
  });
  return routes;
};

var makePathMatcher = (path) => {
  var keys = [];
  var regexp = pathToRegexp(path, keys);
  return { keys, regexp };
};

