# Contributing Guide

Thank you for considering contributing to the Witelli20 Student Portal! Your contributions help make this platform better for student communities.

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. We expect all participants to adhere to the following guidelines:

- Be respectful and inclusive of all contributors
- Use welcoming and inclusive language
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards community members

## Development Workflow

### Getting Started

1. **Fork the Repository** on GitHub
2. **Clone your Fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/witelli20.git
   cd witelli20
   ```
3. **Set up the Environment**
   ```bash
   npm install
   cp .env.example .env.local    # Then edit .env.local with your credentials
   ```
4. **Create a Branch** for your feature or fix
   ```bash
   git checkout -b feature/descriptive-name
   ```

### Making Changes

1. **Follow Coding Standards**
   - Use consistent indentation (2 spaces)
   - Follow TypeScript best practices
   - Keep components focused and modular
   - Use meaningful variable and function names
   - Comment complex logic

2. **Test Thoroughly**
   ```bash
   npm run dev          # Start development server
   npm run lint         # Run linting
   npm run build        # Test production build
   ```

3. **Commit Your Changes** using descriptive commit messages
   ```bash
   git commit -m "feat: add room calendar view component"
   ```

   We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   - `feat:` - A new feature
   - `fix:` - A bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc)
   - `refactor:` - Code changes that neither fix bugs nor add features
   - `perf:` - Performance improvements
   - `test:` - Adding or updating tests
   - `chore:` - Changes to the build process or tools

4. **Push to Your Fork**
   ```bash
   git push origin feature/descriptive-name
   ```

5. **Submit a Pull Request** against the `main` branch of the original repository

### Pull Request Guidelines

- Fill in the PR template completely
- Reference any relevant issues
- Include screenshots for UI changes
- Update documentation if needed
- Keep PRs focused on a single change
- Make sure CI passes before requesting review

## Firebase Setup

If your contribution requires Firebase access:

1. Create a personal Firebase project for development
2. Use the Firestore rules from this project
3. Configure your `.env.local` with your project credentials

## Need Help?

If you need help with your contribution:

1. Check out the [README.md](README.md) for setup instructions
2. Look for existing issues or create a new one
3. Ask for clarification in your PR if needed

Thank you for contributing to Witelli20!