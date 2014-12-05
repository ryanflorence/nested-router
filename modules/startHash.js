var { encode } = require('./utils/path');

var startHash = module.exports = (callback) => {
  var onChange = makeOnChange(callback);
  addHashListener(onChange);
  setTimeout(onChange, 0);
  return { push, pop, replace, dispose: createDispose(onChange) };
};

var makeOnChange = (callback) => {
  return () => {
    ensureSlash();
    callback(getHash());
  };
};

var push = (path) => {
  window.location.hash = encode(path);
};

var pop = () => {
  window.history.back();
};

var replace = (path) => {
  path = `${window.location.pathname}#${encode(path)}`;
  window.location.replace(path);
};

var createDispose = (onChange) => {
  return () => {
    removeHashListener(onChange);
  }
};

var addHashListener = (onChange) => {
  if (window.addEventListener)
    window.addEventListener('hashchange', onChange, false);
  else
    window.attachEvent('onhashchange', onChange);
};

var removeHashListener = (onChange) => {
  if (window.addEventListener)
    window.removeEventListener('hashchange', onChange, false);
  else
    window.removeEvent('onhashchange', onChange);
};

var getHash = () => {
  return window.location.hash.substr(1);
};

var ensureSlash = () => {
  var path = getHash();
  if (path.charAt(0) !== '/')
    replace('/' + path);
}

// TODO: in react-router we are concerned about `_actionType`, but we don't
// actually know if they clicked the back button, or forward button, or
// manually manipulated. So if we can't know, maybe we shouldn't pretend
// like we do? That's why I left it out, open for discussion, ofc.

