/*
Database creation SQL
CREATE TABLE person (
    personId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    personFullName varchar(255) NOT NULL,
    personPassword varchar(255) NOT NULL,
    personEmail varchar(255) NOT NULL,
    personCreatedDate DATE NOT NULL,
    personTypeId int);
    
CREATE TABLE personType (
    personTypeId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    description text
);

CREATE TABLE article (
    articleId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    articleTitle varchar(255) NOT NULL,
    articleCreatedDate DATE NOT NULL,
    articleModifiedDate DATE,
    personId int
);

CREATE TABLE comment (
    personId int,
    articleId int,
    createdDate DATE,
    commentText text,
    PRIMARY KEY(personId, articleId, createdDate)
);

ALTER TABLE person
ADD CONSTRAINT FK_personType_person
FOREIGN KEY (personTypeId) REFERENCES personType(personTypeId);

ALTER TABLE article
ADD CONSTRAINT FK_person_article
FOREIGN KEY (personId) REFERENCES person(personId);

ALTER TABLE comment
ADD CONSTRAINT FK_person_comment
FOREIGN KEY (personId) REFERENCES person(personId);

ALTER TABLE comment
ADD CONSTRAINT FK_article_comment
FOREIGN KEY (articleId) REFERENCES article(articleId);
*/


//Import the express, body-parser and mysql modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const expressSession = require("express-session");
//const userFunctions = require('./serverCode/userFunctions');
//const articleFunctions = require('./serverCode/articleFunctions');
//const commentFunctions = require('./serverCode/commentFunctions');
//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "cw3WebUser",
    password: "cw3AdminUser!",
    database: "cw3",
    debug: false
});

//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());
app.use(expressSession({
    secret: "cw3Secret",
    cookie: {
        maxAge: 1000*60*60*4 //in miliseconds, so 4 hours
    },
    resave: false,
    saveUninitialized: true}
));

//Set up express to serve static files from the directory called 'public'
app.use(express.static('public'));

