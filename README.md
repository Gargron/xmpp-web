# XMPP Web

## Usage

    npm install
    npm start

## Implemented XEPs

- XEP-0054: vCards
- XEP-0153: vCard-based Avatars
- XEP-0085: Chat State Notifications
- XEP-0280: Message Carbons

## Road map

- Some form of infinite scrolling
- Persist roster in localStorage
- Desktop notifications
- Chrome compatibility (weird flexbox behaviour, MessageForm)

## Nice to haves but probably far off

- XEP-0184: Message Delivery Receipts
- XEP-0313: Message Archive Management
- OTR support
- INVENT A XEP FOR CUTE LOVE LIVE STICKERS

## Stickers XEP

Namespace: `http://jabber.zeonfederated.com/protocol/stickers`

The message stanza receives a new element, `<sticker>`, with the attribute `url`.

*FIXME: A combination of a sticker pack UID and sticker index would be better since we shouldn't load arbitrary URLs sent to us. The client would then build the URL out of that data based on a central trusted repository.*

If the element is present, the body of the message is ignored, the message is to be presented as a sticker.

*TODO: Service.. discovery..? Disable the stickers menu for chat partners whose clients do not support this feature, since the stickers would basically not be shown on their side anyway.*
