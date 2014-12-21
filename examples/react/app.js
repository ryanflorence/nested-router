var React = require('react');
var { map, match } = require('nested-router');

var location = require('./utils/location');
var fetch = require('./utils/fetch');
var validateTransition = require('./utils/validate');

var users = require('./routes/users');
var user = require('./routes/user');
var newUser = require('./routes/newUser');
var notFound = require('./routes/notFound');

var routes = map((defRoute) => {
  defRoute('/user/new', newUser);
  defRoute('/', users, (defRoute) => {
    defRoute('/user/:id', user);
  });
  defRoute('/(.*)', notFound);
});

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

var handleTransition = () => {
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
};

window.addEventListener('hashchange', handleTransition, false);
handleTransition();

