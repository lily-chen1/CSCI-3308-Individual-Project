# CSCI-3308-Individual-Project

https://lilys-individual-project.herokuapp.com/

# How to run locally

In order to run the application locally you first need to run

`npm install`

To install the node modules.

Also, you need to run a postgres database instance on your computer using 

`psql -U postgres`

and then create a .env file in the root directory that contains your database credentials. An example .env file has been provided. 

Then you can run

`npm start`

To run the application (as long as you have a running postgres database instance linked in server.js)

Also you can run the test suite by running

`npm run test`
