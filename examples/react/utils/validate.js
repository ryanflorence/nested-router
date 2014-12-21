var validate = module.exports = (routes, ref) => {
  return !routes.length || routes.filter((route) => {
    return route.validate;
  }).reduceRight((valid, route) => {
    return route.validate(ref);
  }, true);
};

