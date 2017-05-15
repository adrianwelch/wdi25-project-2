# GA WDI London, Project 2, March 2017

# DiveBook


![alt text][logo]

[logo]: http://i.imgur.com/M3hpiO5.png

DiveBook is a full stack web app built using Node.js/Express. The app allows scuba divers to add diving sites they have been to around the world and review them. Users are able to add information to each dive such as rating, review and images.


Google autoplaces API has been used to grab the location of the user's dive site and add a marker to the Google map on the index page.

The app uses two models, Users and Dives. Comments, is embedded within the Dives model. The app is fully RESTful and performs all of the CRUD actions. AWS is used to allow users to add images to their dives. Users can log in with Facebook or GitHub as OAuth is added to this app.

**Installation**

In order to install all additional packages required for app, run npm -i from the terminal.

To run the app on a local host run gulp in the terminal and the application will launch on localhost: 3000.

**Technologies Used**

* The app is built in Node JS with Express.
* Mongo database was used to store the data, with mongoose used to create models within express.
* AWS is used to allow users to upload images.
* Google autocomplete and maps API are used. The dive site location is added to a map using markers everytime a user creates a new dive.
* Bootstrap is used as the css framework and styles were written in Sass with Gulp as the taskrunner.
* OAuth is added using Facebook and Github

[DiveBook](https://quiet-taiga-63855.herokuapp.com)
is deployed on Heroku.

**Challenges**

Time was the main challenge for this project. I had a week to build this app from scratch. This was my first project using external APIs which I thoroughly enjoyed but was time consuming working out how to integrate autocomplete with my map on the index and dive show page. I had one day to style my project. Had I had more time I would have liked to make it look less minimalistic.