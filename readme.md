# WaxLinker Backend

The WaxLinker Backend is a Node.js and Express.js application designed to provide backend services for the WaxLinker frontend. It integrates with Twitter for authentication and the EOS blockchain for data storage and retrieval.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Configuration](#configuration)
4. [Running the Backend](#running-the-backend)
5. [Serving the Frontend](#serving-the-frontend)
6. [Endpoints](#endpoints)
7. [Deployment](#deployment)

## Prerequisites

- Node.js
- npm
- A `.env` file based on the `evn_example` template with the required environment variables filled in.

## Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd waxLinker_backend-main
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

## Configuration

Ensure that you have a `.env` file in the root directory of the project. This file should have the following structure (based on the `evn_example` file):

```
PORT=8080
TWITTER_API_KEY=Your_Twitter_API_Key
TWITTER_API_SECRET_KEY=Your_Twitter_API_Secret_Key
SESSION_SECRET=Your_Session_Secret
EOS_PRIVATE_KEY=Your_EOS_Private_Key
TWITTER_CLIENT_ID=Your_Twitter_Client_ID
TWITTER_CLIENT_ID_SECRET=Your_Twitter_Client_ID_Secret
BLOCKCHAIN_URL=https://wax.api.eosnation.io
BLOCKCHAIN_WAXLINKER=xxxwaxlinker
DOMAIN=Your_Domain
```

Replace the placeholder values with your actual credentials.

## Running the Backend

To start the backend server:

```bash
npm start
```

This will start the server on the port specified in the `.env` file (default: 8080).

## Serving the Frontend

The backend is configured to serve static files from the `dist` directory, which is assumed to contain the compiled frontend React application. 

When you compile your React application, ensure that the output is directed to this `dist` directory. Any unmatched route on the backend will serve the `index.html` file from the `dist` directory, enabling client-side routing for single-page applications.

## Endpoints

The backend provides various endpoints grouped under the `/api` prefix. For detailed information on each endpoint, refer to the router configuration files.

## Deployment

When deploying to a production environment:

1. Ensure the `.env` file contains the correct values for the production environment.
2. Build the frontend React application and ensure the output is in the `dist` directory.
3. Start the backend server using a process manager like `pm2`.
