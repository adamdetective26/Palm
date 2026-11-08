import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed } from '../utils/embeds.js';
import { logger } from '../utils/logger.js';

const TARGET_CHANNEL_ID = '1569049476675403866'; // Your target channel
const EVENTS_CHANNEL_ID = '1553825420137472010';
const UPDATES_CHANNEL_ID = '1553825401971679424';

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        logger.info(`Ready event triggered. Attempting to send Palm Creation panel to channel: ${TARGET_CHANNEL_ID}`);

        try {
            // 1. Force fetch the channel directly via Discord API to bypass cache misses
            const targetChannel = await client.channels.fetch(TARGET_CHANNEL_ID).catch((err) => {
                console.error(`[CRITICAL] Failed to fetch channel ${TARGET_CHANNEL_ID}:`, err.message);
                return null;
            });

            if (!targetChannel) {
                logger.error(`Could not find channel ${TARGET_CHANNEL_ID}. Ensure the bot is in the server and the ID is correct.`);
                return;
            }

            console.log(`[SUCCESS] Found channel "${targetChannel.name}" in guild "${targetChannel.guild.name}" (${targetChannel.guild.id})`);

            // 2. Build the Embed
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

            // 3. Build the Select Menu
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

            // 4. Send the message to the target channel
            await targetChannel.send({
                embeds: [embed],
                components: [row],
            });

            logger.info(`Palm Creation panel successfully sent to channel ${TARGET_CHANNEL_ID}!`);
            console.log(`[SUCCESS] Palm Creation panel posted to #${targetChannel.name}!`);

        } catch (error) {
            console.error('[CRITICAL ERROR] Failed to send startup embed:', error);
            logger.error('Error automatically sending Palm Creation startup panel:', {
                message: error.message,
                code: error.code,
                status: error.status,
                stack: error.stack
            });
        }
    }
};

/**
 * Global component interaction handler for the dropdown menu.
 * Hook this into your main interactionCreate router.
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
