# Contributing to ArmorEditor

Thank you for your interest in contributing to ArmorEditor! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git

### Development Setup
```bash
# Clone the repository
git clone https://github.com/technicults/armor-editor.git
cd armor-editor

# Install dependencies
npm install

# Start development
npm run dev

# Build the project
npm run build
```

## Development Workflow

### 1. Fork and Clone
- Fork the repository on GitHub
- Clone your fork locally
- Add upstream remote: `git remote add upstream https://github.com/technicults/armor-editor.git`

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Make Changes
- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 4. Test Your Changes
```bash
# Run tests
npm test

# Build and test
npm run build
npm run test:integration
```

### 5. Commit and Push
```bash
git add .
git commit -m "feat: add new feature description"
git push origin feature/your-feature-name
```

### 6. Create Pull Request
- Open a PR against the main branch
- Provide clear description of changes
- Link related issues
- Ensure CI passes

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible

### Code Formatting
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Max line length: 100 characters

### Naming Conventions
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_CASE for constants
- Use descriptive names

## Testing

### Unit Tests
- Write unit tests for all new functions
- Use Jest testing framework
- Aim for 80%+ code coverage

### Integration Tests
- Test framework integrations
- Test AI provider integrations
- Test real-world scenarios

### E2E Tests
- Test complete user workflows
- Test cross-browser compatibility
- Test mobile responsiveness

## Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Document complex algorithms
- Include usage examples

### README Updates
- Update feature lists
- Add new configuration options
- Update examples

### API Documentation
- Document all public methods
- Include parameter types
- Provide usage examples

## Issue Guidelines

### Bug Reports
- Use the bug report template
- Provide minimal reproduction case
- Include browser/environment details
- Add screenshots if applicable

### Feature Requests
- Use the feature request template
- Explain the use case
- Provide implementation suggestions
- Consider backward compatibility

## Pull Request Guidelines

### PR Title Format
- `feat: add new feature`
- `fix: resolve issue description`
- `docs: update documentation`
- `test: add test coverage`
- `refactor: improve code structure`

### PR Description
- Clear description of changes
- Link to related issues
- Breaking changes noted
- Testing instructions

### Review Process
- All PRs require review
- Address reviewer feedback
- Maintain clean commit history
- Squash commits if needed

## Release Process

### Version Numbering
- Follow Semantic Versioning (SemVer)
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Automated Release
Our release process is fully automated via GitHub Actions:

1. **Push to main branch** - triggers automatic build and tests
2. **GitHub Actions handles**:
   - Version bumping
   - Changelog updates
   - Build generation
   - npm publishing
   - GitHub release creation

No manual release steps needed!

## Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the code, not the person

### Communication
- Use GitHub issues for bugs/features
- Use discussions for questions
- Be clear and concise
- Provide context and examples

## Getting Help

### Resources
- [Documentation](https://github.com/technicults/armor-editor)
- [API Reference](https://github.com/technicults/armor-editor#api-reference)
- [Examples](https://github.com/technicults/armor-editor#framework-integration)

### Contact
- GitHub Issues: Bug reports and features
- GitHub Discussions: Questions and ideas
- Email: technicults@gmail.com

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to ArmorEditor!
