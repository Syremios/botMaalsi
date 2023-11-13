const { Client, GatewayIntentBits, Partials, ActivityType, EmbedBuilder } = require('discord.js');
const schedule = require("node-schedule");

require("dotenv").config();

const { getEdt } = require("./utils/getEdt")

const client = new Client({
	intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds],
	partials: [Partials.Channel]
});
let lastMessageId = null;
client.on('ready', async () => {

	const date = new Date();
	let currentDay = String(date.getDate()).padStart(2, '0');
	let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
	let currentYear = date.getFullYear();

	let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;

	console.log("Bot On : " + currentDate);
	client.user.setStatus('available')
	client.user.setPresence({
		status: "online",
		activities: [{
			name: `The World's End`,
			type: ActivityType.Watching,
			url: "https://youtu.be/NNbpw-e_57g?si=sZiYaBBbqfXJdNr2"
		}],
	});

	// Commence le crontab tous les jours à 3 am
	const job = schedule.scheduleJob("0 3 * * *", async () => {

		const now = new Date();
		const day = now.getDay();

		// Si Samedi ou Dimanche
		if ([0, 6].includes(day)) {
			return;
		}

		const [matin, aprem] = await getEdt(day);
		/*
		const matin = {
			"title": "INFAL235-Choix des technologies et infra. développement",
			"heure": "08:45 - 12:15",
			"salle": "ST 214"
		}

		const aprem = {
			"title": "INFAL235-Choix des technologies et infra. développement",
			"heure": "13:15 - 16:45",
			"salle": "ST 214"
		}*/
		// Normalement cours toute la journée
		if(matin == undefined || aprem == undefined)
			return;

		const embed = new EmbedBuilder()
			.setColor(0xB200ED)
			.setTitle('Emploi du temps de la journée')
			.setURL('https://ent.cesi.fr/mon-emploi-du-temps')
			.addFields(
				{ name: matin.title, value: `${matin.heure}\n${matin.salle}` },
				{ name: aprem.title, value: `${aprem.heure}\n${aprem.salle}` },
			);
		const channel = client.channels.cache.get(process.env.CHANNEL);

		if (lastMessageId != null) {
			const lastMessage = await channel.messages.fetch(lastMessageId);
			await lastMessage?.delete();
		}

		const newMessage = await channel.send({ embeds: [embed] });
		lastMessageId = newMessage.id;
	});
});

client.login(process.env.TOKEN);