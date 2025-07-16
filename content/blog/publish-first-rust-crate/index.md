---
title: How to Publish Your First Rust Crate?
slug: publish-first-rust-crate
author: Mohammad Aziz
date: "2021-11-17"
description: "With crates, you share your work with other developers, learn how to publish your first crate."
tags:
  - rust
  - crate
  - publish
  - crates.io
cover:
  image: "blog/publish-first-rust-crate/images/red-lava.jpeg"
  caption: "Photo by [Björn Austmar Þórsson](https://www.pexels.com/@bjorn?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels) from [Pexels](https://www.pexels.com/photo/iceland-nature-space-dark-7267852/?utm_content=attributionCopyText&utm_medium=referral&utm_source=pexels)"
---

## You Need an Account

Before you start publishing any crate to crates.io, you first have to create an account.

- Go to [crates.io](https://crates.io/)
- Login with GitHub
- Verify your Email

## Then Login

- Create a New Token form [Account Settings](https://crates.io/me) in the API Access section
- Run the command you get to the login

## Get Your Project Ready

- Add the following fields in the Cargo.toml file
  - license or license-file
  - description
  - documentation
  - homepage or repository
- You need to commit your work before publishing
- Do a dry run by running

```
cargo publish --dry-run
```

- Fix any errors or warnings after the dry run

## And Publish

```
cargo publish
```

### Let the World Use Your Crate :)
