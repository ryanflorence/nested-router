var all = require('when/keys').all;

var fetch = module.exports = (routes, params) => {
  return all(routes.filter((route) => {
    return route.fetch;
  }).reduce((promises, route) => {
    promises[route.name] = route.fetch(params);
    return promises;
  }, {}));
};

