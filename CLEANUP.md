# AI Story Generation Feature Cleanup

The AI story generation feature has been removed from the project. The following files can be safely removed:

## Files to Delete
- `/src/app/generator/page.tsx` - Main page for AI story generation
- `/src/components/StoryModal.tsx` - Modal for viewing and commenting on stories
- `/src/components/StoryActions.tsx` - Component for voting and commenting on stories
- `/src/types/story.ts` - TypeScript interfaces for Story and Comment
- `/src/app/api/generate/route.ts` - API endpoint that uses Google Gemini AI to generate content
- `/src/lib/funGenerator.ts` - Utility function to call the generate API endpoint

## Changes Already Made
1. Removed the Google Gemini AI dependency from package.json
2. Removed the AI story feature from the homepage
3. Removed the stories-related permissions from firestore.rules
4. Updated CLAUDE.md to reflect the current feature set

## Database Cleanup (Optional)
If desired, the following Firestore collection can be deleted as it's no longer used:
- `stories` collection and its subcollections

These changes have been made to streamline the application and focus on the core features:
- Room Reservations
- Transport Information
- Lost & Found
- Message Board
- Weather