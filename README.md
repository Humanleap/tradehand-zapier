# Tradehand for Zapier

Find UK tradespeople and trade businesses inside a Zap. Every step reads
Tradehand's public directory and needs no sign-in.

- Homepage: https://tradehand.com
- API docs: https://tradehand.com/.well-known/openapi.json

## Directory description

Tradehand is a UK app where customers find and book local tradespeople, and trade businesses run their admin.

## Category

`commerce`, the closest fit for a marketplace of local trades.

## Steps

All three are searches. A search that finds nothing returns an empty result, as
Zapier requires. A bad input (an unknown trade, postcode or place) stops the
step with Tradehand's own sentence.

- **Find Trader**: pick a trade, then give a postcode or a town or city. Returns
  up to 10 matching traders. Zapier uses the first.
- **Find Trader by Reference**: give a public reference and get that trader's
  name, trade, accreditations and profile link.
- **Find Trader Services**: give a public reference and get the trader's details
  plus the list of services they offer, ready to use as line items.

The Trade dropdown is filled by a hidden trigger, Trade List, which reads every
trade Tradehand lists.

## Develop

```
pnpm install
pnpm exec zapier-platform test       # runs against production, no account needed
pnpm exec zapier-platform validate
pnpm exec zapier-platform push --skip-dep-install
```
