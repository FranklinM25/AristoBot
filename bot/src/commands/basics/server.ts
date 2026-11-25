import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { BaseCommand } from '../../types';

/**
 * Retrieves and display basic information about the current Discord server
 * (server name and total member count).
 */
const server: BaseCommand = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.'),
  async execute(interaction: ChatInputCommandInteraction) {
    // Ensure the command is executed within a server (guild) context and not in DMs
    if (!interaction.guild) {
      await interaction.reply({
        content: 'This command can only be used inside a server.',
        ephemeral: true,
      });
      return;
    }

    await interaction.reply(
      `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
    );
  },
};

export default server;
