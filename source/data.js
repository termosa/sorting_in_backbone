(function () {
  var mock = [
    {
      id: 1,
      index: 1,
      text: 'Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.'
    },
    {
      id: 2,
      index: 2,
      text: 'Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.'
    },
    {
      id: 3,
      index: 3,
      text: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
    },
    {
      id: 4,
      index: 4,
      text: 'Donec id elit non mi porta gravida at eget metus. Maecenas faucibus mollis interdum.'
    },
    {
      id: 5,
      index: 5,
      text: 'Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Cras mattis consectetur purus sit amet fermentum.'
    },
    {
      id: 6,
      index: 6,
      text: 'Maecenas sed diam eget risus varius blandit sit amet non magna.'
    }
  ];

  var store = window.store = new Backbone.Collection(mock);
  //
})();
