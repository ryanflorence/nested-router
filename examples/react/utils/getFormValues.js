var getFormValues = module.exports = (form) => {
  var elements = form.elements;
  return [].filter.call(elements, function(element) {
    return element.getAttribute('name');
  }).reduce(function(values, element) {
    values[element.getAttribute('name')] = element.value;
    return values;
  }, {});
};

