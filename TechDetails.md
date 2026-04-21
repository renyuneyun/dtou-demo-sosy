## Information about Solid-DToU

It is a part of my research in Oxford, and we have a paper accepted at WWW 2024. Its key part is the DToU language and reasoner, and we have integrated it with Solid (through additional API endpoints).

Paper: https://arxiv.org/abs/2403.07587

Repo: https://github.com/renyuneyun/solid-dtou
    Corresponding Github Pages: https://me.ryey.icu/solid-dtou/
    It contains links to my existing implementations, including an earlier version of a demo app

Spec: https://me.ryey.icu/solid-dtou/dtou-spec.html
    It's roughly complete, IIRC

## Code locations

All code are also available locally, under `../../oxford/reasoning` (denoted as `$ROOT`):

- Meta repo: `$ROOT/solid-dtou`
- Custom CSS (Community Solid Server) code: `$ROOT/community-server`
    - It contains a submodule for DToU reasoner, at specific commits
- DToU reasoner (note commit version): `$ROOT/dtou`
- Previous demo app (accompanying paper): `$ROOT/dtou-demo-app`