exports.encode = (path) => {
  return encodeURI(path).replace(/%20/g, '+');
};

exports.decode = (path) => {
  return decodeURI(path.replace(/\+/g, ' '));
};

