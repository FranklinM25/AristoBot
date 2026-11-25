import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

import { BaseCommand } from '../../types';

/**
 * Basic connectivity verification command.
 * Replies with "Pong!" to confirm the bot is online and responsive.
 */
const ping: BaseCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!');
  },
};

export default ping;
