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

        meta: {
          artist: 'Walfas',
          name:   'Miscellaneous',
        },

        items: [
          'akari',
          'ichigo',
          'madoka',
        ],
      },

      {
        org:  'hamze',
        pack: 'ahriticon',

        meta: {
          artist: '정언영',
          name:   'Ahriticon',
        },

        items: [
          'crying',
          'eating',
          'greeting',
        ],
      },
    ]);
  },

});

module.exports = StickersStore;
