// Deliberately excludes phone number and home city. This page is public.
export const summary =
  'Technical lead with over 10 years designing resilient distributed systems on AWS, including zero-loss, event-driven Kafka integrations that protect payment and billing integrity. I build developer tooling, security guardrails, and AI-assisted SDLC automation that teams across the enterprise adopt, eliminating configuration errors and speeding up delivery.';

export interface Role {
  company: string;
  title: string;
  start: string;
  end: string;
  summary?: string;
  highlights: { label: string; detail: string }[];
}

export const roles: Role[] = [
  {
    company: 'Travelers Insurance',
    title: 'Software Engineer II, Technical Lead',
    start: 'Oct 2021',
    end: 'Present',
    summary:
      'Directing technical design, architectural modernization, and testing infrastructure for high-impact, event-driven integrations with zero-loss streaming.',
    highlights: [
      {
        label: 'Enterprise eventing framework',
        detail:
          'Architected an internal Java SDK wrapping Spring Kafka for the Enterprise Eventing Framework, now the enterprise-wide standard across all organizations and active in production.',
      },
      {
        label: 'Engineering practice and CI/CD modernization',
        detail:
          'Led a team transforming engineering standards for an org of teams on a major financial modernization project. Taught modularization and TDD, and unblocked a two-year deployment stall by establishing automated CI/CD pipelines, reaching production within 12 months.',
      },
      {
        label: 'Automated test infrastructure',
        detail:
          'Engineered a flexible, JSON-driven integration testing engine spanning local environments, GitHub Actions PR checks, and post-deployment AWS validation, catching regression defects before release.',
      },
      {
        label: 'Zero-loss data pipeline architecture',
        detail:
          'Designed and implemented the core interoperability layer for Business Insurance modernization, translating transactions into Guidewire. Built deduplication, transactional outbox patterns, ordered suspense and blocking logic, and self-healing recovery engines to guarantee zero-loss delivery.',
      },
      {
        label: 'Delinquency and cancellation streaming',
        detail:
          'Extended the event-driven pipeline architecture to handle complex cancellation and rescindment workflows between Guidewire and legacy systems, with audit-ready transaction tracking.',
      },
      {
        label: 'AI-assisted SDLC automation',
        detail:
          'Led the AI initiative automating the full SDLC, from Jira epic and story generation with enforced quality gates to adversarial automated PR code reviews.',
      },
      {
        label: 'Build optimization and containerization fix',
        detail:
          'Identified and resolved a systemic Docker base image build bottleneck during an org-wide migration, cutting team build times by 50%, then consulted across Business Insurance to unblock the enterprise move to the new images.',
      },
    ],
  },
  {
    company: 'DSA Inc.',
    title: 'Software Developer, Enterprise Systems',
    start: 'Dec 2017',
    end: 'Oct 2021',
    highlights: [
      {
        label: 'Framework architecture overhaul',
        detail:
          'Rebuilt a proprietary legacy PHP backend framework, closing critical security vulnerabilities and accelerating feature delivery.',
      },
      {
        label: 'Search and discovery performance',
        detail:
          'Built an Elasticsearch backed API in Java Spring Boot for regulatory workflows, reducing database strain and delivering low latency search with automated compliance recommendations.',
      },
      {
        label: 'Compliance automation',
        detail:
          'Programmed automated compliance tracking integrations, eliminating manual reporting data entry errors.',
      },
    ],
  },
  {
    company: 'Telesis',
    title: 'Software Developer',
    start: 'Mar 2016',
    end: 'Dec 2017',
    highlights: [
      {
        label: 'Legacy modernization',
        detail:
          'Refactored customer facing websites, improving digital accessibility and page performance for mobile users.',
      },
      {
        label: 'Knowledge engineering',
        detail:
          'Built an internal knowledge base platform in PHP and JavaScript, shortening developer onboarding and preventing cross project knowledge fragmentation.',
      },
    ],
  },
];

export const education = [
  { school: 'Georgia Institute of Technology', credential: 'M.S. Computer Science', year: '2023' },
  { school: 'Towson University', credential: 'B.S. Economics', year: '' },
];

export const certifications = [
  {
    name: 'AWS Certified Solutions Architect, Associate',
    issuer: 'Amazon Web Services',
    year: '2026',
    url: 'https://www.credly.com/badges/4dbcbb83-3dc9-486b-9b71-76baff6e9643/public_url',
  },
];

// Internal tools built at Travelers outside assigned work. No public links exist,
// so they are listed rather than linked.
export const internalTools = [
  {
    name: 'decant',
    detail:
      'CLI that localizes, encrypts, and injects runtime secrets, eliminating the risk of exposing them in a project. Ships with a skill for use with Claude.',
  },
  {
    name: 'tfctl',
    detail:
      'CLI automating Terraform Enterprise workspace synchronization, reducing errors and cutting hours from pipeline setup.',
  },
  {
    name: 'BI program dashboard MCP server',
    detail:
      'MCP server on AWS EKS that queries an internal API through machine-to-machine auth with Okta, enabling automated custom report emails to engineers.',
  },
];
