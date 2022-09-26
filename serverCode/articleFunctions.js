const connectionPool = require("./serverCode/dbConnection");

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
        postArticles(newArticle.title, newArticle.userId).then ( result => {
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
        putArticles(pathEnd, newArticle.title).then ( result => {
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
//////////////////////////ARTICLES//////////////////////////////////
/* Returns a promise to get Articles. */
async function getArticles(articleId = null){
    //Build query
    let sql = "SELECT * FROM article";

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


async function postArticles(title, userId){
    //Build date string for database input
    let nowDateString = getDateString();


    //Build query
    let sql = "INSERT INTO article " + 
    "(articleTitle, articleCreatedDate, personId)" + 
    " VALUES ('"+title+"', '"+nowDateString+"',"+userId+")";

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

async function putArticles(id, title){
    //Build query
    let sql = "UPDATE article " + 
    "SET articleTitle = '" + title + "' " +
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

module.exports = handleGetArticlesRequest;
module.exports = handlePostArticlesRequest;
module.exports = handlePutArticlesRequest;
module.exports = getArticles;
module.exports = postArticles;
module.exports = putArticles;