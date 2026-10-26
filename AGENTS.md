<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project decisions

- Package USD prices (`priceUsd`) are admin-entered and stored in localStorage (`siraj_package_usd_prices`); the external Siraaj backend has no USD field, so `mapPackage` merges stored values on load and `toPackageRequest` sends `priceUsd` (harmlessly ignored server-side). Keep this flow when touching package APIs.
- Brand accent is the project orange `#F45B06` (`--accent`); package badges use it, teal `#44C3C6` (`--primary`) stays the primary color.
- The footer is the navy block (`#132439`, `.site-footer` in `src/styles.css`) with rounded top — do not revert to the white footer.
