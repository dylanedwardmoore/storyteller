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

Now, open the *Storyteller* project in vscode and open the `.env` file, you should update the API key here to be your Telegram API key. You can set that up by following the [instructions here](https://www.siteguarding.com/en/how-to-get-telegram-bot-api-token). 

## Testing locally

Once that's ready, everything should be set up to run the example. To continuously rebuild and relaunch the application, you can run the following command: 

```
npm run start:dev
```

Now you should be able to chat with your bot :) try sending it a message...


## Deploying to Heroku

Once you have the local server running the way you'd like it to, you can use Heroku to deploy and have it run remotely. That way you can use your chatbot without having to have your computer running the node app all the time. To get setup, first sign up for a Heroku account and add the command line tools, as [described here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)

Now, from within the `storyteller` project directory that was created when you cloned this repository, create a heroku project. You can do this using the command (you can change "storyteller" below to anything you like): 

`heroku create storyteller`

You can re-deploy and restart your server at any time by editing any file (so that there are changes to deploy) and then running: 

`npm run deploy`

This will deploy your master branch to heroku. If anything breaks and you need to restart, try making a change and redeploying. Also, you can see the logs on your server by running:

`heroku logs`

Finally, to make it all work, you'll need to add your API token to the newly created project. This is basically the same steps you took for editing the .env file, but for the remote server. To accomplish this you should follow the [steps here](https://devcenter.heroku.com/articles/config-vars#managing-config-vars) for adding a config var to your newly created heroku project. Set the name of the var to `BOT_TOKEN` and the value to whatever your token is. Your config vars should match what you have locally in your .env file, so if you use other vars there, update your config vars in heroku accordingly. When you have this set up, you might need to redeploy to restart your server. After that, you should be good to go! If there are any errors, they should show up in the heroku logs. 
