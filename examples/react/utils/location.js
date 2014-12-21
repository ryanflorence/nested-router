var loc = window.location;

exports.back = () => {
  History.length -= 1;
  window.history.back();
};

exports.replace = (path) => {
  return loc.replace(`${loc.pathname}#/${path}`);
};

exports.push = (path) => {
  return loc.hash = path;
};

exports.getPath = () => {
  return window.location.hash.substr(1);
};

