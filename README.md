# XMPP Web

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

## Road map

- Some form of infinite scrolling
- Persist roster in localStorage
- Desktop notifications
- XEP-0077: Changing password
- Favicon

## Nice to haves but probably far off

- XEP-0184: Message Delivery Receipts
- XEP-0313: Message Archive Management
- OTR support
- INVENT A XEP FOR CUTE LOVE LIVE STICKERS

## Stickers XEP

Namespace: `http://jabber.zeonfederated.com/protocol/stickers`

The message stanza receives a new element, `<sticker>`, with the attribute `uid`. That attribute is a dot-concatenated sequence of organization name, pack name, and sticker ID (e.g. `pusheen.halloween.pumpkin`).

If the element is present, the body of the message is ignored, the message is to be presented as a sticker.

*TODO: Service.. discovery..? Disable the stickers menu for chat partners whose clients do not support this feature, since the stickers would basically not be shown on their side anyway.*
