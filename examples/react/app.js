var React = require('react');
var { map, match } = require('nested-router');

var location = require('./utils/location');
var fetch = require('./utils/fetch');
var validate = require('./utils/validate');

var users = require('./routes/users');
var user = require('./routes/user');
var newUser = require('./routes/newUser');
var notFound = require('./routes/notFound');

var transient = {
  ref: {},
  handlers: [],
  aborted: false,
  path: ''
};

var routes = map((defRoute) => {
  defRoute('/user/new', newUser);
  defRoute('/', users, (defRoute) => {
    defRoute('/user/:id', user);
  });
  defRoute('/(.*)', notFound);
});

var render = () => {
  if (transient.aborted) {
    transient.aborted = false;
    return;
  }

  var path = window.location.hash.substr(1);
  var { handlers, params, path } = match(path, routes);

  if (!validate(transient.handlers, transient.ref)) {
    transient.aborted = true;
    return location.push(transient.path);
  }

  transient.handlers = handlers;
  transient.path = path;

  fetch(handlers, params).then((data) => {
    var element = handlers.reduceRight((element, handler) => {
      return handler.render(data, element);
    }, null);
    transient.ref = React.render(element, document.body);
  });
};

window.addEventListener('hashchange', render, false);
render();

