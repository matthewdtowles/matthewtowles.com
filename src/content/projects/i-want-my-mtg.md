---
title: I Want My MTG
tagline: "A collection tracker for Magic: The Gathering, spanning data ingestion, a web app, mobile clients, and an MCP server."
status: live
role: Sole engineer
stack: [NestJS, TypeScript, Rust, React Native, Expo, PostgreSQL, Docker, AWS Lightsail]
links:
  - label: Open the web app
    url: https://iwantmymtg.net
    type: website
  - label: Get it on Google Play
    url: https://play.google.com/store/apps/details?id=com.matthewdtowles.iwantmymtg
    type: play-store
  - label: Download on the App Store
    url: https://apps.apple.com/us/app/i-want-my-mtg/id6784075307
    type: app-store
  - label: Install the MCP server
    url: https://www.npmjs.com/package/iwantmymtg-mcp
    type: npm
install:
  - platform: MCP server
    command: npx iwantmymtg-mcp
    note: Connects Claude Desktop, Claude Code, and other MCP clients to your collection.
  - platform: Scry ETL container
    command: docker pull ghcr.io/matthewdtowles/scry:latest
    note: The ingestion pipeline, published on every release.
repos:
  - name: i-want-my-mtg
    url: https://github.com/matthewdtowles/i-want-my-mtg
    role: Web app and API
    language: TypeScript
  - name: scry
    url: https://github.com/matthewdtowles/scry
    role: ETL pipeline for card, price, and tournament data
    language: Rust
  - name: iwantmymtg-mcp
    url: https://github.com/matthewdtowles/iwantmymtg-mcp
    role: MCP server for AI clients
    language: TypeScript
  - name: i-want-my-mtg-mobile
    url: https://github.com/matthewdtowles/i-want-my-mtg-mobile
    role: iOS and Android client
    language: TypeScript
featured: true
order: 1
---

Magic cards are priced by a market that moves daily across tens of thousands of
printings. Tracking what a collection is worth means continuously pulling that
data, reconciling it against a catalog that changes with every set release, and
making it queryable fast enough to browse.

I Want My MTG is four repositories solving one problem. Scry pulls and
normalizes the data, PostgreSQL holds it, and three separate clients read from
it: a web app, mobile apps, and an MCP server that lets AI assistants query a
collection directly.

## How the data flows

Everything downstream depends on one ingestion path. Scry is the only writer of
card, price, and tournament data; every client is a reader.

```mermaid
graph LR
  MTGJSON[MTGJSON bulk files]
  CK[Card Kingdom pricelist]
  FB[Tournament deck feed]

  SCRY[Scry ETL]
  DB[(PostgreSQL)]
  API[NestJS API]

  WEB[Web app]
  MOBILE[Mobile apps]
  MCP[MCP server]
  RAPID[RapidAPI marketplace]
  SF[Scryfall images]

  MTGJSON --> SCRY
  CK --> SCRY
  FB --> SCRY
  SCRY --> DB
  DB --> API
  API --> WEB
  API --> MOBILE
  API --> MCP
  API --> RAPID
  SF -.card art.-> WEB
```

Scry runs on a schedule rather than on demand. Prices refresh hourly, but only
after a check confirms the upstream file actually changed, so an unchanged feed
costs nothing. Tournament decks land nightly, and a weekly retention pass keeps
price history from growing without bound.

| Job | Schedule | What it does |
| --- | --- | --- |
| Ingest chain | Hourly | Refreshes prices when upstream data changed |
| Deck ingest | Nightly | Pulls the last two days of tournament decks |
| Retention | Weekly | Prunes price history |
| Health check | Daily | Verifies the pipeline is current |

## How it is deployed

The whole system runs on a single AWS Lightsail instance. The web app runs in
Docker, Scry runs as a native binary invoked by cron, and both talk to the same
PostgreSQL database.

```mermaid
graph LR
  subgraph clients[Clients]
    BROWSER[Browser]
    PHONE[iOS and Android]
    AI[AI assistants via MCP]
  end

  subgraph lightsail[AWS Lightsail instance]
    WEB[NestJS web app in Docker]
    CRON[cron]
    SCRYBIN[Scry binary]
    PG[(PostgreSQL 18)]
    CRON --> SCRYBIN
    SCRYBIN --> PG
    WEB --> PG
  end

  subgraph services[External services]
    SES[Amazon SES]
    STRIPE[Stripe billing]
    SCRYFALL[Scryfall images]
  end

  BROWSER --> WEB
  PHONE --> WEB
  AI --> WEB
  WEB --> SES
  WEB --> STRIPE
  BROWSER --> SCRYFALL
```

The deployment order matters and is enforced rather than remembered. Scry writes
tables that the web repository's migrations create, so the web deploy runs
migrations first and only then installs the Scry binary, extracting it from the
published container image.

## How it ships

Each repository has its own pipeline, and two of them are coupled by that
deployment order.

```mermaid
graph TB
  subgraph webpipe[i-want-my-mtg]
    W1[Typecheck, lint, format]
    W2[Unit, integration, and end to end tests]
    W3[Version and tag]
    W4[Build image]
    W5[Deploy over SSH]
    W1 --> W2 --> W3 --> W4 --> W5
  end

  subgraph scrypipe[scry]
    S1[Format and clippy]
    S2[Tests]
    S3[Version and release]
    S4[Push image to ghcr.io]
    S1 --> S2 --> S3 --> S4
  end

  subgraph mcppipe[iwantmymtg-mcp]
    M1[Lint]
    M2[Tests on a Node matrix]
    M3[Version]
    M4[Publish to npm]
    M1 --> M2 --> M3 --> M4
  end

  subgraph mobpipe[i-want-my-mtg-mobile]
    B1[Typecheck]
    B2[Unit and component tests]
    B3[Version and tag]
    B1 --> B2 --> B3
  end

  S4 -.binary extracted during deploy.-> W5
```

Version numbers are derived from pull request titles rather than hand edited,
so a merge decides its own release number and the tag, image, and deployed
version cannot drift apart.
