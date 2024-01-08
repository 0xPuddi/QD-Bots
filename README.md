# Quarry Draw Twitter to Discord bot

A simple js bot that will fetch, with the free usage api (depriciated), from twitter and send any messages that match the twitter id you are looking for.

## Usage
Start with adding the environment variables in your `.env` that are needed in the oracle, where:

- `DISCORD_TOKEN` is the bot discord auth token.
- `TWITTER_BEARER_TOKEN` is the twitter bearer access token
- `TWITTER_USER_ID` is the twitter user id
- `DISCORD_CHANNEL_ID_TWEETS` is the discord channel id in which the bot will send messages
- `DISCORD_CUSTOM_ROLE` is the discord cusstom role that will be pinged with messages
- `DISCORD_CHANNEL_ID_RAID_TWEETS` is the discord channel in which raid messages will be sent by the bot

For syntax example refer to .env.example

Before running the script install all required packages:
```shell
npm i
```

Then run the Oracle with any js runtime (node):
```shell
node index.js
```

## Notes
Note: As X updated the usage on its free API the bot is depreciated.