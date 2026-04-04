# Sentinel Security Journal - VAAD Development

This journal records critical security learnings and patterns for the VAAD Development project.

## 2025-05-14 - Admin Password Verification Timing Attack
**Vulnerability:** Admin password verification was using direct string comparison `password === expected`, which is susceptible to timing attacks.
**Learning:** Even if the password is only compared on the server, different comparison times can leak information about the password.
**Prevention:** Use `crypto.timingSafeEqual` with hashed values for password verification.

## 2025-05-14 - Standardized Security Middleware
**Learning:** The project uses `applySecurity` in `api/_security.js` to centralize security headers, CORS, rate limiting, and request validation. This should be used in all API endpoints.
**Prevention:** Always call `applySecurity` at the beginning of an API handler.
