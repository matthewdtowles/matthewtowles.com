---
title: noenvy
tagline: Encrypts your .env into a vault keyed by the OS keyring, then injects secrets at the process boundary.
status: active
role: Sole engineer
stack: [Go, Homebrew]
links:
  - label: Full install guide for every platform
    url: https://github.com/matthewdtowles/noenvy#install
    type: docs
install:
  - platform: macOS
    command: brew install matthewdtowles/tap/noenvy
  - platform: Debian and Ubuntu
    command: sudo apt install noenvy
    note: After a one time repository setup. Every package is GPG verified end to end.
repos:
  - name: noenvy
    url: https://github.com/matthewdtowles/noenvy
    role: CLI
    language: Go
  - name: homebrew-tap
    url: https://github.com/matthewdtowles/homebrew-tap
    role: Distribution
    language: Ruby
featured: true
order: 2
---

Placeholder.
