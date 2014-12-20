var axios = require('axios');
var API = 'http://addressbook-api.herokuapp.com';

exports.get = (url) => {
  return axios.get(API+url);
};

