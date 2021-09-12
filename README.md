# Homescript

Script your smart home

The `web` folder contains the web client and API for Homescript. The `server` folder contains the server responsible for executing users' scripts. The server does not need to be internet-accessable, it just needs to be able to access the database and any needed smart home APIs.

## Installation

Run `yarn install` to install dependencies. To start the server, run `yarn start` from the server directory. To start the web app, run `yarn dev` for a development server or `yarn build` and then `yarn start` for a production build.
