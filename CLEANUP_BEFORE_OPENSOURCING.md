# Files to Clean Up Before Open-Sourcing

## Files to Delete

These files are related to the removed AI generator feature and should be deleted:

- `/src/app/generator/page.tsx`
- `/src/components/StoryModal.tsx`
- `/src/components/StoryActions.tsx`
- `/src/types/story.ts`
- `/src/app/api/generate/route.ts`
- `/src/lib/funGenerator.ts`
- `/src/CLEANUP.md` (once cleanup is complete)

## Environment File Cleanup

1. Your `.env.local` file is properly ignored by git (confirmed)
2. Keep `.env.example` as a template for others
3. Verify no secrets are hardcoded in the codebase

## Documentation Files to Keep

These newly created files provide guidance for open-sourcing:

- `CONTRIBUTING.md` - Guidelines for contributors
- `LICENSE` - MIT license for the project
- Updated `README.md` - Project documentation
- `.env.example` - Example environment config

## Final Steps

1. Take a screenshot of your application for the README
2. Follow the `OPEN_SOURCE_CHECKLIST.md` to ensure all steps are complete
3. Delete the `OPEN_SOURCE_CHECKLIST.md` and this file before pushing

## Security Note

Make sure no secrets or API keys are hardcoded in the codebase before making it public. The `.env.local` file is properly ignored by git as confirmed.