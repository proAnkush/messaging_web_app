# Messaging web app

## Running the web app locally
### install nodejs
> sudo apt-get update


> curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -

> sudo apt-get install -y nodejs

### clone repository
> sudo apt-get install git

> git clone https://github.com/proAnkush/messaging_web_app.git 

### start react app locally
> cd messaging_web_app_backend/ 

> npm install

> npm start

And the web app will start running on http://localhost:3000
When running locally the app will use amplify hosted backend.

## Backend local setup instructions
### pull the latest backend code from amplify
> amplify pull --appId dqt4xyq88nyig --envName main

## mocking api locally
### Create mock event
> touch event.json

event.json
```json
{
  "httpMethod": "GET",
  "path": "/queries",
  "queryStringParameters": {
    "limit": "10"
  },
  "headers": {
    "Content-Type": "application/json"
  },
  "body": ""
}
```

### Run amplify mock

> amplify mock function messagingwebappfdfedba6

Provide path to previously created event.json when prompted