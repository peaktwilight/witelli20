# Creating Your First GitHub Release

This document demonstrates how to create your first GitHub release using the GitHub CLI (`gh`) once your repository is pushed to GitHub.

## Prepare Your Repository

First, make sure your code is pushed to GitHub:

```bash
# If not already done
git push origin main
```

## Method 1: Using NPM Scripts (Recommended)

The easiest way to create a release is to use the NPM script we've set up:

```bash
# This will increment the patch version, update the env file, create a tag, and push
npm run release
```

## Method 2: Manual Release Using GitHub CLI

If you prefer a more manual approach or need to create a specific release:

### Step 1: Create a tag locally

```bash
# Create a new version tag
git tag v0.1.0

# Push the tag to GitHub
git push origin v0.1.0
```

### Step 2: Create a GitHub release using the tag

```bash
# Basic release
gh release create v0.1.0 --title "Initial Release" --notes "First public release of Witelli20 Student Portal"

# OR with more detailed options
gh release create v0.1.0 \
  --title "Initial Release v0.1.0" \
  --notes "
## First public release of Witelli20 Student Portal

### Features:
- Room reservations system
- Transport information integration
- Lost & Found tracking
- Message board
- Weather widget

### Technical:
- Next.js 15+ 
- Firebase backend
- Responsive design
"
```

### Step 3: Verify the release

```bash
# List all releases
gh release list

# View the latest release
gh release view
```

## GitHub Actions

The repository is already configured with a GitHub Action that will automatically:

1. Create a GitHub Release when you push a tag
2. Include a changelog based on commit messages since the last tag
3. Make the release publicly visible

## Maintaining Versions

After each significant change:

1. Make your changes and commit them
2. Run `npm run release` to create a new patch version
3. For more significant changes, use:
   - `npm version minor -m "Release %s with new features"`
   - `npm version major -m "Release %s with breaking changes"`

This will ensure your version numbers follow semantic versioning and the footer always displays the correct version.