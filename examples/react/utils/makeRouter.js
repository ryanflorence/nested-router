var { match } = require('../../../index');
var React = require('react');
var all = require('when/keys').all;

var fetch = (routes, params) => {
  return all(routes.filter((route) => {
    return route.fetch;
  }).reduce((promises, route) => {
    promises[route.name] = route.fetch(params);
    return promises;
  }, {}));
};

var validateTransition = (routes, ref) => {
  return !routes.length || routes.filter((route) => {
    return route.validate;
  }).reduceRight((valid, route) => {
    return route.validate(ref);
  }, true);
};

var makeRouter = module.exports = (routes, location) => {

  var transient = {
    ref: {},
    handlers: [],
    aborted: false,
    path: ''
  };

  var mutateTransient = (changes) => {
    for (var key in changes)
      transient[key] = changes[key];
  };

  var restoreUrl = () => {
    mutateTransient({ aborted: true });
    location.push(transient.path);
  };

  location.listen(() => {
    if (transient.aborted)
      return mutateTransient({ aborted: false });

    if (!validateTransition(transient.handlers, transient.ref))
      return restoreUrl();

    var path = location.getPath();
    var { handlers, params } = match(path, routes);

    mutateTransient({ handlers, path });

    fetch(handlers, params).then((data) => {
      var element = handlers.reduceRight((element, route) => {
        return route.render(data, element);
      }, null);
      mutateTransient({ ref: React.render(element, document.body) });
    });
  });
};

