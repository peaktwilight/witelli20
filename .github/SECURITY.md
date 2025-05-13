# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within Witelli20, please send an email to [your-email@example.com]. All security vulnerabilities will be promptly addressed.

Please do not disclose security vulnerabilities publicly until they have been addressed by the maintainers.

## Security Practices

This project follows these security practices:

1. **Environment Variables**: All sensitive information is stored in environment variables, not in the codebase
2. **Input Validation**: User inputs are validated before processing
3. **Firebase Security Rules**: Carefully defined Firestore rules to restrict access to data
4. **Regular Updates**: Dependencies are regularly updated to include security patches
5. **Code Reviews**: All code changes go through a review process