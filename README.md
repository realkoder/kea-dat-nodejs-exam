# Exam Project - Minified IntelliOptima

## Running the Application

To run the application, follow these steps:

1. Navigate to the root folder of the project.
2. Execute the following command in the terminal:

```bash
npm run dev
```

This command will start the server, which performs server-side rendering of the client using browser-sync.

## Environmental Variables

To run the application successfully, you will need to set up the required environmental variables. You can find an example of the environmental variables needed in the file named `.env.sample`. Make sure to create a new file named `.env` and populate it with the necessary environmental variables based on the sample file.

Please note that this application is designed to use MongoDB Atlas as its database.

## Server

[Link to Server README](server/README.md)

The server side of the application is built using Node.js and Express. It utilizes MongoDB Atlas as its database through the use of Mongoose for seamless interaction with the database. Additionally, the server is designed to handle authentication and authorization using JSON Web Tokens (JWT) for secure user access.

### General Setup

The server is structured following the MVC (Model-View-Controller) pattern for efficient organization of code. It includes middleware for handling requests, models for database interaction, and controllers for business logic implementation.

## Client

[Link to Client README](client/README.md)

The client side of the application is developed using Svelte, a popular front-end library for building user interfaces. The client is designed to communicate with the server through RESTful API endpoints for seamless data exchange.

### Tech Stack

- Svelte
- Vite
- TailwindCSS
- JavaScript (ES6+)

<br>

---

### Deployment

#### FrontEnd

SSH to linode server.

```bash
# cd into client in git project

run npm install

npm run build

# Move builded dist folder to /var/www/svelte-app
sudo cp -r /root/kea-dat-nodejs-exam/client/dist /var/www/svelte-app

# Set correct permissions
sudo chown -R www-data:www-data /var/www/svelte-app
sudo chmod -R 755 /var/www/svelte-app

# install serve to staticly serve builded frontend svelte app
sudo npm install -g serve

# serve the app
serve -s build

# setup with pm2
pm2 serve build 3000 --name "svelte-app"

```

#### Backend

We are using `Linode` where we have a running `ubuntu` server - this is how we deployed our `nodejs express` server.
Setting up ubuntu env, installing npm, node, pm2 and git cloning project + executing server/app.js with pm2

This tutorial has been used -> https://www.youtube.com/watch?v=sD8X4CApdpo

```bash
# ssh to running ubuntu server

# Updating and upgrading current ubuntu environment
apt-get update
apt-get upgrade

# Install npm
apt-get install npm

# With npm install n globally to easilier install different versions of node
npm i -g n

# With n install the latest released node version
n install lts

# Then switch and set current node to the new installed node version (20.14.0)
n use 20.14.0

# Then exit session to make the node version change

# Install pm2 as the production process manager to nodejs app alive forever
nmp i -g pm2

# Start the app.js and give it a name for pm2 as api
pm2 start app.js -n api

# Stop pm2
pm2 stop api

# Get metadata about running app
pm2 show api

# Get logs
pm2 logs

# Create a script for starting up api when server reboots
pm2 startup ubuntu
```

Setting up nginx with reverse proxy.

```bash
# Install nginx
apt-get install nginx

# After instalation cd /etc/nginx
cd /etc/nginx

# Then go cd sites-available/
cd sites-available/

# Then edit default file
nano default
# Add either ip:address or domain name for the server_name e.g. 199.198.1.1 www.199.198.1.1
# Go to location {} below and delete everyting inside {}
# Add 'proxy_pass http://localhost:5000;' to reverse request for the running server app
# Add 'proxy_http_version 1.1;'
# Add 'proxy_set_header Upgrade $http_upgrade;'
# Add 'proxy_set_header Connection 'upgrade';'
# Add 'proxy_set_header Host $host'
# Add 'proxy_cache_bypass $http_ugprade;'

# Check if the changes made to default nginx file is correct
nginx -t

# Restart nginx after chaning default file
systemclt restart nginx
```

Adding server firewall.

```bash
# Use firewall of ubuntu
ufw enable

ufw allow ssh

ufw allow http

ufw allow https
```

Configurering https

```bash
# Install certbot - needs to be installed by packagemanager snap
snap install --classic certbot

# Link these files to allow executing certbot commands
ln -s /snap/bin/certbot /usr/bin/certbot

# Connect certbot with nginx, setting up ssl config
certbot --nginx

# Used to regenerate a new letsencrypt ticket before the current one in use expires
certbot renew --dry-run
```

<br>

---

### References

`Svelte-rsocket-demo` -> https://github.com/linux-china/svelte-rsocket-demo/blob/master/README.md
`Svelte working with BUFFER` -> https://github.com/vitejs/vite/discussions/2785

<br /> <br />

---

# Introducing Minified IntelliOptima: Where AI and Human Conversations Collide 🚀

Welcome to IntelliOptima, a game-changing platform that's redefining what it means to chat online! 🌟 Say goodbye to boring, one-dimensional chatrooms and hello to a world where artificial intelligence (AI) models become your conversation partners. 🤖💬

## 🎭 A Cast of AI Characters

At IntelliOptima, you'll encounter a diverse cast of AI models, each with its own unique personality and area of expertise. Whether you're in the mood for a witty exchange, seeking advice, or just want to geek out about your favorite topics, there's an AI model here that's ready to engage with you. 🧠💡

## 🔄 Context-Aware Conversations

What sets IntelliOptima apart is its ability to maintain context across conversations. No more starting from scratch every time you switch between AI models! Our platform ensures that each AI model has a comprehensive understanding of your previous interactions, allowing for seamless and coherent conversations. 🗣️🔗

## 🚀 Powered by RSocket

Under the hood, IntelliOptima leverages the power of RSocket to enable real-time, bi-directional communication between users and AI models. This means you can enjoy lightning-fast responses and a smooth, uninterrupted conversational flow. ⚡💬

## 📝 Annotate Your Chats

We believe in giving you control over your conversations. With IntelliOptima, you have the ability to annotate your chats using the '@' symbol, allowing you to provide context, clarify your intentions, or even switch between AI models on the fly. It's like having a personal assistant that understands your every command! 🎨✍️

## 👥 Collaborative Chatrooms

IntelliOptima takes collaboration to the next level by allowing users to share chatrooms with each other and with AI models. Imagine working on a project with your team, brainstorming ideas, and having an AI model right there with you, offering insights and suggestions. It's a whole new way of collaborating and problem-solving! 🤝💡

## 🌐 A World of Possibilities

With IntelliOptima, the possibilities are endless. Whether you're a student looking to expand your knowledge, a professional seeking expert advice, or simply someone who enjoys engaging conversations, our platform has something for everyone. Step into a world where the boundaries between human and artificial intelligence blur, and let your conversations take flight! 🌍🚀
