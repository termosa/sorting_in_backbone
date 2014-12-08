(function () {
  "use strict";
  var ComponentsExtension = function (constructor, destructor) {
    return function ComponentExtension(component) {
      var args, scope;

      scope = {};
      args = Array.prototype.slice.apply(arguments);
      if (false === constructor.apply(scope, args)) {
        throw new Error("Can not apply extension");
      }

      return function (options) {
        return destructor.apply(scope, [options].concat(args));
      };
    };
  };

  window.ComponentsExtension = ComponentsExtension;
})();
