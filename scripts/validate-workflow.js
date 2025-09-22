#!/usr/bin/env node

/**
 * GitHub Actions Workflow Validation Script
 * 
 * This script validates the deploy.yml workflow file and checks for common issues.
 * Run with: node scripts/validate-workflow.js
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const WORKFLOW_PATH = '.github/workflows/deploy.yml';
const REQUIRED_SECRETS = [
  'VITE_GROQ_API_KEY',
  'VITE_API_BASE_URL',
  'VITE_GROQ_API_KEY_STAGING',
  'VITE_API_BASE_URL_STAGING',
  'VERCEL_TOKEN',
  'VERCEL_ORG_ID',
  'VERCEL_PROJECT_ID',
  'NETLIFY_AUTH_TOKEN',
  'NETLIFY_SITE_ID',
  'DOCKER_USERNAME',
  'DOCKER_PASSWORD'
];

function validateWorkflow() {
  console.log('🔍 Validating GitHub Actions workflow...\n');

  // Check if workflow file exists
  if (!fs.existsSync(WORKFLOW_PATH)) {
    console.error('❌ Workflow file not found:', WORKFLOW_PATH);
    process.exit(1);
  }

  try {
    // Parse YAML
    const workflowContent = fs.readFileSync(WORKFLOW_PATH, 'utf8');
    const workflow = yaml.load(workflowContent);

    console.log('✅ Workflow file syntax is valid');

    // Validate jobs
    const jobs = workflow.jobs;
    const expectedJobs = ['test', 'deploy-vercel', 'deploy-netlify', 'docker-build'];
    
    expectedJobs.forEach(jobName => {
      if (jobs[jobName]) {
        console.log(`✅ Job '${jobName}' found`);
      } else {
        console.log(`❌ Job '${jobName}' missing`);
      }
    });

    // Check for action references
    const workflowString = workflowContent;
    const actionIssues = [];

    // Check for common action reference issues
    if (workflowString.includes('Svercel/action')) {
      actionIssues.push('Found invalid Vercel action reference');
    }
    if (workflowString.includes('netlify/actions/cli@master')) {
      actionIssues.push('Found deprecated Netlify action reference');
    }

    if (actionIssues.length === 0) {
      console.log('✅ All action references appear valid');
    } else {
      actionIssues.forEach(issue => console.log(`❌ ${issue}`));
    }

    // Extract secrets used in workflow
    const secretsUsed = [];
    const secretRegex = /\$\{\{\s*secrets\.([A-Z_]+)\s*\}\}/g;
    let match;
    
    while ((match = secretRegex.exec(workflowString)) !== null) {
      if (!secretsUsed.includes(match[1])) {
        secretsUsed.push(match[1]);
      }
    }

    console.log('\n📋 Secrets used in workflow:');
    secretsUsed.forEach(secret => {
      const isRequired = REQUIRED_SECRETS.includes(secret);
      const status = isRequired ? '✅' : '⚠️';
      console.log(`  ${status} ${secret}`);
    });

    console.log('\n📋 Required secrets checklist:');
    REQUIRED_SECRETS.forEach(secret => {
      const isUsed = secretsUsed.includes(secret);
      const status = isUsed ? '✅' : '❌';
      console.log(`  ${status} ${secret}`);
    });

    // Check package.json scripts
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const scripts = packageJson.scripts || {};
      
      const requiredScripts = ['build', 'build:prod', 'type-check', 'lint'];
      console.log('\n📋 Required npm scripts:');
      
      requiredScripts.forEach(script => {
        const exists = scripts[script];
        const status = exists ? '✅' : '❌';
        console.log(`  ${status} ${script}`);
      });
    }

    console.log('\n🎉 Workflow validation complete!');
    console.log('\n📚 Next steps:');
    console.log('1. Configure all required secrets in GitHub repository settings');
    console.log('2. Review GITHUB_SECRETS.md for detailed setup instructions');
    console.log('3. Test the workflow by pushing to main or develop branch');

  } catch (error) {
    console.error('❌ Error parsing workflow file:', error.message);
    process.exit(1);
  }
}

// Run validation if this script is executed directly
validateWorkflow();