//Data structure that will be accessed using the web service
let userArray = [];
function getDateString(){
    //Using a piece of code repeatedly, turning into function to return current date string
    //taken from: https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
    //Attempts to do like native JS failed
    let nowDate = new Date;
    let nowDateString = nowDate.toISOString().replace('T', ' ').substr(0, 19)

    return nowDateString;
}
//////////////////////////ASYNC FUNCTIONS//////////////////////////////////
//////////////////////////USERS//////////////////////////////////
/* Returns a promise to get users. */
async function getUsers(userId = null, email = null, password = null){
    //Build query
    let sql = "SELECT p.*, pt.description FROM person p JOIN personType pt ON pt.personTypeId = p.personTypeId";

    if(userId != null){
        sql = sql + " WHERE personId = " + userId;
    }else if((email != null) && (password != null)){
        sql = sql + " WHERE personEmail LIKE '" + email + "' AND personPassword LIKE '" + password + "'";
    }

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function deleteUsers(pathEnd){
    //Build query
    let sql = "DELETE FROM person " + 
    "WHERE personId = " + pathEnd;

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function postUsers(name, pass, email, type){
    //Build date string for database input
    let nowDateString = getDateString();

    //Build query
    let sql = "INSERT INTO person " + 
    "(personFullName, personPassword, personEmail, personCreatedDate, personTypeId)" + 
    " VALUES ('"+name+"', '"+pass+"','"+email+"','"+nowDateString+"','"+type+"')";

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function putUsers(id, name, pass, email, type){
    //Build query
    let sql = "UPDATE person " + 
    "SET personFullName = '" + name + "'," +
    "personPassword = '" + pass + "', " + 
    "personEmail = '" + email + "', " +
    "personTypeId = " + type + " " + 
    "WHERE personId = " + id;

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}
//////////////////////////USERS END//////////////////////////////////
//////////////////////////LOGIN//////////////////////////////////
//////////////////////////LOGIN END//////////////////////////////////
//////////////////////////ARTICLES//////////////////////////////////
/* Returns a promise to get Articles. */
async function getArticles(articleId = null){
    //Build query
    let sql = "SELECT a.*, p.personFullName FROM article a JOIN person p ON p.personId = a.personId";

    if(articleId != null){
        sql = sql + " WHERE articleId = " + articleId;
    }

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function deleteArticles(pathEnd){
    //Build query
    let sql = "DELETE FROM article " + 
    "WHERE articleId = " + pathEnd;

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function postArticles(title, userId, shortText, longText){
    //Build date string for database input
    let nowDateString = getDateString();


    //Build query
    let sql = "INSERT INTO article " + 
    "(articleTitle, articleCreatedDate, personId, articleShortText, articleLongText)" + 
    " VALUES ('"+title+"', '"+nowDateString+"',"+userId+",'"+shortText+"','"+longText+"')";

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function putArticles(id, title, shortText, longText){
    //Build query
    let sql = "UPDATE article " + 
    "SET articleTitle = '" + title + "', " +
    "articleShortText = '" + shortText + "', " +
    "articleLongText = '" + longText + "' " +
    "WHERE articleId = " + id;

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}
//////////////////////////ARTICLES END//////////////////////////////////
//////////////////////////COMMENTS//////////////////////////////////
/* Returns a promise to get Articles. */
async function getComments(articleId = null){
    //Build query
    let sql = "SELECT c.*, p.personFullName FROM comment c JOIN person p ON p.personId = c.personId";

    //articleId never expected to be null, but there for test purposes
    if(articleId != null){
        sql = sql + " WHERE articleId = " + articleId ;
    }
    sql +=  " ORDER BY createdDate";
    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}


async function postComments(text, userId, articleId){
    //Build date string for database input
    let nowDateString = getDateString();


    //Build query
    let sql = "INSERT INTO comment " + 
    "(personId, articleId, createdDate, commentText)" + 
    " VALUES ("+userId+", "+articleId+",'"+nowDateString+"','"+text+"')";

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}

async function putComments(userId, articleId, createdDate, text){
    //Build date string for database input
    let nowDateString = getDateString();

    //Build query
    let sql = "UPDATE comment " + 
    "SET commentText = '" + text + "' " +
    "WHERE articleId = " + articleId + " AND personId = " + userId + " AND createdDate = '" + createdDate + "'";

    //Log the query to be checked in console
    console.log("Query: " + sql);
    //Wrap the execution of the query in a promise
    return new Promise ( (resolve, reject) => { 
        connectionPool.query(sql, (err, result) => {
            if (err){//Check for errors
                reject("Error executing query: " + JSON.stringify(err));
            }
            else{//Resolve promise with results
                resolve(result);
            }
        });
    });
}
//////////////////////////COMMENTS END//////////////////////////////////
//////////////////////////ASYNC FUNCTIONS END//////////////////////////////////
//////////////////////////USERS LISTENERS//////////////////////////////////
//Set up application to handle GET requests sent to the user path
app.get('/users/*', handleGetUsersRequest);//Returns user with specified ID
app.get('/users', handleGetUsersRequest);//Returns all users

//Set up application to handle POST requests sent to the user path
app.post('/users', handlePostUsersRequest);//Adds a new user

//Set up application to handle PUT requests sent to the user path with ID, for updates
app.put('/users/*', handlePutUsersRequest);//Updates an existing user
//Set up application to handle DELETE requests sent to the users path
app.delete('/users/*', handleDeleteUsersRequest);//Remove a user
//////////////////////////USERS LISTENERS END//////////////////////////////////
//////////////////////////LOGIN LISTENERS//////////////////////////////////
app.get('/login', handleGetLoginRequest);//Checks if user is logged in
app.post('/login', handlePostLoginRequest);//Logs in with data provided
app.post('/logout', handlePostLogoutRequest);//Logs out
//////////////////////////LOGIN LISTENERS END//////////////////////////////////
//////////////////////////COMMENT LISTENERS//////////////////////////////////
app.get('/articles/*/comments', handleGetCommentsRequest);//Returns comments for an article with specified ID

//Set up application to handle POST requests sent to the articles path
app.post('/articles/*/comments', handlePostCommentsRequest);//Adds a new comments to article

//Set up application to handle PUT requests sent to the articles path with ID, for updates
app.put('/articles/*/comments', handlePutCommentsRequest);//Updates an existing comment in article
//////////////////////////COMMENT LISTENERS END//////////////////////////////////
//////////////////////////ARTICLE LISTENERS//////////////////////////////////
app.get('/articles/*', handleGetArticlesRequest);//Returns articles with specified ID
app.get('/articles', handleGetArticlesRequest);//Returns all articles

//Set up application to handle POST requests sent to the articles path
app.post('/articles', handlePostArticlesRequest);//Adds a new articles
//Set up application to handle DELETE requests sent to the articles path
app.delete('/articles/*', handleDeleteArticlesRequest);//Remove articles

//Set up application to handle PUT requests sent to the articles path with ID, for updates
app.put('/articles/*', handlePutArticlesRequest);//Updates an existing articles
//////////////////////////ARTICLE LISTENERS END//////////////////////////////////



//Start the app listening on port 8080
app.listen(8080);


//////////////////////////USERS HANDLERS//////////////////////////////////
//Handles GET requests to our web service users path
async function handleGetUsersRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //If path ends with 'users' we return all users
    if(pathEnd === 'users'){
        console.log("Path is users");
        //Execute promise
        getUsers().then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
        });
    }
    //If the last part of the path is a valid user id, a number,
    //return data, found or not, about that user
    else if(!isNaN(pathEnd)){
        //Execute promise
        getUsers(pathEnd).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
        });
    }
    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");

    //Log the end of the call
    console.log("Finishing users GET call")
}

//Handles POST requests to our web service users path
function handlePostUsersRequest(request, response){
    //Output the data sent to the server
    let newUser = request.body;
    console.log("Data received: " + JSON.stringify(newUser));
    
    
        //Execute promise
        postUsers(newUser.userFullName, newUser.userPassword, newUser.userEmail, newUser.userTypeId).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
            //Log the end of the call
            console.log("Finishing users POST call")
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            //Log the end of the call
            console.log("Finishing users POST call")
        });
}

