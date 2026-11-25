import {
  REST,
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { BaseCommand } from './types'; // Asegúrate de ajustar la ruta a tus tipos

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

// Fail fast if required Discord credentials are missing from the enviroment
if (!clientId || !guildId || !token) {
  console.error(
    '¡Error! Faltan CLIENT_ID, GUILD_ID o DISCORD_TOKEN en tus variables de entorno.',
  );
  process.exit(1);
}

// Holds serialized slash command payloads matching Discord's REST API schema
const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

/**
 * Discovers all slash command modules under `src/commands`, validates their structure,
 * and registers them with the target Discord guild via the REST API.
 */
(async () => {
  try {
    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        // Convert filesystem paths to file URLs for cross-platform dynamic ESM/TS imports
        const fileUrl = pathToFileURL(filePath).href;
        const imported = await import(fileUrl);

        const command = imported.default as BaseCommand;

        if (command && 'data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
        } else {
          console.log(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          );
        }
      }
    }

    const rest = new REST().setToken(token);

    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // Synchronize the full guild command set with Discord
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${commands.length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
