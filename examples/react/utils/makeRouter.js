var React = require('react');
var fetch = require('./fetch');
var validateTransition = require('./validate');
var { match } = require('../../../index');

var makeRouter = module.exports = (routes, location) => {
  var transient = {
    ref: {},
    handlers: [],
    aborted: false,
    path: ''
  };

  var restoreUrl = () => {
    transient.aborted = true;
    location.push(transient.path);
  };

  location.listen(() => {
    if (transient.aborted)
      return (transient.aborted = false);

    if (!validateTransition(transient.handlers, transient.ref))
      return restoreUrl();

    var path = location.getPath();
    var { handlers, params } = match(path, routes);

    transient.handlers = handlers;
    transient.path = path;

    fetch(handlers, params).then((data) => {
      var element = handlers.reduceRight((element, handler) => {
        return handler.render(data, element);
      }, null);
      transient.ref = React.render(element, document.body);
    });
  });
};