//Handles PUT requests to our web service users path
function handlePutUsersRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //Output the data sent to the server
    let newUser = request.body;
    console.log("Data received: " + JSON.stringify(newUser));
    
    if(!isNaN(pathEnd)){
        //Execute promise
        putUsers(pathEnd, newUser.name, newUser.pass, newUser.email, newUser.type).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
            //Log the end of the call
            console.log("Finishing users PUT call")
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            //Log the end of the call
            console.log("Finishing users PUT call")
        });
    }
    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}

//Handles DELETE requests to our web service Users path
function handleDeleteUsersRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];
    
        //Execute promise
        deleteUsers(pathEnd).then ( result => {
            //Output user and send back.
            console.log("Deleted Users " + pathEnd);
            response.send(JSON.stringify(result));
            //Log the end of the call
            console.log("Finishing Users POST call")
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            console.log(err);
            //Log the end of the call
            console.log("Finishing Users POST call")
        });
}

//////////////////////////USERS HANDLERS END//////////////////////////////////
//////////////////////////LOGIN HANDLERS//////////////////////////////////
async function handleGetLoginRequest(request, response){
    //Check if the user is logged in via session variable
    if(!("userId" in request.session))
        response.send('{"login": false}');
    else{
        response.send('{"login":true, "username": "' +
            request.session.username + '", "loginLevel": ' + request.session.userType + ' }');
    }
}

async function handlePostLoginRequest(request, response){
    //Output the data sent to the server
    let loginData = request.body;
    console.log("Data received: " + JSON.stringify(loginData));
    let resp = '{"login": false, "feedback": "User not found in the database, check your login details"}';
    //Execute promise
    getUsers(null, loginData.email, loginData.pass).then ( result => {
        //Output user and send back.
        console.log("Stringifying resuts: " + JSON.stringify(result));
        //If length is different than 1, we have 0 or more than 1 result
        // which will be a bug - no more than 1 user with same email
        if(result.length === 1){
            resp = '{"login": true, "feedback": "Login successful, redirecting to home page", "personFullName": "' + result[0].personFullName + '"}';
            console.log("Setting session: " + result[0].personFullName + " And " + result[0].personId);
            request.session.username = result[0].personFullName;
            request.session.userId = result[0].personId;
            request.session.userType = result[0].personTypeId;
            console.log("Session data: " + request.session);
        }

        response.send(JSON.stringify(resp));
        //Log the end of the call
        console.log("Finishing users POST call")
    }).catch( err => {
        //Handle the error
        console.log(err);
        console.error(JSON.stringify(err));
        //Log the end of the call
        console.log("Finishing users POST call")
    });
}

async function handlePostLogoutRequest(request, response){
    //Destroy session.
    request.session.destroy( err => {
        if(err)
            response.send('{"error": '+ JSON.stringify(err) + '}');
        else
            response.send('{"login":false}');
    });
}
//////////////////////////LOGIN HANDLERS END//////////////////////////////////
//////////////////////////ARTICLES HANDLERS//////////////////////////////////
async function handleGetArticlesRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //If path ends with 'Articles' we return all Articles
    if(pathEnd === 'articles'){
        console.log("Path is Articles");
        //Execute promise
        getArticles().then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            console.log(err);
        });
    }
    //If the last part of the path is a valid user id, a number,
    //return data, found or not, about that user
    else if(!isNaN(pathEnd)){
        //Execute promise
        getArticles(pathEnd).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            console.log(err);
        });
    }
    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");

    //Log the end of the call
    console.log("Finishing Articles GET call")
}

