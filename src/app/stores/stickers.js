let Reflux    = require('reflux');
let Actions   = require('../actions');
let Immutable = require('immutable');
let moment    = require('moment');

let StickersStore = Reflux.createStore({

  getInitialState () {
    if (typeof this.store === 'undefined') {
      this.store = Immutable.fromJS([
        {
          org:   'walfas',
          pack:  'misc',
          items: [
            'aikatsu',
          ],
        },
      ]);
    }

    return this.store;
  },

});

module.exports = StickersStore;
