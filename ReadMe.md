# ♟️ Chess++

### Created by: Paige, Michael, Mark 
#### 🐧 _Team Club Penguin_ 🐧

---

## Overview 
Chess++ is a gaming platform built for chess enthusiasts and beyond. Start by playing classic chess against
AI, locally with friends, or online via room-based matchmaking. Compete in ranked matches, track your progress, and 
chat with other players.

🔧 Built with React, Node.js, and Socket.IO

♟️ Multiple game modes: AI, local multiplayer, online PvP, and ranked

🧠 Elo-based ranking system for competitive play

💬 Real-time chat and player history

🕹️ Designed to support additional games in the future 


---

## Instructions for Cloning and Running the Project Locally

First, clone the repository:
> https://github.com/Mcoliane/mernuserauth.git 

__If you do not have a node interpreter installed on your computer, visit:__ [Node.js](https://nodejs.org/en/download)

_Or,_ if you are using IntelliJ:
- Open the Settings (Windows: Ctr+Alt+S, MAC: Command+Comma)
- In the sidebar, find and expand Languages & Frameworks, select Node.js.
- Then, in the node interpreter dropdown, select download and download the latest version. 


Create a .env file in the backend folder with the following variables:
If you so choose, you don't need to specify the PORT in the .env file, it will default to port 5001,

_Note: Replace the strings {...} with your environment variables. Ex. PORT=5000_
```env
PORT={PORT}
```

For this application, we used firebase. You will need to visit [Firebase](https://firebase.google.com/), at the top right 
open Go to console and create an account. You will then need retrieve the necessary files for firebase.js (Build > Authentication)
, firebaseAdmin.js (Build > Realtime Database), and serviceAccountKey.json (Build > Realtime Database). 

- `firebase.js` should be created under frontend > src > config 
- `firebaseAdmin.js` should be created under backend > config 
- `serviceAccountKey.json` should be added to the backend folder

Next, open two terminals in your IDE of choice (We used IntelliJ and Visual Studio Code).

In one of the terminal windows:
> cd backend
>
> npm install
>
> npm start

The terminal should display that the Server is listening on the port specified in the .env file or the default port (5001) and that the database 
has connected.

Then, in the second terminal window:

> cd frontend
>
> npm install
>
> npm start

A new browser window should open. If not, follow the link in the terminal (Example: https://localhost:3000/)

---

### Now you're free to explore!

Create an account and play some games! Chat with friends or play online (To test this you can create two accounts and 
have them logged in on two different browsers).


# Checkmate! And enjoy playing 😊

This project was only possible with the use of npm packages
- chess-js
- react-chessboard
- js-chess-engine
- HeroUI
- socketIO