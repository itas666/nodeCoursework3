/* Loads all, or a specific, article and adds them to the page. */
function loadArticles(articleId = null) {
    //create path string for users request
    let pathString = "/articles";
    let dateHelper = "";
    if (articleId != null){
        pathString = pathString + "/" + articleId;
    }
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("Results back from article retrieve call " + pathString);
            //Convert JSON to a JavaScript object
            let results = JSON.parse(xhttp.responseText);
            //Build string with user data
            let htmlStr = "";
            homeDiv.innerHTML = htmlStr;
            
            //Return if no users
            if(results.length === 0){
                console.log("No results received");
                return;
            }

            for(let key in results){
                textToShow = results[key].articleShortText;
                if(articleId != null){
                    textToShow = results[key].articleLongText;
                }
                console.log("loop iteration "+ key)
                dateHelper = results[key].articleCreatedDate.substring(0,10) + " " + results[key].articleCreatedDate.substring(11,19);
                htmlStr += ("<div class='mainArticleBody'>");
                htmlStr += ("<div class='articleHeader' onClick='loadArticles("+results[key].articleId+")'> <h1>" + results[key].articleTitle + "</h1> </div>");
                htmlStr += ("<div class='articleAuthor'>");
                htmlStr += ("<div class='authorMain'>");
                htmlStr += ("<div class='authorPicture'> <img src='./img/123.jpg'/> </div>");
                htmlStr += ("<div class='postStats'>");
                htmlStr += ("<h4 class='authorName'>"+results[key].personFullName+"</h4>");
                htmlStr += ("<h4 class='postDate'>"+dateHelper+"</h4>");
                htmlStr += ("</div>"); // Closes postStats
                htmlStr += ("</div>"); // Closes authorMain
                htmlStr += ("<div class='authorLinks'>" + "Youtube, linkedin, facebook, twitter, instagram" + "</div>");
                htmlStr += ("</div>"); // Closes articleAuthor
                htmlStr += ("<div class='articleBody'>" + results[key].articleShortText + "</div>");
                htmlStr += ("</div>"); // Closes mainArticleBody
                htmlStr += ("<div class='articleComments' id='articleComments'></div>");
            }
            //Add info to page
            homeDiv.innerHTML = htmlStr;

            if (articleId != null){
                console.log("articleID not null")
                setTimeout(loadCommentsForArticle, 1000, articleId);
            }
        };
    }
        //Request data from all users
        xhttp.open("GET", pathString, true);
        xhttp.send();
}



function listManageArticles(articleId = null){
    //create path string for users request
    let pathString = "/articles";
    if(articleId != null) pathString += "/" + articleId;

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log("Loading articles management table " + articleId);
            //Convert JSON to a JavaScript object
            let results = JSON.parse(xhttp.responseText);
            //Build string with user data
            let htmlStr = "";
            
            //Return if no users
            if(results.length === 0)
                return;

            htmlStr += ("<table>");
            htmlStr += ("<tr>");
            htmlStr += ("<td>ID</td>");
            htmlStr += ("<td>Title</td>");
            htmlStr += ("<td>Short Text</td>");
            htmlStr += ("<td>Full Text</td>");
            htmlStr += ("<td>Actions</td>");
            htmlStr += ("</tr>");
            //If path is for one article in manage, means we are editing
            // load single record with the same loop (will run once) with 
            if (articleId != null){
                for(let key in results){
                    htmlStr += ("<tr>");
                    htmlStr += ("<td>" + results[key].articleId + "</td>");
                    htmlStr += ("<td><input type='text' id='editArticleTitle' value='" + results[key].articleTitle + "'></td>");
                    htmlStr += ("<td><input type='text' id='editArticleShortText' value='" + results[key].articleShortText + "'></td>");
                    htmlStr += ("<td><input type='text' id='editArticleLongText' value='" + results[key].articleLongText + "'></td>");
                    htmlStr += ("<td> <input type='button' value='Edit' onClick='postArticle("+results[key].articleId+")'><br>");
                    htmlStr += ("<input type='button' value='Delete' onClick='deleteArticle(" + results[key].articleId + ")'></td>");
                    htmlStr += ("</tr>");
                }
                pathString = "/articles/" + articleId;
            } else{
                for(let key in results){
                    console.log(key);
                    console.log(results);
                    htmlStr += ("<tr>");
                    htmlStr += ("<td> " + results[key].articleId + "</td>");
                    htmlStr += ("<td> " + results[key].articleTitle + "</td>");
                    htmlStr += ("<td> " + results[key].articleShortText + "</td>");
                    htmlStr += ("<td> " + results[key].articleLongText + "</td>");
                    htmlStr += ("<td> <input type='button' value='Edit' onClick='listManageArticles("+results[key].articleId+")'><br>");
                    htmlStr += ("<input type='button' value='Delete' onClick='deleteArticle(" + results[key].articleId + ")'></td>");
                    htmlStr += ("</tr>");
                }
                htmlStr += ("<tr>");
                htmlStr += ("<td> - </td>");
                htmlStr += ("<td><input type='text' id='newArticleTitle'></td>");
                htmlStr += ("<td><input type='text' id='newArticleShortText'></td>");
                htmlStr += ("<td><input type='text' id='newArticleLongText'></td>");
                htmlStr += ("<td> <input type='button' value='Add' onClick='postArticle()'></td>");
                htmlStr += ("</tr>");
            }
            htmlStr += ("</table>");
            //Add info to page.
            homeDiv.innerHTML = htmlStr;
        }
    };
 

    //Request data from all users
    xhttp.open("GET", pathString, true);
    xhttp.send();
}


function postArticle(articleId = null){
    //create path string for users request and grab data depending on new or edit
    console.log("Sending create article call");
    if (articleId != null){
        //Afterthought, post can handle creation and update, but project is almost done
        callType = "put";
        console.log("Updating article " + articleId);
        pathString = "/articles/" + articleId;
        articleTitle = document.getElementById("editArticleTitle").value;
        articleShortText = document.getElementById("editArticleShortText").value;
        articleLongText = document.getElementById("editArticleLongText").value;
    }else{    
        callType = "POST";
        pathString = "/articles";
        articleTitle = document.getElementById("newArticleTitle").value;
        articleShortText = document.getElementById("newArticleShortText").value;
        articleLongText = document.getElementById("newArticleLongText").value;
    }
    
    //Creation of the object to send
    let postObject = {
        articleTitle: articleTitle,
        articleShortText: articleShortText,
        articleLongText: articleLongText
    };
    console.log("Data to be sent: " + JSON.stringify(postObject));

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            feedback("Article added successfully");
            //Build string with user data
        }else{
            feedback("An Issue occurred during article addition");
        }
    };


    //Request data from all users
    xhttp.open(callType, pathString, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(postObject));

    listManageArticles();
}



function deleteArticle(articleId){
    //create path string for users request
    let pathString = "/articles/" + articleId;
    console.log("Sending to path " + pathString);
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            let results = JSON.parse(xhttp.responseText);
            
            feedback("Article deleted successfully")
            listManageArticles();
        }
    };
 
    //Request data from all users
    xhttp.open("DELETE", pathString, true);
    xhttp.send();
}