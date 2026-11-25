import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { BaseCommand } from '../../types';

/**
 * Retrieves and displays basic information about the user who executed the command
 * (username and the date they joined the current server)
 */
const user: BaseCommand = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.'),
  async execute(interaction: ChatInputCommandInteraction) {
    // Ensures the command is executed within a server (guild) context
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: 'This command can only be used inside a server.',
        ephemeral: true, // Solo lo ve el usuario que ejecutó el comando
      });
      return;
    }

    // Cast interaction.member to GuildMember to safely access guild-specific properties like joinedAt
    const member = interaction.member as GuildMember;
    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${member.joinedAt}.`,
    );
  },
};

export default user;
