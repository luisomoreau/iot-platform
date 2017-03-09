# IoT Platform

Angular + Loopback admin app to see Sigfox devices and messages.

I used [https://github.com/beeman/loopback-angular-admin](https://github.com/beeman/loopback-angular-admin) as a base project. 
This project does not longer exists and has been replaced with [https://github.com/colmena/colmena-cms](https://github.com/colmena/colmena-cms).
Thank you [Bram Borggreve](https://github.com/beeman) for the base of the project!


## Getting started

### Dependencies

Installation depends on `node`/`npm` with `grunt` and `bower` installed globally.

    $ npm install -g bower grunt-cli

### Installation:

One line installation:

    git clone https://github.com/luisomoreau/iot-platform.git && cd iot-platform && npm install && grunt build && grunt serve

Or follow this steps

Checkout the project:

    git clone https://github.com/luisomoreau/iot-platform.git

Install the Node packages:

    npm install

Run grunt build:

    grunt build
    
Run grunt serve to start the API and frontend:

    grunt serve
    

## Running

The project is separated in a server and a client.

### Server

To run the server you issue the command:

    npm start

Or to run it with nodemon (needs `nodemon` installed globally). This will
automatically restart the server when you change its code:

    npm run dev

The command `grunt serve` explained below wil automatically start the API.

### Client

Rebuild the lb-services.js file with the correct `API_URL` for development.

    API_URL=http://0.0.0.0:3000/api grunt

To run the client you issue the command. This will also start the API.

    grunt serve

It will open the project in your default browser with livereload enabled.
This will take care of reloading the page when you change your code.

## Try it now with Heroku

Deploy an instance on your Heroku account to play around with it!

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

An alternative way to get it running at Heroku is to install the [Heroku Toolbelt](https://toolbelt.heroku.com) and follow these steps:

```
git clone https://github.com/luisomoreau/iot-platform.git my-project
cd my-project
heroku apps:create my-project
git push heroku master
```


## Users

After an installation the following users are created:

- **Admin user**: Email: ```admin@admin.com```, password: ```admin```
- **Regular user**: Email: ```user@user.com```:, password ```user```

Please note, at this moment there is no difference in permissions for admin users or regular users. Feel free to submit a pull request!
