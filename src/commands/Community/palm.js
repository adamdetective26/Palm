import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed } from '../utils/embeds.js';
import { logger } from '../utils/logger.js';
import { handleInteractionError, createError, ErrorTypes } from '../utils/errorHandler.js';

const TARGET_CHANNEL_ID = '1569049476675403866'; // Your main target channel where the embed goes
const EVENTS_CHANNEL_ID = '1553825420137472010';
const UPDATES_CHANNEL_ID = '1553825401971679424';

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        logger.info(`Ready event triggered for Palm Creation panel setup.`);

        try {
            // Fetch the specific channel directly from cache or API across guilds
            const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID).catch(() => null);

            if (!targetChannel) {
                logger.warn(`Palm Creation target channel (${TARGET_CHANNEL_ID}) could not be found.`);
                return;
            }

            // 1. Build the Embed using project utility
            const embed = createEmbed({
                title: 'Palm Creation',
                description: 
                    'A game designed to bring innovative and creative experiences to the ROBLOX Platform. We offer an optimized and immersive gameplay to the players that allows them to enjoy aspects of different roleplaying genres from eras of the old and the new.\n\n' +
                    'Roblox Group: [Click Here](https://www.roblox.com/groups/34676122/Palm-Creation)\n' +
                    'Discord: discord.gg/nNV55Mkq9D\n\n' +
                    '__________________________________________________\n\n' +
                    'Current Projects:\n\n' +
                    'An immersive experience within the modern day time of policing, and emergency services such as fire, medical, department of transportation and many more. A beautiful mountainous island jam packed full of crime, jobs, and city life.\n\n' +
                    '__________________________________________________\n\n' +
                    'Click below for more specific information!'
            }).setColor(0x0099ff);

            // 2. Build the Interactive Dropdown Menu
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('info_select')
                .setPlaceholder('Rules Selection')
                .addOptions([
                    {
                        label: 'Events Information',
                        value: 'events_info',
                    },
                    {
                        label: 'Updates',
                        value: 'updates_info',
                    },
                ]);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            // 3. Automatically send the message with the dropdown menu to the channel
            await targetChannel.send({
                embeds: [embed],
                components: [row],
            });

            logger.info(`Palm Creation embed and dropdown menu sent successfully to channel ${TARGET_CHANNEL_ID}!`);
        } catch (error) {
            logger.error('Error automatically sending Palm Creation startup panel:', {
                error: error.message,
                stack: error.stack
            });
        }
    }
};

/**
 * Global component interaction handler for the dropdown menu.
 * Make sure to hook this up in your main interactionCreate router!
 */
export async function handlePalmCreationSelect(interaction) {
    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'info_select') {
        const selectedValue = interaction.values[0];

        if (selectedValue === 'events_info') {
            await interaction.reply({ 
                content: `Click here to go to Events Information: <#${EVENTS_CHANNEL_ID}>`, 
                ephemeral: true 
            });
        } else if (selectedValue === 'updates_info') {
            await interaction.reply({ 
                content: `Click here to go to Updates: <#${UPDATES_CHANNEL_ID}>`, 
                ephemeral: true 
            });
        }
    }
}
