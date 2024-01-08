/**
 * Packages and setup
 */

// env
require('dotenv').config();

// Discord
const Discord = require('discord.js');
const discordClient = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
    ],
});
const prefix = '~';
discordClient.login(process.env.DISCORD_TOKEN); // connect to Discord

// Twitter
const { ETwitterStreamEvent, TwitterApi } = require('twitter-api-v2');
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
const roClient = twitterClient.readOnly;

// Random number between two values
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
};

// Phrases
function randomBusinessPhrase() {

    let phrases = [
        'QuarryDraw just tweeted!',
        'What is your take about this?',
        'Do you like it?',
        'Go spread some love!'
    ];

    return phrases[getRandomArbitrary(0, (phrases.length - 1)).toFixed()]
};

// Cool raid phrases to get more familiar
function randomRaidPhrase() {

    let phrases = [
        'Time to raid it!',
        'Go share some love!',
        'He is talking about us!',
    ];

    return phrases[getRandomArbitrary(0, (phrases.length - 1)).toFixed()]
};


// Query Tweets
discordClient.once('ready', async () => {

    try {

        // Delete rules
        const deleteRules = await roClient.v2.streamRules();
        if (deleteRules.data?.length) {
            await roClient.v2.updateStreamRules({
                delete: { ids: deleteRules.data.map(rule => rule.id) }
            });
        };

        //Add rules
        await roClient.v2.updateStreamRules({
            add: [

                // ID tweets - only post
                { value: 'from:' + process.env.TWITTER_USER_ID + ' -is:retweet -is:reply', tag: 'QuarryDraw ID' },

                // Raid Tweets
                { value: "@QuarryDraw_UM", tag: 'QuarryDraw Raid' }

            ]
        });

        // Start searches and log results
        const stream = await roClient.v2.searchStream({
            'tweet.fields': ['referenced_tweets', 'author_id'],
            expansions: ['referenced_tweets.id']
        });

        await stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });

        stream.on(
            ETwitterStreamEvent.Data,
            async eventData => {

                try {

                    var url = "https://twitter.com/" + eventData.data.author_id + "/status/" + eventData.data.id;

                    if (eventData.data.author_id == process.env.TWITTER_USER_ID) {
                        discordClient.channels.fetch(process.env.DISCORD_CHANNEL_ID_TWEETS).then(channel => {
                            channel.send(
                                randomBusinessPhrase() + '\n' +
                                '\n' +
                                process.env.DISCORD_CUSTOM_ROLE + '\n' +
                                '\n' +
                                url
                            );
                        }).catch(err => {
                            console.log(err)
                        });
                    };

                    // Raids
                    if (eventData.matching_rules[0].tag == 'QuarryDraw Raid') {
                        discordClient.channels.fetch(process.env.DISCORD_CHANNEL_ID_RAID_TWEETS).then(channel => {
                            channel.send(
                                randomRaidPhrase() + '\n' +
                                '\n' +
                                url
                            );
                        }).catch(err => {
                            console.log(err)
                        });
                    };

                } catch (error) {
                    console.error(error);
                };
            },
        );
    } catch (e) {
        console.error(e);
    };
});