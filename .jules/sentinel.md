## 2025-05-14 - Hardcoded Admin Password and Timing Attack Vulnerability
**Vulnerability:** The admin password was hardcoded as "2025" and compared using a standard `===` operator, which is susceptible to timing attacks.
**Learning:** Hardcoded credentials and non-constant-time comparisons are common pitfalls in custom authentication logic. Using environment variables and SHA-256 hashing combined with `crypto.timingSafeEqual` provides a much higher level of security.
**Prevention:** Always use environment variables for secrets. When comparing sensitive strings (like passwords or tokens), hash them to a fixed length and use `timingSafeEqual`.
