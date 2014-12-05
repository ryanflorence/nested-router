var Router = require('nested-router');

var link = (path, text) => {
  return `<a href="${path}">${text}</a>`;
};

var app = (props, children) => {
  return `
    <h1>App</h1>
    <ul>
      <li>${link('#/contacts/ryan', 'Ryan')}</li>
      <li>${link('#/contacts/michael', 'Michael')}</li>
    </ul>
    <div>
      ${children}
    </div>
  `;
};

var user = (props, children) => {
  var descriptionLink = link('#/contacts/'+props.params.id+'/description', 'description');
  return `
    <h2>user: ${props.params.id}</h2>
    <p>${descriptionLink}</p>
    ${children}
  `;
};

var description = (props, child) => {
  return `
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
      occaecat cupidatat non proident, sunt in culpa qui officia deserunt
      mollit anim id est laborum.
    </p>
  `;
};

var notFound = (props) => {
  return `<h1>Not found :(</h1>`;
};

var matchPath = Router.map((match) => {
  match('/', app, (match) => {
    match('/contacts/:id', user, (match) => {
      match('/contacts/:id/description', description);
    });
  });
  match('/(.*)', notFound);
});

Router.startHash((path) => {
  var matchInfo = matchPath(path);
  var html = matchInfo.handlers.reduceRight((html, handler, index) => {
    return handler(matchInfo, html);
  }, '');
  document.getElementById('app').innerHTML = html;
});

