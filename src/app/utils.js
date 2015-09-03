const BASE64_MARKER = ';base64,';

let Utils = {

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

};

module.exports = Utils;
