# Security

## Secrets & Configuration
- Never commit secrets (API keys, passwords, tokens, `.env` files)
- Use environment variables for sensitive configuration (typed via Astro `env` schema when applicable)
- Add sensitive files to `.gitignore`

## Input Validation
- Validate all user inputs before processing (forms, query params)
- Sanitize any user-provided content before display

## LocalStorage
- Use only for non-sensitive UX preferences (theme toggle)
- Never store personal data, tokens, or anything that could identify the user
- Handle missing or corrupted values gracefully (reset to defaults)

## Dependencies
- Keep dependencies up to date
- Audit regularly (`npm audit`)
- Prefer well-maintained packages with a strong security track record
- Minimize dependency count (aligns with eco-design)

## Content Security
- Avoid raw `set:html` (Astro) or equivalent unless content is fully trusted
- Sanitize any user-provided content before display
- Configure CSP headers on the serving layer when feasible (object metadata, or the load balancer)

## External Resources
- No third-party tracking, analytics, or fingerprinting
- Self-host fonts and other critical assets
- Vet any third-party badge or embed before integration
