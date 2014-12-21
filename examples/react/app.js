var { map } = require('../../index');

var makeRouter = require('./utils/makeRouter');
var location = require('./utils/location');

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

makeRouter(routes, location);

