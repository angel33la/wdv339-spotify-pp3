# Music/Search/Play FullStack MERN App

<a href='https://github.com/shivamkapasia0' target="_blank"><img alt='Github' src='https://img.shields.io/badge/FSU_2026-100000?style=for-the-badge&logo=Github&logoColor=ffffff&labelColor=000000&color=e55525'/></a>

# Project Overview
------

Music/Search/Play App Project for Project Portfolio 3 @ Full Sail University
This project is a full-stack music discovery application that lets signed-in users search for songs, artists, and albums using the [YouTube API](https://developers.google.com/youtube/v3). As well as play them in-app and organize picks into personal playlists. The app provides a user-friendly interface for exploring music and discovering new tracks. In a microservice structure using both a frontend and a backend. The frontend is a React single-page app and the backend is an Express API with Google OAuth, JWT-based auth, and MongoDB persistence.

## Who Is It For?
------

This project is ideal for:
- Music enthusiasts looking for a personalized music discovery experience.
- Developers interested in building full-stack applications with React and Express.
- Anyone looking to integrate third-party APIs (like YouTube) into their projects.
- Students and professionals seeking to enhance their skills in web development, API integration, and user authentication.

## What It Does
-------

- Signs users in with Google OAuth and protects app routes with JWT-backed auth.
- Searches YouTube music videos through a backend `/api/search` endpoint.
- Plays selected videos in embedded YouTube iframes, including a persistent player.
- Creates, renames, opens, and deletes user playlists stored in MongoDB.
- Adds and removes songs inside playlists, with duplicate checks on the server.
- Lets users queue songs for simple similarity-based result reordering.
- Stores saved songs and display/preferences locally in browser storage.

## How It Works
-------

**React client**: `App.js` wires protected routes for Home, Playlists, Songs, and Preferences; `AuthContext` loads the current user via `/api/auth/me`; `PlayerContext` keeps the active song in session storage. API wrappers call Express endpoints under `/api/auth`, `/api/search`, and `/api/playlists`, retrying once after `/api/auth/refresh` on 401.

**Express server**: `server.js` registers auth, search, and playlist routes; auth controller handles Google OAuth callback, JWT issuance, refresh cookies, and `/me`; playlist controller persists playlists and song metadata in MongoDB via Mongoose.

**External services/data flow**: Google OAuth authenticates users, YouTube Data API search returns video metadata, MongoDB stores users and playlists, and browser localStorage stores preferences and saved songs.

## How To Run
------

- Create env files or variables. Repo evidence shows the app needs at least `REACT_APP_API_URL` on the *client* and `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, and `YOUTUBE_API_KEY` on the *server*. `CLIENT_URL` and `JWT_REFRESH_SECRET` are optional fallbacks in code.
- Install dependencies in both apps: run `npm install` in `client/` and `server/`.
- Start the backend: run `npm start` in `server/` (or `npm run dev` for nodemon).
- Start the frontend: run `npm start` in `client/`, then open `http://localhost:3000`.

*Evidence basis*: README.md, client/src/*, server/server.js, server/src/routes/*, server/src/controllers/*, server/src/models/*, and server/src/utils/youtubeService.js.

## Prerequisites
------

### Development Environment & Tools
- Node.js & npm
- Code Editor (e.g., Visual Studio Code)
- Chrome/Firefox/Safari/Edge >= Latest 2 major versions
- Version Control (e.g., Git & GitHub)
- API Testing Tool (e.g., Postman)
- Environment Variables Management (e.g., dotenv)

### Technical Proficiencies (MERN Stack)
- JavaScript (ES6+)
- React.js
- Node.js
- Express.js
- MongoDB (for user data storage)
- Axios (for API requests)

### YouTube API & Playback Prerequisites
- Google Account
- YouTube API Key (Client ID and Client Secret)
- YouTube Web Playback SDK (for music playback functionality)
- OAuth 2.0 Authentication (for user login and access to YouTube data)

### Other Considerations
Ports 3000 (frontend) and 5000 (backend) should be available for development and testing. Ensure that CORS is properly configured on the backend to allow requests from the frontend. 

### Icon & Theme Library for UI/UX
- [ANT Design](https://ant.design/) for UI components and icons to enhance the user interface and experience.

## Getting Started
------

In order to setup the project you will need to setup `.env` file. You can do this by making a copy of our `.env.dist` and naming it to `.env` and filling in the required values. Which will be all of your environmental variables for the project. You can find the required values in the YouTube Developer Dashboard.

After that is completed, you will need to install the dependencies for both the frontend and backend. You can do this by running `npm install` in both the `client` and `server` directories. This installs your `node_modules` for both the frontend and backend. Here is the command to complete this step.

```bash
npm install
```
After the dependencies are installed, you can start the development server for both the frontend and backend. You can do this by running `npm start` in both the `client` and `server` directories. This will start the development server for both the frontend and backend. Here is the command to complete this step.

```bash
cd client & npm start
cd server & npm start
```
This will start the development server for both the frontend and backend. The frontend will be available at `http://localhost:3000` and the backend will be available at `http://localhost:5000`. You can now access the app in your browser and start using it to search for music, create playlists, and discover new tracks.

### Links
-----
The links to the project are listed below:
* [Client](http://localhost:3000)
* [Server](http://localhost:5000)
* [YouTube API middleware](http://localhost:5000/youtube/v1)
* [Endpoint to check the status of our application's JWT](http://localhost:5000/youtube/v1/status) 
Returns true if a valid JWT exists, otherwise false.
* [Endpoint request a new JWT from YouTube using the authentication workflow](http://localhost:5000/youtube/v1/login)
* [Endpoint for a generated/global search to YouTube.](http://localhost:5000/youtube/v1/search?q=QUERY&type=TYPE)
Replace QUERY with the search term and TYPE with the type of search (e.g., track, artist, album). Returns JSON of all results.


### 🚀Production
-----
The production version of this has my backend hosted on Render; my frontend is being deployed and hosted on Vercel. The links to the production version of the project are listed below:
* [Client](https://wdv339-spotify-pp3-clean.vercel.app)
* [Server](https://wdv339-spotify-pp3.onrender.com)

