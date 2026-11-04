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

- The brand logo renders exclusively through `src/siraaj/components/BrandLockup.tsx` over `src/assets/siraj-logo-transparent.png`; never re-import the white-background `siraj-logo-icon-only.jpeg`.
- Package USD prices (`priceUsd`) are admin-entered and stored in localStorage (`siraj_package_usd_prices`); the external Siraaj backend has no USD field, so `mapPackage` merges stored values on load and `toPackageRequest` sends `priceUsd` (harmlessly ignored server-side). Keep this flow when touching package APIs. In English the USD price is the primary display price via `src/siraaj/price.ts` (`usdAmount`, display-only fallback of 3.75 SAR/USD when no admin rate exists); payment amounts sent to the backend stay in SAR.
- Package cards show one price unless a real discount exists: `hasRealOriginalPrice` hides any `originalPrice` that is not greater than the discounted price.
- Brand accent is the project orange `#F45B06` (`--accent`); package badges use it, teal `#44C3C6` (`--primary`) stays the primary color.
- The footer stays navy: a dark `#0b1622` outer frame (`.site-footer`) with a curved top wave and an inner rounded navy panel (`#132439`, `.site-footer-panel` in `src/styles.css`) — do not revert to the white footer.
