# Portl Mobile App (Expo / React Native)

This is the mobile application for Portl, built using React Native and [Expo Router](https://docs.expo.dev/router/introduction/).

## Development

You can run the app directly from the root workspace or inside this directory.

### Running from Workspace Root (Recommended)
```bash
# Start Expo development server
pnpm run dev --filter=mobile

# Run lint checks
pnpm run lint --filter=mobile

# Type-check code
pnpm run check-types --filter=mobile
```

### Running Locally inside `/apps/mobile`
```bash
# Start development server
pnpm run dev

# Open on specific targets
pnpm run android
pnpm run ios
pnpm run web

# Lint code
pnpm run lint

# Typecheck code
pnpm run check-types

# Export static files for web/bundle check
pnpm run build
```
