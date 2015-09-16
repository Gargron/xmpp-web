let Reflux    = require('reflux');
let Actions   = require('../actions');
let Immutable = require('immutable');
let moment    = require('moment');

let StickersStore = Reflux.createStore({

  getInitialState () {
    return Immutable.fromJS([

      {
        org:  'dsp',
        pack: 'ducks',

        meta: {
          artist: 'Miles Arquio',
          name:   'Ducks',
        },

        items: [
          'genki',
          'laugh',
          'mad',
          'sad',
          'scared',
          'sleep',
        ],
      },

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

    ]);
  },

});

module.exports = StickersStore;
