import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { BaseCommand, ExtendedClient } from './types';

const token = process.env.DISCORD_TOKEN;

// Initialize the extended client with Guilds intent to receive server events
const client = new ExtendedClient({ intents: [GatewayIntentBits.Guilds] });

/**
 * Runs once when the bot establishes a ready connection with Discord.
 * `readyClient` narrows the client type so properties like `user` are non-nullable.
 */
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

/**
 * Dynamically loads all slash commands from `src/commands` subdirectories
 * into `client.commands` so they can be dispatched at runtime.
 */
async function loadCommands(): Promise<void> {
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const fileUrl = pathToFileURL(filePath).href;
      const imported = await import(fileUrl);
      const command = imported.default as BaseCommand;

      if (command && 'data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.warn(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
        );
      }
    }
  }
}

/**
 * Handles incoming slash command interactions and isolates runtime execution errors.
 */
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    // Choose followUp or reply depending on whether an initial response was already sent
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

// Load commands before logging in so the command map is populated on startup
void loadCommands().then(() => {
  void client.login(token);
});
