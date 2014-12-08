jQuery(function ($) {
  var store = window.store;
  var $list = $('.paragraphs');
  var template = _.template('<p class="bg-primary" data-id="<%=id%>"><strong>[index: <%=index%>]</strong>&nbsp;&nbsp;&nbsp;<%=text%></p>');

  (function __buildHtml () {
    var html = '';
    store.each(function (item) {
      html += template(item.attributes);
    });
    $list.html(html);
  })();

  (function __initSortableCollection () {
    // destory is callback that will kill all handlers
    var destroy = window.manageBackboneIndex(store, {});
    // manageBackboneIndex will create saveIndex method for each model
  })();
  
  (function __initSortableView () {
    $list.sortable({
      stop: function (e, opt) {
        var $item = opt.item;
        var item = store.get(+$item.data('id'));
        var $prev = $item.prev();

        // If element was dropped in first position
        // Just set position to 1
        if ($prev.length === 0) {
          item.saveIndex(1);
          return;
        }

        var prev = store.get(+$prev.data('id'));
        var oldIndex = +item.get('index');
        var prevIndex = +prev.get('index');

        if (oldIndex < prevIndex) {
          // If element was dropped below
          // Set index to the position as previoues element
          item.saveIndex(prevIndex);
        } else {
          // If element was dropped above
          // Set index to the position that is
          // one more then previoues element
          item.saveIndex(prevIndex + 1);
        }
      }
    });
  })();

  window.test = function () {
    _.each(store.sortBy(function (model) {
      return model.get('index');
    }), function (model) {
      console.log('[' + model.get('id') + ': ' + model.get('index') + ']');
    });
  };
});
