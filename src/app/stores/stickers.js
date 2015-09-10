let Reflux    = require('reflux');
let Actions   = require('../actions');
let Immutable = require('immutable');
let moment    = require('moment');

let StickersStore = Reflux.createStore({

  getInitialState () {
    return Immutable.fromJS([
      {
        org:   'walfas',
        pack:  'misc',
        items: [
          'akari',
          'ichigo',
          'madoka',
        ],
      },
    ]);
  },

});

module.exports = StickersStore;
