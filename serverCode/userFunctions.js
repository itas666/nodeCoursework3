const connectionPool = require("./serverCode/dbConnection");

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
        postUsers(newUser.name, newUser.pass, newUser.email, newUser.type).then ( result => {
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
//////////////////////////USERS HANDLERS END//////////////////////////////////
//////////////////////////USERS//////////////////////////////////
/* Returns a promise to get users. */
async function getUsers(userId = null){
    //Build query
    let sql = "SELECT * FROM person";

    if(userId != null){
        sql = sql + " WHERE personId = " + userId;
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
module.exports.handleGetUsersRequest = handleGetUsersRequest;
module.exports.handlePostUsersRequest = handlePostUsersRequest;
module.exports.handlePutUsersRequest = handlePutUsersRequest;
module.exports = getUsers;
module.exports = postUsers;
module.exports = putUsers;
