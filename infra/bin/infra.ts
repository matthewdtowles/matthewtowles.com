#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SiteStack } from '../lib/site-stack.js';

const app = new cdk.App();

new SiteStack(app, 'MatthewTowlesSite', {
  // CloudFront only reads ACM certificates from us-east-1.
  env: { account: '329599663384', region: 'us-east-1' },
  domainName: 'matthewtowles.com',
  hostedZoneId: 'Z01413571IK2KWZGDAL7I',
  githubRepo: 'matthewdtowles/matthewtowles.com',
});
