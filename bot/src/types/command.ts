import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

/**
 * Defines the standard structure that every slash command must implement,
 * ensuring consistent command metadata and execution logic across the bot.
 */
export interface BaseCommand {
  /** The slash command builder configuration (name, description, options, or subcommands). */
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder;

  /** The asynchrnous handler function executed when the command is triggered. */
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
