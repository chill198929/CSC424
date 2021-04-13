Prior to development, install the following packages:

    npm install --save-dev react-router-dom @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader style-loader sass-loader sass webpack webpack-cli electron-reloader

    npm i electron express mysql socket.io dotenv

Environmental variables are stored in the root directory in a file called ".env". This file is not shared in the repo and must be created locally and uses the following format: (no commas, quotes, parenthesis, or other special characters are necessary)

    DB_HOST=1.1.1.1
    DB_PORT=1000
    DB_USER=username
    DB_PASS=password
    DB_TABLE=table

To begin development and see your code realtime do the following:

    First run in one terminal: 
        npm run watch
    Then launch the application in a new Terminal using:
        npm start

To create a new component (new feature for example: board, chat, team and all subfeatures such as the cards that will be on a lane) create a new .js file.

In said .js file, make a new class for the component using the folwoing syntax.

    export default class {class_Name} extends React.Component{
        render(){
            return();
        }
    }

You then have to import the file in the "Parent" (board is imported into main), and call the class in the parent code.
