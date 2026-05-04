# AI Audit Checklist Tool

> 🚧 Work in Progress

Open source security audit tool for Supabase applications.

## What it does

- Analyzes a Supabase project configuration
- Checks RLS (Row Level Security) policies
- Detects exposed secrets and environment variables
- Generates a report with a score /100 and prioritized recommendations (CRITICAL / SERIOUS / MISSING)

## Stack

- Node.js / TypeScript
- Supabase API

## Usage

```bash
npx ai-audit-tool --url <SUPABASE_URL> --key <SUPABASE_KEY>
```

## Status

Under active development — first CLI version coming soon.

## Author

Fatou Cissé — QA Engineer & AI Reliability  
contact@aibyfatou.com