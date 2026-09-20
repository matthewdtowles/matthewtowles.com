// Deliberately excludes phone number and home city. This page is public.
export const summary =
  'Over 10 years designing resilient distributed architectures, event driven integrations, and automated testing ecosystems. History of building enterprise adopted developer tooling, security guardrails, and AI assisted SDLC work that eliminates configuration errors and protects transaction integrity.';

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
      'Directing technical design, architectural modernization, and testing infrastructure for high impact event driven integrations with zero loss streaming.',
    highlights: [
      {
        label: 'Zero loss streaming',
        detail:
          'Ensured at least once sequenced delivery, preventing duplicate billing and payments across downstream systems with transactional outbox patterns and Kafka consumer algorithms.',
      },
      {
        label: 'Ledger algorithms',
        detail:
          'Engineered reconciliation and suspense accounting algorithms for Kafka consumers to safeguard payment workflows against silent processing errors.',
      },
      {
        label: 'Core BI modernization',
        detail:
          'Led design of a data translation engine for legacy systems, ensuring continuity for business insurance operations.',
      },
      {
        label: 'Enterprise test architecture',
        detail:
          'Reduced regression defects and enabled environment promotions with automated integration testing via GitHub Actions.',
      },
      {
        label: 'AI platform engineering',
        detail:
          'Built an internal Claude plugin automating Jira story creation and code reviews, with safety guardrails across the SDLC.',
      },
      {
        label: 'Containerization fix',
        detail:
          'Resolved critical Docker containerization flaws for Node during migration, then worked with leadership to roll the fix out across the organization.',
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

// Internal tools built at Travelers outside assigned work. No public links exist,
// so they are listed rather than linked.
export const internalTools = [
  {
    name: 'decant',
    detail:
      'CLI that localizes, encrypts, and injects runtime secrets, eliminating the risk of exposing them in a project.',
  },
  {
    name: 'tfctl',
    detail:
      'CLI automating Terraform Enterprise workspace synchronization, cutting hours from pipeline setup.',
  },
  {
    name: 'BI program dashboard MCP server',
    detail:
      'MCP server on AWS EKS exposing a Jira dashboard backend API through machine to machine auth with Okta, enabling automated report emails to engineers.',
  },
];
