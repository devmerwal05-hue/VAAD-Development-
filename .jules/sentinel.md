## 2025-05-14 - Hardcoded Admin Password Fallback
**Vulnerability:** The admin authentication endpoint had a hardcoded default password fallback ('2025') if the `ADMIN_PASSWORD` environment variable was not set.
**Learning:** Default fallbacks for sensitive credentials in code are easily discoverable and can lead to unauthorized access if environment variables are misconfigured or omitted in certain environments.
**Prevention:** Always require environment variables for credentials and fail explicitly (with logging) if they are missing. Never provide a default fallback in the source code.

## 2025-05-14 - Timing Attack on Password Verification
**Vulnerability:** Admin password verification used standard string comparison (`===`), which is susceptible to timing attacks.
**Learning:** Standard string comparison returns as soon as a mismatch is found, allowing an attacker to potentially brute-force a password by measuring response times.
**Prevention:** Use `crypto.timingSafeEqual` for comparing sensitive values. To ensure inputs are of equal length (a requirement for `timingSafeEqual`), hash both values with a fixed-length algorithm like SHA-256 first.
