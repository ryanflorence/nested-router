var React = require('react');
var api = require('../utils/api');

exports.name = 'user';

exports.fetch = (params) => {
  return api.get(`/contacts/${params.id}`).then((res) => {
    return res.data.contact;
  }, (err) => {
    return { error: 'NOT_FOUND'};
  });
};

exports.render = (props, child) => {
  var user = props.user;
  if (user.error)
    return location.replace(`${location.pathname}#/not-found`);
  return (
    <div>
      <h2>{user.first} {user.last}</h2>
      <img key="avatar" src={user.avatar} height="100"/>
    </div>
  );
};

