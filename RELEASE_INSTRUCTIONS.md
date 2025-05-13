# Release Instructions

This document provides instructions for creating new releases of the Witelli20 Student Portal.

## Automated Release Process

We've set up an automated release process that includes:

1. Version number in the footer
2. GitHub Actions workflow to create releases when a new tag is pushed
3. NPM scripts to simplify the versioning process

## Creating a New Release

### Method 1: Using NPM Scripts (Recommended)

The simplest way to create a new release is to use the NPM script:

```bash
# Make your changes and commit them first
git add .
git commit -m "Your commit message"

# Create a new patch release (increments the version's patch number)
npm run release
```

This will:
1. Update the version in package.json
2. Run the update-version.js script to update NEXT_PUBLIC_APP_VERSION in .env.local
3. Create a git tag for the new version
4. Push the changes and the tag to GitHub

### Method 2: Using GitHub CLI

Alternatively, you can create a release using the GitHub CLI:

```bash
# Create a new tag
git tag v0.1.1

# Push the tag
git push origin v0.1.1

# Create a release with a description
gh release create v0.1.1 --title "Release v0.1.1" --notes "Description of the changes in this release"
```

### Method 3: Using GitHub Web Interface

You can also create releases through the GitHub web interface:

1. Go to your repository on GitHub
2. Navigate to the "Releases" section
3. Click "Create a new release"
4. Enter the tag version, title, and description
5. Publish the release

## Version Types

When incrementing versions, follow these conventions:

- **Patch** (`0.1.x`): Bug fixes and minor changes
  ```bash
  npm version patch
  ```

- **Minor** (`0.x.0`): New features that don't break backward compatibility
  ```bash
  npm version minor
  ```

- **Major** (`x.0.0`): Breaking changes
  ```bash
  npm version major
  ```

## After Release

After creating a release:

1. The GitHub Actions workflow will automatically create a GitHub Release
2. The changelog will be generated from commit messages
3. The version number will be updated in the application footer

## Notes

- Make sure your commit messages are descriptive, as they'll be used in the automatic changelog
- The version in the footer links to the GitHub releases page