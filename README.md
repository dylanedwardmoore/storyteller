# Storyteller

This is an example from Dylan and Sophia's TUMO workshop on designing an interactive storytelling chatbot. All the code here was written during and for this course.

I recommend checking out the example I have in the `modules` folder to get a sense for how to create an interactive story.

## Installation

To set up this repo, open a terminal and navigate to the directory where you would like to clone *Storyteller*, then run the following commands (you should be able to just copy and paste these):

```
git clone https://github.com/dylanedwardmoore/storyteller.git
cd storyteller
npm install
cp .env.example .env
```

Now, open the *Storyteller* project in vscode and open the `.env` file, you should update the API key here to be your Telegram API key. You can set that up by following the [instructions here](https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token). Once that's ready, everything should be set up to run the example. To continuously rebuild and relaunch the application, you can run the following command: 

```
npm run start:dev
```

Now you should be able to chat with your bot :) try sending it a message...
