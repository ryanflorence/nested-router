var React = require('react');
var { map, match } = require('nested-router');

var fetch = require('./utils/fetch');
var users = require('./routes/users');
var user = require('./routes/user');
var notFound = require('./routes/notFound');

var routes = map((defRoute) => {
  defRoute('/', users, (defRoute) => {
    defRoute('/user/:id', user);
  });
  defRoute('/(.*)', notFound);
});

var render = () => {
  var path = window.location.hash.substr(1);
  var { handlers, params } = match(path, routes);

  fetch(handlers, params).then((data) => {
    var element = handlers.reduceRight((element, handler) => {
      return handler.render(data, element);
    }, null);
    React.render(element, document.body);
  });
};

window.addEventListener('hashchange', render, false);
render();

