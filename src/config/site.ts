export const site = {
  name: 'Matthew Towles',
  role: 'Software engineer',
  lede:
    'I build systems that move data reliably: event driven integrations, ingestion pipelines, and the developer tooling that keeps them honest.',
  email: 'matthewdtowles@gmail.com',
};

// Set photo to a path under public/ once there is one worth using. While it is
// null the section renders as text only rather than as a broken frame.
export const about = {
  photo: null as string | null,
  photoAlt: 'Matthew Towles',
  paragraphs: [
    'I have spent about ten years building systems that move money and data without losing either. Most of that has been event driven work: Kafka consumers, reconciliation and ledger algorithms, and the testing infrastructure that makes them trustworthy. These days I lead technical design for integrations at Travelers.',
    'Outside of work I build the tools I want to exist. I Want My MTG started because I wanted to know what a collection was worth without opening twenty tabs. noenvy started because I was tired of plaintext secrets sitting on disk. I like problems where correctness matters and the failure mode is quiet.',
  ],
};

export interface Social {
  label: string;
  url: string;
  handle: string;
}

// Only verified destinations belong here. An unreachable link on a portfolio
// costs more than an absent one.
export const socials: Social[] = [
  { label: 'GitHub', url: 'https://github.com/matthewdtowles', handle: 'matthewdtowles' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/matthewdtowles/',
    handle: 'matthewdtowles',
  },
];
