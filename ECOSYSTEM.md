# Ecosystem Position: skin-zone

> This repository is part of the [SkinTwin-AI ecosystem](https://github.com/jax-a11y/skintwin-ecosystem-design).
> Its machine-readable manifest lives at [`.skintwin/manifest.json`](./.skintwin/manifest.json), and the
> ecosystem-wide source of truth is `registry/ecosystem.json` in the hub repo.

**Layer:** governance · **Role:** marketplace-design-docs

Skin Zone is the architecture and design documentation for a multi-tenant beauty
marketplace covering ingredients, products, brands, salons, treatments, and
therapists, including the HGNN database schema, AppDirect integration, and
Shopify marketplace topology designs. Within the SkinTwin-AI ecosystem it sits
in the governance layer as a design blueprint (design alias:
`business-directory-template (design)`) — it documents the marketplace concept
rather than running any service, and implementation repos such as the
marketplace admin/buyer apps realize the surfaces it describes.

## Provides

Nothing — this is a design-documentation repo; it exposes no runtime contracts.

## Consumes

Nothing — as pure architecture docs it calls no ecosystem APIs or datasets.

## CI

CI runs via this repo's own `ci.yml` workflow (markdown lint and consistency
checks); it does not call the ecosystem's reusable templates. Reusable
`workflow_call` CI templates are available in the hub repo — see `ci/README.md`
in [skintwin-ecosystem-design](https://github.com/jax-a11y/skintwin-ecosystem-design).
