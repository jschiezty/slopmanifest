# Contributing

Help make the manifesto worse in a better way.

## Good first contributions

- Add an original joke to `lib/manifesto-bank.ts`.
- Improve accessibility, mobile layout, loading states, or error messages.
- Fix a reproducible bug or suggest a small, on-theme interaction.

Open an issue for larger changes first. Keep proposals small and explain what changes.

## Adding a clause

The bank combines one opening, one proposition, and one ending. Propositions should be verb phrases that work after every opening. Endings should be complete sentences. The combination count follows the three arrays.

Keep satire aimed at software habits, AI hype, and corporate nonsense. Do not add private information, harassment, hate, impersonation, or material you lack permission to contribute. Avoid copying the original manifesto's text.

Run `npm test` after changing the bank. If its size changes, update user-facing text stating the number of combinations. The archive cap is a separate safety limit; do not raise it casually.

## Pull requests

1. Fork this repository and create a branch.
2. Make a focused change.
3. Run `npm test`, `npm run lint`, and `npm run build`. Note pre-existing failures or checks you could not run.
4. Include an explanation and screenshots for visual changes.
5. Submit a pull request for review.

Never commit credentials, database exports, visitor identifiers, network hashes, generated builds, or local runtime state. Test with local data only. Contributions are reviewed before reaching the live site; there is no automatic deployment.

Submitted contributions are licensed under this project's MIT license. Keep required notices for third-party material.
