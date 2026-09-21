---
title: noenvy
tagline: Encrypts your .env into a vault keyed by the OS keyring, then injects secrets at the process boundary.
status: live
role: Sole engineer
stack: [Go, Homebrew]
links:
  - label: Download a release build
    url: https://github.com/matthewdtowles/noenvy/releases/latest
    type: docs
install:
  - platform: macOS, with Homebrew
    steps:
      - command: brew install matthewdtowles/tap/noenvy
    note: Homebrew clears the quarantine attribute for you, so there is no Gatekeeper prompt.
  - platform: Debian, Ubuntu, Mint, Pop!_OS, and Kali, with apt
    steps:
      - label: Add the signed repository, once
        command: |-
          sudo install -d -m 0755 /etc/apt/keyrings
          curl -fsSL https://matthewdtowles.github.io/noenvy/key.gpg \
            | sudo gpg --dearmor -o /etc/apt/keyrings/noenvy.gpg
          echo "deb [signed-by=/etc/apt/keyrings/noenvy.gpg] https://matthewdtowles.github.io/noenvy stable main" \
            | sudo tee /etc/apt/sources.list.d/noenvy.list
          sudo apt update
      - label: Install
        command: sudo apt install noenvy
      - label: Check the signing key before trusting it, if you want to
        command: gpg --show-keys /etc/apt/keyrings/noenvy.gpg
    note: "Expected fingerprint: EC78 1698 D374 74DB 88E2 1883 4443 9774 0341 265E. Later updates come through the usual sudo apt update and sudo apt upgrade noenvy."
  - platform: Fedora, RHEL, CentOS, and Rocky, with rpm
    steps:
      - command: sudo rpm -i noenvy_*_linux_amd64.rpm
    note: Download the package from the latest release first, and swap amd64 for arm64 on ARM. A signed dnf repository is on the roadmap.
  - platform: Alpine, with apk
    steps:
      - command: sudo apk add --allow-untrusted noenvy_*_linux_amd64.apk
    note: Download the package from the latest release first.
  - platform: Windows
    note: Download noenvy_*_windows_x86_64.zip from the latest release, extract it, and put noenvy.exe somewhere on your PATH.
  - platform: Any other platform, direct binary
    steps:
      - label: Clear the quarantine bit on macOS, once
        command: xattr -d com.apple.quarantine ./noenvy
    note: Take the tarball or zip from the latest release, extract it, and move the binary onto your PATH. The macOS binary is unsigned, so Gatekeeper stops the first run until the quarantine attribute is removed.
  - platform: From source
    steps:
      - label: With the Go toolchain
        command: go install github.com/matthewdtowles/noenvy@latest
      - label: Or from a clone
        command: |-
          git clone https://github.com/matthewdtowles/noenvy.git
          cd noenvy
          go build -o noenvy .
    note: Requires Go 1.22 or newer.
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

Local development secrets are handled badly almost everywhere. A `.env` file
sits in plaintext on disk, one `git add .` away from being published. The
alternatives each ask for something disproportionate: Doppler and Infisical are
team scale services that want an account and a network connection, 1Password
CLI wants a subscription, and `direnv` does not encrypt anything at all.

noenvy encrypts the `.env` into a vault, puts the key in the operating system
keyring, and injects the secrets into whatever command you run. Nothing sits in
plaintext on disk, there is no account, and there is no server.

```bash
noenvy init       # encrypts .env, stores the key in the keyring
noenvy npm start  # decrypts in memory, injects env vars, runs your command
```

## Running at the process boundary

The design decision the whole tool rests on: noenvy is not a library. It never
gets imported, so it works the same for Go, Python, Node, or anything else that
reads environment variables.

Language specific dotenv libraries load secrets into the process where every
transitive dependency can read them through `process.env` or `os.environ`.
noenvy hands the secrets to the child process it spawns and stays out of the
way.

```mermaid
graph LR
  subgraph setup[noenvy init]
    ENV[.env in plaintext]
    ENC[AES-256-GCM encrypt]
    VAULT[(Encrypted vault)]
    KEYRING[(OS keyring)]
    GITIGNORE[.env added to .gitignore]
    ENV --> ENC
    ENC --> VAULT
    ENC --> KEYRING
    ENV --> GITIGNORE
  end

  subgraph runtime[noenvy your-command]
    DECRYPT[Decrypt in memory]
    CHILD[Child process environment]
    CMD[Your command]
    DECRYPT --> CHILD
    CHILD --> CMD
  end

  VAULT --> DECRYPT
  KEYRING --> DECRYPT
```

## What is actually stored

Encryption is AES-256-GCM using Go's standard library, with a fresh nonce per
encryption from `crypto/rand`. GCM's authentication tag gives tamper detection
for free: change one byte of the vault and decryption fails rather than
returning garbage.

| Bytes | Contents |
| --- | --- |
| 0 | Format version |
| 1 to 12 | AES-GCM nonce |
| 13 onward | Ciphertext and the 16 byte authentication tag |

The key never touches disk. It lives in the platform credential store, keyed by
a project id derived from the SHA-256 of the project root's absolute path.
Project root detection walks upward looking for `.git`, `package.json`,
`Cargo.toml`, `go.mod`, or `pyproject.toml`, taking the innermost match so
monorepos resolve to the right project.

## Saying plainly what it does not do

A local secrets tool that oversells itself is worse than no tool, because
people calibrate their behavior to the claim. noenvy protects against plaintext
on disk, accidental commits, and casual access by processes not running as you.

It does not protect against a compromised user session, malicious code running
as your user, or memory inspection of the running child process. An attacker
with your login has your keyring. No local secrets tool solves that, and the
README says so before it says anything about features.

Platform support follows the same rule. The tool depends on an OS credential
store, so where there is no such store it is listed as unsupported rather than
left to fail quietly at runtime.

| Platform | Credential store | Supported |
| --- | --- | --- |
| macOS | Keychain | Yes |
| Windows | Credential Manager | Yes |
| Linux desktop | Secret Service, through gnome-keyring or KWallet | Yes, when the keyring daemon is running |
| Headless Linux | None by default | No |
| Docker containers | None by default | No |
| WSL2 | None by default | No, unless you run a Secret Service implementation yourself |
| Devcontainers and Codespaces | None by default | No |

A passphrase protected file backend is on the roadmap for the headless and
WSL2 cases.

## How it ships

One tagged release fans out to every packaging format, so installation
instructions never drift from what actually exists.

```mermaid
graph LR
  PR[Merge to main]
  TAG[autotag derives the version]
  GR[goreleaser]
  REL[GitHub release]
  BREW[Homebrew tap]
  PKG[deb, rpm, apk, and raw binaries]
  APT[Signed apt repository]

  PR --> TAG
  TAG --> GR
  GR --> REL
  GR --> BREW
  GR --> PKG
  REL --> APT
```

The apt repository is published to a GitHub Pages branch with GPG signed
metadata, so `apt` verifies every package end to end rather than trusting a
plain HTTP download.
