---
name: os-foundation
description: >
  Use when setting up, auditing, or managing an open source project — creating
  foundational files (README, CONTRIBUTING, LICENSE, CODE_OF_CONDUCT),
  structuring the repository for external contributors, drafting governance
  documents, or preparing a private project for public release. Triggers on
  "open source this", "set up the repo for OSS", "prepare for public launch",
  or "what do we need to open source X".
tags: [open-source, engineering, documentation]
name_ko: 오픈소스 파운데이션
description_ko: >
  오픈소스 프로젝트 설정, 감사, 관리 시 활용 — 기초 파일 생성(README,
  CONTRIBUTING, LICENSE, CODE_OF_CONDUCT), 외부 기여자를 위한 저장소 구성,
  거버넌스 문서 작성, 비공개 프로젝트의 공개 출시 준비.
updated: 2026-03-12
---

# OS Foundation

Lay the right groundwork for an open source project. Set up the files, conventions, and governance that make external contribution possible and protect the company's interests.

## Workflow

1. Assess the current state: is this a new repo or an existing project going public?
2. Audit for issues that must be resolved before public release (secrets, sensitive history, IP concerns)
3. Draft or update the core foundational files
4. Set up contribution workflow (issues, PRs, branch protection, CI gates)
5. Review the release checklist and confirm readiness

## Pre-Release Audit (Existing Repos)

Before making a repo public, verify:
- [ ] No secrets, API keys, or credentials in git history (use `git log --all` and `truffleHog` or `gitleaks`)
- [ ] No internal-only URLs, hostnames, or IP addresses in code or docs
- [ ] No personal data or PII in test fixtures or examples
- [ ] License is cleared with legal for all dependencies (check for GPL contamination if using MIT/Apache)
- [ ] Internal roadmap or unreleased product details not exposed in issues or comments

## Foundational Files

### README.md (required)
Must include:
- **What it is**: One-sentence description and a slightly longer why
- **Quick start**: Working code example in under 5 steps
- **Documentation link**: Where to find full docs
- **License badge and text**
- **Contribution link**

### LICENSE (required)
Pick one — common choices:
- **MIT**: Maximum permissiveness — anyone can use, modify, distribute with attribution
- **Apache 2.0**: Like MIT but with patent protection — good for API-facing projects
- **GPL v3**: Copyleft — derivative works must also be GPL (use if requiring reciprocity)
- **BSL 1.1**: Business source — open eventually but restricts production use for N years

### CONTRIBUTING.md (required)
Include:
- How to report a bug (issue template or instructions)
- How to propose a feature
- How to submit a PR: fork, branch naming, PR description format
- Code style / linting requirements
- Review and merge process — who reviews, how long to expect

### CODE_OF_CONDUCT.md (recommended)
Use the Contributor Covenant (https://www.contributor-covenant.org/) as a baseline.
Add a specific enforcement contact email.

### SECURITY.md (recommended)
How to report security vulnerabilities — private disclosure path, response timeline, CVE handling.

## Issue and PR Templates

Create `.github/ISSUE_TEMPLATE/` with:
- `bug_report.md`: Steps to reproduce, expected vs. actual, environment
- `feature_request.md`: Problem statement, proposed solution, alternatives

Create `.github/pull_request_template.md`:
```markdown
## Summary
[What does this PR do?]

## Motivation
[Why is this change needed?]

## Testing
[How was this tested?]

## Checklist
- [ ] Tests added or updated
- [ ] Documentation updated
- [ ] CHANGELOG entry added
```

## Repository Settings

Recommended configuration:
- **Default branch**: `main`
- **Branch protection on `main`**: Require PR + status checks, no force push, no direct commits
- **Issue labels**: `bug`, `enhancement`, `good first issue`, `help wanted`, `documentation`
- **GitHub Actions**: At minimum — lint, test, and build on every PR

## CHANGELOG Convention

Use [Keep a Changelog](https://keepachangelog.com/) format:
```markdown
## [Unreleased]
## [1.0.0] - YYYY-MM-DD
### Added
### Changed
### Fixed
### Removed
```

## Quality Checks

Before publishing:
- All foundational files are present (README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT)
- Pre-release audit is complete with no blockers
- README quick start works on a clean environment (tested)
- License is confirmed with legal
- A maintainer owns the project post-launch — it is not abandoned on release day
