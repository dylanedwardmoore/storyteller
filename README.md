# Storyteller

Welcome! I'll be updating this readme in the next few days to make it more informative as well as adding several additional features to the *Storyteller* project. In the meantime, I recommend checking out the example I have in the `modules` folder to get a sense for how to create your own story, when you feel ready you can go ahead and replace that with your own work.

## Installation

To set up this repo, open a terminal and navigate to the directory where you would like to clone *Storyteller*, then run the following commands (you should be able to just copy and paste these):

```
git clone https://github.com/dylanedwardmoore/storyteller.git
cd storyteller
npm install
cp .env.example .env
```

Now, open the *Storyteller* project in vscode and open the `.env` file, you should update the API key here to be your Telegram API key. Now everything should be set up to run the example. To continuously rebuild and relaunch the application, you can run the following command: 

```
npm run start:dev
```

Now you should be able to chat with your bot :) try sending it a message...
