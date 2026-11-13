# Contributing to OpenSecondBrain

Thank you for your interest in contributing to OpenSecondBrain! We want to make personal knowledge management accessible, open, and free for everyone.

## Ways to Contribute

1. **Notion Formulas 2.0**: Have an optimization or clean formula snippet for progress tracking, habit streaks, or recurrence? Submit a PR in `formulas/`.
2. **Database Schemas**: Improvements to property definitions, relations, or rollup logic can be proposed in `schemas/`.
3. **Automated Provisioner**: Help enhance `provisioner/` by adding support for custom Notion block templates, automated page icons, and interactive CLI prompts.
4. **Translations & Templates**: Share regionalizations or curated starter databases for specific disciplines (e.g., Software Engineers, Researchers, Founders).

## Development Setup

```bash
cd provisioner
npm install
npm run build
```

## Pull Request Guidelines

- Ensure JSON schemas are valid (`npx jsonlint` or IDE validator).
- Verify Formulas 2.0 syntax using the Notion Formula Editor.
- Keep documentation clear, concise, and accessible to non-technical Notion users.
