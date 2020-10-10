## ServerStatus Public Release 
Hello! Thank you for using the spaghetti code I call ServerStatus. I made it using a previous minecraft server starting discord bot I found here on github, and I feel like now that I've made this I should share it so less people have to go through the hassle I went through to make this. It's not perfect, I know (it's my first repo as a learning JS developer.) but it should get the job done well enough.

## How to configure the bot to work:
The bot only has two main dependencies: the latest installation of [Node.js](https://nodejs.org/en/) and discord.js (which is required for pretty much every discord bot.) 

 1. Once you get both of those working, you'll need to edit both main.js and starter.bat to allow it to actually start the server, by editing line **16** in main.js and line **4** in starter.bat to the **exact directory where your minecraft server starter batch file is**.
 2. You are most likely going to want to edit lines **8, 9, 10, 86, 106, 122, and 140** to your liking, as they all contain custom text that pertains specifically to your server which you need to set yourself in order to take full advantage of this bot.
 3. Lastly, in order to host this bot (at least, the easiest way to host it that I have found) is to host it locally on the **same server/computer** as wherever your Minecraft server is being hosted using something like `node-foreman`. I threw in a Procfile in case you go this route, and if you do just run `nf start` from within the folder where this is all contained through a Node.js terminal (easiest route being the VSC terminal.) If you find any easier methods to host this, don't hesitate to tell me about this, but as of right now, this seems to be the easiest way. **NOTE: KEEP IN MIND THAT IF YOU DECIDE TO GO DOWN THIS ROUTE, YOU WILL NEED TO INSTALL THE NODE MODULES MANUALLY. YOU'LL NEED TO INSTALL `discord.js`,`child_process`, AND `node-fetch` USING `npm`.**

