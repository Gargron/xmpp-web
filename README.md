# XMPP Web

[![Join the chat at https://gitter.im/Gargron/xmpp-web](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Gargron/xmpp-web?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Flattr this!](https://button.flattr.com/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=Gargron&url=https%3A%2F%2Fgithub.com%2FGargron%2Fxmpp-web)

The client is live on <https://zeonfed.org>.

## Usage

    npm install
    npm start

For generating static assets for production:

    npm run build

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

- Track recently used stickers
- Manage sticker inventory subscriptions/trust, send along inventory URL
- Stickers "shop" dialog for managing inventories, choosing popout selection
- XEP-0077: Changing password
- XEP-0045: Multi-User Chat

## Nice to haves but probably far off

- XEP-0313: Message Archive Management
- OMEMO support

## Stickers XEP

This implementation has a chat stickers feature. For discussion/spec, refer to [Issue #3](https://github.com/Gargron/xmpp-web/issues/3)
