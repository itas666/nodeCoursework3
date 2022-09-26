const connectionPool = require("./serverCode/dbConnection");

//////////////////////////COMMENTS//////////////////////////////////
/* Returns a promise to get Articles. */
async function getComments(articleId = null){
    //Build query
    let sql = "SELECT * FROM comment";

    //articleId never expected to be null, but there for test purposes
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

module.exports.handleGetCommentsRequest = handleGetCommentsRequest;
module.exports.handlePostCommentsRequest = handlePostCommentsRequest;
module.exports.handlePutCommentsRequest = handlePutCommentsRequest;
module.exports.getComments = getComments;
module.exports.postComments = postComments;
module.exports.putComments = putComments;