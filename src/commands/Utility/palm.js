import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const TARGET_CHANNEL_ID = '1569049476675403866'; // Your main target channel
const EVENTS_CHANNEL_ID = '1553825420137472010';
const UPDATES_CHANNEL_ID = '1553825401971679424';

export default {
    data: new SlashCommandBuilder()
        .setName("palmcreation")
        .setDescription("Sends the Palm Creation info embed and dropdown menu"),

    async execute(interaction) {
        const deferSuccess = await InteractionHelper.safeDefer(interaction, { ephemeral: true });
        if (!deferSuccess) {
            logger.warn(`PalmCreation interaction defer failed`, {
                userId: interaction.user.id,
                guildId: interaction.guildId,
                commandName: 'palmcreation'
            });
            return;
        }

        try {
            // Fetch the specific channel directly from the guild
            const targetChannel = await interaction.guild.channels.fetch(TARGET_CHANNEL_ID);

            if (!targetChannel) {
                await InteractionHelper.safeEditReply(interaction, {
                    content: 'Could not find the specified target channel.'
                });
                return;
            }

            // 1. Build Embed
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

            // 2. Build Select Menu
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('info_select')
                .setPlaceholder('Rules Selection')
                .addOptions([
                    { label: 'Events Information', value: 'events_info' },
                    { label: 'Updates', value: 'updates_info' },
                ]);

            const row = new ActionRowBuilder().addComponents(selectMenu);

            // 3. Send directly to the target channel
            await targetChannel.send({
                embeds: [embed],
                components: [row],
            });

            await InteractionHelper.safeEditReply(interaction, { 
                content: `Palm Creation panel successfully sent to <#${TARGET_CHANNEL_ID}>!` 
            });

            logger.info(`PalmCreation panel sent to channel`, {
                userId: interaction.user.id,
                guildId: interaction.guildId,
                targetChannelId: TARGET_CHANNEL_ID
            });
        } catch (error) {
            logger.error(`Error executing PalmCreation command`, {
                error: error.message,
                stack: error.stack,
                userId: interaction.user.id,
                guildId: interaction.guildId
            });

            await InteractionHelper.safeEditReply(interaction, { 
                content: `Failed to send message: ${error.message}` 
            });
        }
    },

    async handleComponent(interaction) {
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
};
