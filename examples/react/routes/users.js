var React = require('react');
var api = require('../utils/api');

exports.name = 'users';

exports.fetch = (params) => {
  return api.get('/contacts').then((res) => {
    return res.contacts;
  });
};

exports.render = (props, child) => {
  var links = props.users.map((user) => {
    return (
      <li key={user.id}>
        <a href={"#/user/"+user.id}>{user.first} {user.last}</a>
      </li>
    );
  });

  return (
    <div>
      <h1>Users</h1>
      <ul>
        <li><a href="#/user/new">Add User</a></li>
        {links}
      </ul>
      {child}
    </div>
  );
};

