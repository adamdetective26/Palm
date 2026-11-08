import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// Configuration IDs from your original script
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
            // 1. Build the Embed using your project's createEmbed utility
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

            // 3. Send the message back to the channel where the command was run
            await interaction.channel.send({
                embeds: [embed],
                components: [row],
            });

            await InteractionHelper.safeEditReply(interaction, { 
                content: 'Palm Creation panel successfully deployed to this channel!' 
            });

            logger.info(`PalmCreation command executed`, {
                userId: interaction.user.id,
                guildId: interaction.guildId,
                channelId: interaction.channelId
            });
        } catch (error) {
            logger.error(`Error executing PalmCreation command`, {
                error: error.message,
                stack: error.stack,
                userId: interaction.user.id,
                guildId: interaction.guildId
            });
            await InteractionHelper.safeEditReply(interaction, { 
                content: 'An error occurred while deploying the panel.' 
            });
        }
    },

    // 4. Handle the dropdown selection interaction
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
