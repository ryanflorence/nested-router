var Promise = require('when').Promise;
var axios = require('axios');
var API = 'http://addressbook-api.herokuapp.com';

exports.get = (url) => {
  return axios.get(API+url).then((res) => res.data);
};

exports.post = (url, data) => {
  return axios.post(API+url, data).then((res) => res.data);
};