//Handles POST requests to our web service Articles path
function handlePostArticlesRequest(request, response){
    //Output the data sent to the server
    let newArticle = request.body;
    console.log("Data received: " + JSON.stringify(newArticle));
    
    
        //Execute promise
        postArticles(newArticle.articleTitle, request.session.userId, newArticle.articleShortText, newArticle.articleLongText).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
            //Log the end of the call
            console.log("Finishing Articles POST call")
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            console.log(err);
            //Log the end of the call
            console.log("Finishing Articles POST call")
        });
}


//Handles DELETE requests to our web service Articles path
function handleDeleteArticlesRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];
    
        //Execute promise
        deleteArticles(pathEnd).then ( result => {
            //Output user and send back.
            console.log("Deleted article " + pathEnd);
            response.send(JSON.stringify(result));
            //Log the end of the call
            console.log("Finishing Articles POST call")
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            console.log(err);
            //Log the end of the call
            console.log("Finishing Articles POST call")
        });
}

//Handles PUT requests to our web service Articles path
function handlePutArticlesRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //Output the data sent to the server
    let newArticle = request.body;
    console.log("Data received: " + JSON.stringify(newArticle));
    
    if(!isNaN(pathEnd)){
        //Execute promise
        putArticles(pathEnd, newArticle.articleTitle, newArticle.articleShortText,newArticle.articleLongText).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
            //Log the end of the call
            console.log("Finishing Articles PUT call")
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            //Log the end of the call
            console.log("Finishing Articles PUT call")
            console.log(err);
        });
    }
    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}
//////////////////////////ARTICLES HANDLERS END//////////////////////////////////
//////////////////////////COMMENT HANDLERS//////////////////////////////////
async function handleGetCommentsRequest(request, response){
    //Only articles/X/comments expected, user part of body
    //No checks for path needed; article already part of the path
    var pathArray = request.url.split("/");
    console.log("Value of PathArticle: " + pathArticle);

    //Get the last part of the path
    var pathArticle = pathArray[pathArray.length - 2];
    console.log("Value of PathArray: " + pathArray);

    //If the last part of the path is a valid user id, a number,
    //return data, found or not, about that user
    if(!isNaN(pathArticle)){
        //Execute promise
        getComments(pathArticle).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            console.log(err);
        });
    }
    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");

    //Log the end of the call
    console.log("Finishing Comments GET call")
}

//Handles POST requests to our web service Articles path
function handlePostCommentsRequest(request, response){
    //Only articles/X/comments expected, user part of body
    //No checks for path needed; article already part of the path
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathArticle = pathArray[pathArray.length - 2];
    console.log("Value of pathArticle: " + pathArticle)

    //Output the data sent to the server
    let newComment = request.body;
    console.log("Data received: " + JSON.stringify(newComment));
    
    
        //Execute promise
        postComments(newComment.text, newComment.userId, pathArticle).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
            //Log the end of the call
            console.log("Finishing Articles POST call")
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            console.log(err);
            //Log the end of the call
            console.log("Finishing Articles POST call")
        });
}

//Handles PUT requests to our web service articles/comments path
function handlePutCommentsRequest(request, response){
    //Only articles/X/comments expected, user part of body
    //No checks for path needed; article already part of the path
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathArticle = pathArray[pathArray.length - 2];
    console.log("Value of pathArticle: " + pathArticle)

    //Output the data sent to the server
    let newComment = request.body;
    console.log("Data received: " + JSON.stringify(newComment));
    
    if(!isNaN(pathArticle)){
        //Execute promise
        putComments(newComment.userId, pathArticle, newComment.createdDate, newComment.text).then ( result => {
            //Output user and send back.
            console.log(JSON.stringify(result));
            response.send(JSON.stringify(result));
            //Log the end of the call
            console.log("Finishing Articles PUT call")
        }).catch( err => {
            //Handle the error
            console.error(JSON.stringify(err));
            //Log the end of the call
            console.log("Finishing Articles PUT call")
            console.log(err);
        });
    }
    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}
//////////////////////////COMMENT HANDLERS END//////////////////////////////////