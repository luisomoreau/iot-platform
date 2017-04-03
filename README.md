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

## Deploy using Dokku

If you don't know Dokku, it is a small PaaS implementation. It let you to build and manage the lifecyle of your applications.
It works almost the same way as Heroku but you can host it on your own servers.

Below is how to install it with debian system, you can still visit [http://dokku.viewdocs.io/dokku/](http://dokku.viewdocs.io/dokku/)
to get started with other systems.

```
wget https://raw.githubusercontent.com/dokku/dokku/v0.8.2/bootstrap.sh;
sudo DOKKU_TAG=v0.8.2 bash bootstrap.sh

```
Once the installation is complete, you can open a browser to setup your SSH key and virtualhost settings. 
Open your browser of choice and navigate to the host's IP address - 
or the domain you assigned to that IP previously - and configure Dokku via the web admin. 
Visit [https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-dokku-application](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-dokku-application) 
for more info.

Once Dokku is installed, we will deploy the app, add a Mongo Database and set the Environment variables:
 
- Deploy the app:

From your local repository:

```
 git remote add <production> dokku@<your-domain>:<your-app-name>
 git push <production> master

```

- Create a Mongo service:

Enter in your server (via SSH) and install dokku-mongo plugin:
```
sudo dokku plugin:install https://github.com/dokku/dokku-mongo.git mongo
```
Create your mongo service:
```
dokku mongo:create <productionDB>
dokku mongo:expose <productionDB>
dokku mongo:info <productionDB>
```
You should get a result looking like:
```
Container Information
       Config dir:          /var/lib/dokku/services/mongo/iot-platform/config
       Data dir:            /var/lib/dokku/services/mongo/iot-platform/data
       Dsn:                 mongodb://<productionDB>:<TOKEN>@dokku-mongo-<productionDB>:27017/<productionDB>
       Exposed ports:       27017->19960 27018->2848 27019->1609 28017->23749 
       Id:                  <ID>
       Internal ip:         172.17.0.5               
       Links:               -                        
       Service root:        /var/lib/dokku/services/mongo/<productionDB>
       Status:              running                  
       Version:             mongo:3.2.9    
```

Visit [https://github.com/dokku/dokku-mongo](https://github.com/dokku/dokku-mongo) for more info.


- Set the environment variables:

On your remote server:
```
dokku config:set <your-app-name> MONGO_URL="mongodb://<productionDB>:<TOKEN>@<your-domain>:19960/<your-app-name>"
```
You can do the same with your "GOOGLE_KEY".

- Use Letsencrypt to automatically install TLS certificates for HTTPS:


```
# dokku 0.5+
$ sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git

dokku config:set --no-restart myapp DOKKU_LETSENCRYPT_EMAIL=<your@email.tld>
dokku letsencrypt <your-app-name>

```
Dokku's default nginx template will automatically redirect HTTP requests to HTTPS when a certificate is present.
Visit [https://github.com/dokku/dokku-letsencrypt](https://github.com/dokku/dokku-letsencrypt) for more info.

## Users

After an installation the following users are created by the server/boot/02-load-users.js script:

- **Admin user**: Email: ```admin@admin.com```, password: ```admin```
- **Regular user**: Email: ```user@user.com```:, password ```user```

Please note, at this moment there is no difference in permissions for admin users or regular users. Feel free to submit a pull request!

