var { map, match } = require('../../index');

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

var description = (props) => {
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

var index = (props) => {
  return `<h2>hello and welcome</h2>`;
};


var matchIndex = (match) => match('');

var routes = map((match) => {
  match('/', app, (match) => {
    matchIndex(match, index);
    match('/contacts/:id', user, (match) => {
      match('/contacts/:id/description', description);
    });
  });
  match('/(.*)', notFound);
});

var render = () => {
  var path = window.location.hash.substr(1);
  var { params, handlers } = match(path, routes);
  var html = handlers.reduceRight((html, handler, index) => {
    return handler({ params }, html);
  }, '');
  document.getElementById('app').innerHTML = html;
};

window.addEventListener('hashchange', render, false);
render();

