let moment = require('moment');

const BASE64_MARKER = ';base64,';

let Utils = {

  daysDiffer (a, b) {
    return !moment(a.get('time')).isSame(b.get('time'), 'day');
  },

  dataURLToArrayBuffer (dataURL) {
    let parts     = dataURL.split(BASE64_MARKER);
    let raw       = window.atob(parts[1]);
    let rawLength = raw.length;

    let bytes = new Uint8Array(rawLength);

    for(let i = 0; i < rawLength; ++i) {
      bytes[i] = raw.charCodeAt(i);
    }

    return bytes.buffer;
  },

  dataURLToBlob (dataURL) {
    let parts       = dataURL.split(BASE64_MARKER);
    let contentType = parts[0].split(':')[1];
    let arrayBuffer = this.dataURLToArrayBuffer(dataURL);

    return new Blob([arrayBuffer], { type: contentType });
  },

  imageToSha1 (dataURL) {
    let arrayBuffer = this.dataURLToArrayBuffer(dataURL);
    let wordArray   = CryptoJS.lib.WordArray.create(arrayBuffer);
    let sha1sum     = CryptoJS.SHA1(wordArray);

    return sha1sum.toString(CryptoJS.enc.Hex);
  },

  escapeHTML (html) {
    let textarea = document.createElement('textarea');
    textarea.textContent = html;
    return textarea.innerHTML;
  },

  parseVCard (stanza) {
    let nickname = '';
    let photo    = '';

    if (stanza.querySelectorAll('NICKNAME').length > 0) {
      nickname = stanza.querySelector('NICKNAME').textContent;
    }

    if (stanza.querySelectorAll('N').length > 0) {
      if (stanza.querySelectorAll('N GIVEN').length > 0) {
        nickname = stanza.querySelector('N GIVEN').textContent;
      }

      if (stanza.querySelectorAll('N FAMILY').length > 0) {
        nickname = nickname + " " + stanza.querySelector('N FAMILY').textContent;
      }
    }

    if (stanza.querySelectorAll('PHOTO').length > 0) {
      photo = 'data:' + stanza.querySelector('PHOTO TYPE').textContent + ';base64,' + stanza.querySelector('PHOTO BINVAL').textContent;
    }

    return {
      vcard: {
        nickname: nickname,
        photo:    photo,
      },
    };
  },

  userDisplayData (u, fallback) {
    if (typeof u === 'undefined') {
      return {
        jid:     fallback,
        name:    fallback,
        initial: fallback.substr(0, 1).toUpperCase(),
        photo:   '',
        status:  'Not in your contacts',
        state:   '',
      };
    }

    let jid     = u.get('jid');
    let name    = jid;
    let initial = name.substr(0, 1).toUpperCase();
    let status  = 'Offline';
    let photo   = '';

    if (u.getIn(['vcard', 'nickname'], '') !== '') {
      name    = u.getIn(['vcard', 'nickname']);
      initial = name.substr(0, 1).toUpperCase();
    }

    if (u.get('name', null) != null) {
      name    = u.get('name');
      initial = name.substr(0, 1).toUpperCase();
    }

    if (u.get('resources', []).size > 0) {
      let topResource = u.get('resources').maxBy(function (r) {
        return r.get('priority');
      });

      status = topResource.get('status');
    }


    if (u.getIn(['vcard', 'photo'], '') !== '') {
      photo = u.getIn(['vcard', 'photo']);
    }

    return {
      jid:     jid,
      name:    name,
      initial: initial,
      photo:   photo,
      status:  status,
      state:   u.get('state'),
    };
  },

};

module.exports = Utils;
