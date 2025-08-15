# Notion UI Clone (SvelteKit + Bun)

Everything you need to build and run a Notion-like UI using SvelteKit, powered by Bun.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
bun x sv create

# create a new project in my-app
bun x sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `bun install`, start a development server:

```sh
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
