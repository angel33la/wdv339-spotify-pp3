# wdv339-fullstack-pp3

# Project Overview
------

Music Search App Project for Project Portfolio ||| @ Full Sail University
This project is a music search application that allows users to search for songs, artists, and albums using the [YouTube API](https://developers.google.com/youtube/v3). The app provides a user-friendly interface for exploring music and discovering new tracks. In a microservice structure using both a frontend and a backend, the frontend is built with React and the backend is built with Node.js and Express. The app also includes features such as user authentication (OAuth JSON web tokens), playlist creation, and music recommendations based on user preferences.

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