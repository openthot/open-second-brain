# Security Policy & Best Practices

OpenSecondBrain is designed with privacy and security as first-class principles. This document outlines our security architecture, credential safety protocols, and guidelines for maintaining a secure Notion workspace.

---

## 1. Secrets & Credential Management

### Internal Integration Tokens
- Your Notion API integration token (`secret_...` or `ntn_...`) grants programmatic read and write access to pages explicitly shared with your integration.
- **Never commit `.env` to version control.** Our `.gitignore` strictly ignores all `.env` files except `.env.example`.
- **Principle of Least Privilege**: When creating an integration in [Notion Developers](https://www.notion.so/my-integrations):
  - Grant only the permissions necessary (Read content, Update content, Insert content).
  - Do not grant user information permissions unless needed.
  - Only invite the integration to the dedicated parent page where OpenSecondBrain will reside, not your entire workspace.

### Safe Local Environment
- Keep your `.env` file permissions restricted on Unix environments (`chmod 600 .env`).
- Never paste integration tokens into public chats, issues, or pull requests.
- If you suspect an API token was exposed, immediately revoke and re-roll the secret at [notion.so/my-integrations](https://www.notion.so/my-integrations).

---

## 2. API Provisioner Security Architecture

The automated TypeScript provisioner (`provisioner/`):
1. **Zero External Data Exfiltration**: Runs 100% locally on your machine and communicates solely with the official Notion REST API endpoint (`https://api.notion.com`).
2. **Automated Error Scrubbing**: Sanitizes all terminal logs and error output to prevent accidental exposure of authorization headers and secrets.
3. **Strict Input Sanitization**: Validates UUID page IDs and token prefixes prior to issuing network requests.

---

## 3. Notion Template Sharing & Privacy

When distributing or sharing your OpenSecondBrain template publicly or on the Notion Marketplace:
1. **Audit Personal Data**: Ensure sample tasks, notes, personal projects, and confidential credentials or meeting notes are cleared before publishing.
2. **Locking Databases**: In Notion, lock critical databases (`...` $\to$ `Lock database`) to prevent accidental deletion of relational properties and formulas by collaborators.
3. **Template Duplicate Permissions**: Ensure "Allow duplicate as template" is enabled under Share $\to$ Publish, while restricting public commenting and editing permissions unless required.

---

## 4. Reporting a Security Vulnerability

If you discover a security vulnerability or sensitive information disclosure in this repository:
- Please **do not open a public issue**.
- Email the maintainers directly or use GitHub Private Vulnerability Reporting.
- We will acknowledge receipt within 24 hours and coordinate a patch promptly.
