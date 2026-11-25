import { Client, Collection } from 'discord.js';
import { BaseCommand } from './command';

/**
 * Extends the default discord.js Client class to cometo store
 * and type-check the bot's loaded the slash commands.
 */
export class ExtendedClient extends Client {
  commands: Collection<string, BaseCommand> = new Collection();
}
