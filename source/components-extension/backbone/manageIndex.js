(function () {
  "use strict";
  var getDefaultOptions, manageIndex, listenChanges,
    helpToFindPrev, helpToShift,
    ignoreProperty, triggerUpdateId;

  ignoreProperty = "__ignoreManagingIndex";
  triggerUpdateId = "update-indexes";

  helpToShift = function (opts, target, src, dst, groupByValue) {
    var indexAttr, listChain, start, end, shift, maxIndex, triggerOptions;

    indexAttr = opts.indexAttr;
    listChain = opts.collection.chain();
    if (opts.groupBy) {
      listChain = listChain.filter(function (model) {
        return model.get(opts.groupBy) === groupByValue;
      });
    }
    maxIndex = listChain.value().length ? _.max(listChain.value(), function (m) {
      return m.get(indexAttr);
    }).get(indexAttr) : 0;

    if (!_.isNumber(src)) {
      start = dst;
      end = maxIndex;
      shift = 1;
    } else if (!_.isNumber(dst)) {
      start = src;
      end = maxIndex;
      shift = -1;
    } else if (src < dst) {
      start = src;
      end = dst;
      shift = -1;
    } else if (src > dst) {
      start = dst;
      end = src;
      shift = 1;
    } else return;

    (triggerOptions = {})[ignoreProperty] = true;

    listChain
      .filter(function (model) {
        var index = model.get(indexAttr);
        return model !== target && index >= start && index <= end;
      })
      .each(function (model) {
        model.attributes[indexAttr] += shift;
        model.trigger("change:" + indexAttr, model, model.attributes[indexAttr], triggerOptions);
        model.trigger("change", model, triggerOptions);
      });
  };

  getDefaultOptions = (function () {
    var options;

    options = {
      //async:     false,   // Saving of index
      indexAttr: "index", // Index attribute
      groupBy: false,   // Manage index in groups
      success: null,    // Callback on successful saving
      error: null     // Callback on failed saving
    };

    return function () {
      return _.clone(options);
    };
  })();

  helpToFindPrev = function (model, opts) {
    var list, prevIndex, filter;

    prevIndex = model.get(opts.indexAttr) - 1;
    if (prevIndex === -1) return null;

    if (opts.groupBy) {
      (filter = {})[opts.groupBy] = model.get(opts.groupBy);
      list = opts.collection.where(filter);
    } else {
      list = opts.collection.filter();
    }

    return _.find(list, function (maybeBefore) {
        return maybeBefore.get(opts.indexAttr) === prevIndex;
      }) || null;
  };

  (function __listening() {
    var getListeners;

    getListeners = function (opts) {
      var listeners;

      listeners = {};
      listeners.add = function (model, collection, options) {
        if (options[ignoreProperty] || !model.isNew()) return;
        opts.mixinModel(model);
        //TODO: Add to index list
      };
      listeners.remove = function (model, collection, options) {
        var groupByValue;
        if (options[ignoreProperty]) return;
        opts.cleanModel(model);
        opts.groupBy && (groupByValue = model.get(opts.groupBy));
        helpToShift(opts, model, model.get(opts.indexAttr), null, groupByValue);
      };

      return listeners;
    };

    listenChanges = function (opts) {
      var listeners, stopListening, collection;

      collection = opts.collection;
      listeners = getListeners(opts);
      _.each(listeners, function (handler, event) {
        collection.on(event, handler);
      });
      stopListening = function () {
        _.each(listeners, function (handler, event) {
          collection.off(event, handler);
        });
      };

      return stopListening;
    };
  })();

  manageIndex = function (collection, options) {
    var destroy, stopListening, saveIndex;

    options = _.extend(getDefaultOptions(), options);
    options.collection = collection;

    saveIndex = function (index, groupByValue) {
      var triggerOptions, model, attrs, oldIndex, oldGroupByValue, xhr, ifUpdateGroup;

      model = this;
      (triggerOptions = {})[ignoreProperty] = true;
      attrs = {};
      ifUpdateGroup = options.groupBy && model.get(options.groupBy) !== groupByValue;
      oldIndex = model.get(options.indexAttr);
      ifUpdateGroup && (oldGroupByValue = model.get(options.groupBy));
      attrs[options.indexAttr] = index;
      ifUpdateGroup && (attrs[options.groupBy] = groupByValue);

      _.each(attrs, function (value, key) {
        model.attributes[key] = value
      });

      _.each(attrs, function (value, key) {
        model.trigger("change:" + key, model, value, triggerOptions)
      });
      model.trigger("change", model, triggerOptions);

      if (options[ignoreProperty]) return;
      if (ifUpdateGroup) {
        helpToShift(options, model, oldIndex, null, oldGroupByValue);
        helpToShift(options, model, null, index, model.get(options.groupBy));
      } else {
        helpToShift(options, model, oldIndex, index, model.get(options.groupBy));
      }
      options.collection.trigger(triggerUpdateId);
    };
    options.mixinModel = function (model) {
      model.saveIndex = saveIndex;
    };
    options.cleanModel = function (model) {
      delete model.saveIndex;
    };
    stopListening = listenChanges(options);

    collection.each(options.mixinModel);
    destroy = function () {
      stopListening();
      collection.each(options.cleanModel);
    };
    return destroy;
  };

  window.manageBackboneIndex = manageIndex;
})();
