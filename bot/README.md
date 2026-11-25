# AristoBot Core (`/bot`)

This directory contains the core source code, commands, and execution logic for AristoBot, developed with Node.js, TypeScript, and discord.js.

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)

## Environment Variables

Create a `.env` file in this directory based on the `.env.example` template. You will need your Discord application credentials:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id_here
GUILD_ID=your_development_guild_id_here
```

## Instalation

Install the required project dependencies:

```
npm install
```

## Available scripts

The project includes several npm scripts configured in package.json for development and production workflows:

- `npm run dev`: Runs the bot in development mode using tsx watch with automatic hot-reloading and environment variable loading from .env.

- `npm run deploy`: Registers and deploys slash commands to Discord using src/deploy-commands.ts.

- `npm run build`: Compiles the TypeScript source code into standard JavaScript in the dist/ directory via tsc.

- `npm start`: Runs the compiled production build from the dist/ directory.

- `npm run lint`: Analyzes the codebase for stylistic or logical errors using ESLint.
  `npm run lint:fix`: Automatically fixes correctable ESLint errors across the project.
