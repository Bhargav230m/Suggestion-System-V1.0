const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const SuggestionSchema = require("../../Schemas/SuggData");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const { member, guildId, customId, message } = interaction;

    if (!interaction.isButton()) return;

    const embedd = new EmbedBuilder().setColor("Orange");

    if (customId == "suggest-accept" || customId == "suggest-decline") {
      if (!member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({
          embeds: [
            embedd.setDescription(
              "You do not have permission to use that button!"
            ),
          ],
          ephmeral: true,
        });

      SuggestionSchema.findOne(
        { GuildID: guildId, MessageID: message.id },
        async (err, data) => {
          if (err) throw err;

          if (!data)
            return interaction.reply({
              embeds: [embedd.setDescription("No data was found")],
              ephmeral: true,
            });

          const embed = message.embeds[0];

          if (!embed)
            return interaction.reply({
              embeds: [embedd.setDescription("No embed was found")],
              ephmeral: true,
            });

          switch (customId) {
            case "suggest-accept":
              embed.data.fields[2] = {
                name: "Status:",
                value: "Accepted!",
                inline: true,
              };
              const AcceptedEmbed = EmbedBuilder.from(embed).setColor("Green")
              message.edit({ embeds: [AcceptedEmbed]})
              interaction.reply({
                embeds: [
                  embedd.setDescription(
                    "Successfully accepted the suggestion!"
                  ),
                ],
                ephemeral: true,
              });
              break;
            case "suggest-decline":
             embed.data.fields[2] = {
                name: "Status:",
                value: "Declined!",
                inline: true,
              };
              const DeclinedEmbed = EmbedBuilder.from(embed).setColor("Red")
              message.edit({ embeds: [DeclinedEmbed]})
              interaction.reply({
                embeds: [
                  embedd.setDescription(
                    "Successfully declined the suggestion!"
                  ),
                ],
                ephemeral: true,
              });
          }
        }
      );
    }
  },
};
