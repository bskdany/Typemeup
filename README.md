# Typemeup, a cybernetically enhanced typing website
Made it to the [Svelte Community Showcase](https://svelte.dev/blog/whats-new-in-svelte-february-2024) !

### Features

- smart mode, using complex typing analysis alghorithms to suggest words that will improve accuracy
- live mistake correction mode, your errors are fixed as you type
- timed and fixed word amount typing test
- live keyboard
- smooth cursor
- graphs with in-depth statistics and analysis of the test
- user configs
- theme settings
- competition mode
  
### Incoming features
- theme marketplace
- import progress from monkeytype

Got any other ideas for features or just want to say hi? Join the [Discord](https://discord.gg/YdcJdE4HBv)!

## Developing

This area is work in progress, as for now `npm run dev` from the root dir should work (with all dependencies installed via npm

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

## Deploying
```
curl -L https://raw.githubusercontent.com/bskdany/typemeup/main/scripts/install.sh | bash
```
