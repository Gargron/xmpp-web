# XMPP Web

The client is live on <https://zeonfed.org>.

## Usage

    npm install
    npm start

## Implemented XEPs

- XEP-0054: vCards
- XEP-0153: vCard-based Avatars
- XEP-0085: Chat State Notifications
- XEP-0280: Message Carbons
- XEP-0092: Software Version
- XEP-0012: Last Activity
- XEP-0333: Chat Markers
- XEP-0184: Message Delivery Receipts

## Road map

- Some form of infinite scrolling
- Persist roster in localStorage
- Desktop notifications
- Favicon
- XEP-0077: Changing password
- XEP-0045: Multi-User Chat
- Improve UI in the event of a lost connection

## Nice to haves but probably far off

- XEP-0313: Message Archive Management
- OTR support

## Stickers XEP

I doubt this XEP would ever get accepted as a proper, acknowledged protocol extension, for one because it is not very serious, and also because it *has*, at least in its current form, to rely on a central trusted authority who hosts the stickers. However, stickers are a great feature of such apps as FB Messenger and LINE, and it would be a shame if the reason an open and federated protocol like XMPP lost out to those walled garden apps just because of stickers. So here we are.

XML Namespace: `http://jabber.zeonfederated.com/protocol/stickers`

The message stanza receives a new element, `<sticker>`, with the attribute `uid`. That attribute is a dot-concatenated sequence of organization name, pack name, and sticker ID (e.g. `pusheen.halloween.pumpkin`).

If the element is present, the body of the message is ignored, the message is to be presented as a sticker. The `uid` is to be converted into an image URL beginning with the sticker authority website and ending with `.png`.
