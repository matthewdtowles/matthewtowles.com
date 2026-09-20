export const site = {
  name: 'Matthew Towles',
  role: 'Software engineer',
  lede:
    'I build systems that move data reliably: event driven integrations, ingestion pipelines, and the developer tooling that keeps them honest.',
  email: 'matthewdtowles@gmail.com',
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
