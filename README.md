# The Slopcore Manifesto

**In defense of more.** A straight-faced, dark-mode counter-manifesto with an unnecessarily growing public archive.

[Read the live manifesto](https://slopmanifesto.jackschaffer.com/).

Each click combines a prepared opening, proposition, and ending, then saves the result for everyone. The initial collection has 10,000 distinct combinations. There is **no live AI call** and no model API key to supply.

## Contribute

Better terrible ideas are welcome. Add a proposition, improve the interface, fix a bug, or propose an idea in an issue. See [CONTRIBUTING.md](CONTRIBUTING.md).

The joke works best when the presentation stays serious and the writing does the work. Keep the dark-mode default, readable manifesto, and shared archive. A pull request does not automatically change the live site.

## Stack

- React and TypeScript on [Vinext](https://github.com/cloudflare/vinext)
- Cloudflare Workers and D1 for the shared archive
- Drizzle migrations
- CSS, with bundled starter UI components

This small project was built from a Sites/Vinext starter. Fuller starter notes are preserved in [docs/sites-starter.md](docs/sites-starter.md).

## Local setup

Use Node.js 22.13 or later and npm.

```sh
npm run install:ci
npm test
npm run build
```

The build creates the local Worker configuration. Apply each migration once, in order, to a **local** D1 database:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_overconfident_deathbird.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_fearless_master_chief.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_furry_micromacro.sql
npm run dev
```

Open the loopback URL printed by the server. `npm start` previews the built Worker instead. All preview data belongs in ignored `.wrangler/` state.

Generation requires the trusted Cloudflare `cf-connecting-ip` header. A local preview without this header returns 503 for generation. For a local API check, send a test header to your loopback server only:

```sh
curl http://127.0.0.1:5173/api/manifesto -H 'Content-Type: application/json' -H 'cf-connecting-ip: 192.0.2.1' --data '{"name":"Local test"}'
```

Use the actual port printed by the server. Never point tests at the live archive or configure a public proxy to trust arbitrary client-supplied IP headers.

## Behavior and privacy

- Optional display names are public and not identity-verified.
- At most three contributions per browser/network, a global ten-second cooldown, and a 10,000-entry archive cap.
- The database stores generated text, timestamps, optional names, random browser identifiers, and hashed network addresses. The public API omits browser and network identifiers.
- Limits are best-effort, not proof of a unique person. Shared networks share the allowance.
- A network-address hash is pseudonymous data, not strong anonymization. Do not publish production data or treat a public hash prefix as a secret.

This repository contains source and schema only: no live database, deployment credentials, or live Site project binding. Independent copies use a generic hash namespace. Provision your own Cloudflare resources and trusted proxy boundary before hosting a fork. Review retention, abuse handling, and dependency updates for your deployment.

## Status

The initial export passes the clause-bank tests and production build. `npm run lint` currently reports one inherited `react-hooks/set-state-in-effect` error in the initial archive-loading effect in `app/page.tsx`. This is a known cleanup item. Tests cover the prepared clause bank, not a complete security audit or full browser/API suite. Deployments stay maintainer-controlled. Check the archive and contribution limits before changing the live version.

## Credits and license

An independent response to [No AI Slop](https://www.slopmanifesto.com/), not affiliated with its creators, signatories, or any model provider. Model names in the acknowledgments are honorary, not endorsements or claims of authorship.

Project code and authored text are available under [MIT](LICENSE). Third-party material retains its existing licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
