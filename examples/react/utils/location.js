var loc = window.location;

exports.back = () => {
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

exports.listen = (listener) => {
  window.addEventListener('hashchange', listener, false);
  listener();
};

