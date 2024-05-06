# Mandatory_||

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

The client side of the application is developed using React, a popular front-end library for building user interfaces. It leverages modern JavaScript features and follows best practices for state management using Redux. The client is designed to communicate with the server through RESTful API endpoints for seamless data exchange.


### Tech Stack
- Svelte
- Vite
- TailwindCSS
- JavaScript (ES6+)


### General Setup
The client is structured following a modular component-based architecture, allowing for easy maintenance and scalability. It will include state management using Redux, in future iteration for efficient handling of application state and user interactions.

----

## Server-Side Rendering (SSR)

In this application, server-side rendering (SSR) is achieved through Express, where the server serves the client by rendering the initial HTML on the server side and then sending it to the client. This approach improves performance, SEO, and initial page load speed by delivering fully rendered pages to the client.


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