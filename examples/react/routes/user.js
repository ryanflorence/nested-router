var React = require('react');
var api = require('../utils/api');
var location = require('../utils/location');

exports.name = 'user';

exports.fetch = (params) => {
  return api.get(`/contacts/${params.id}`).then((res) => {
    return res.contact;
  }, (err) => {
    return { error: 'NOT_FOUND'};
  });
};

exports.render = (props, child) => {
  var user = props.user;
  if (user.error)
    return location.replace('/not-found');
  return (
    <div>
      <h2>{user.first} {user.last}</h2>
      <img key={user.id} src={user.avatar} height="100"/>
    </div>
  );
};

