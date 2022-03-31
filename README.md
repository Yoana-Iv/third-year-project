# third-year-project

For the project to run, npm and Node.js must be installed on the machine. An installation guide can be found here 
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm.

## Warning

You might need to install some additional dependencies like Material UI. The full list of dependecies can be found in package.json >> "dependencies".

## Running the project

### For Windows machines:

From inside the Project folder, run `npm run start-api` followed by `npm start` in different console windows.\
This will run the application in development mode. To view it, open [http://localhost:3000] (http://localhost:3000) in a browser.

### For other operating systems:

Same steps as above, but, instead of running `npm run start-api`, use the command `cd project-api && venv\\Scripts\\flask run --no-debugger`, replacing `cd project-api` and `venv\\Scripts\\flask` with the equivalents to the same paths in the machine's OS.

## Running tests

To run the python tests, use the command `python -m pytest` from inside the project-api folder.