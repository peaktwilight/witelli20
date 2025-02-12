#!/bin/bash

# Read .env.local and strip NEXT_PUBLIC_ prefix
export FIREBASE_API_KEY=$(grep NEXT_PUBLIC_FIREBASE_API_KEY .env.local | cut -d '=' -f2)
export FIREBASE_AUTH_DOMAIN=$(grep NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN .env.local | cut -d '=' -f2)
export FIREBASE_PROJECT_ID=$(grep NEXT_PUBLIC_FIREBASE_PROJECT_ID .env.local | cut -d '=' -f2)
export FIREBASE_STORAGE_BUCKET=$(grep NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET .env.local | cut -d '=' -f2)
export FIREBASE_MESSAGING_SENDER_ID=$(grep NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID .env.local | cut -d '=' -f2)
export FIREBASE_APP_ID=$(grep NEXT_PUBLIC_FIREBASE_APP_ID .env.local | cut -d '=' -f2)

# Run the migration script
npx ts-node -r tsconfig-paths/register --project scripts/tsconfig.json scripts/migrate-reservations.ts
