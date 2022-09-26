function loadCommentsForArticle(articleId){
    let xhttp = new XMLHttpRequest();
    let dateHelper = "";
    let commentsDiv = document.getElementById("articleComments");
    pathString = "/articles/"+articleId+"/comments"
    let commentHTMLStr = "";
    commentsDiv.innerHTML = commentHTMLStr;
    if(articleId != null){
        xhttp.onreadystatechange = () => {//Called when data returns from server
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                console.log("Loading comments for article " + articleId);
                console.log("Pathstring" + pathString);
                //Convert JSON to a JavaScript object
                let results = JSON.parse(xhttp.responseText);
                
                //Return if no users
                if(results.length === 0)
                    return;

                for(let key in results){
                    dateHelper = results[key].createdDate.substring(0,10) + " " + results[key].createdDate.substring(11,19);

                    commentHTMLStr += ("<input type='hidden' id='articleId' value='" + results[key].articleId + "'>");
                    commentHTMLStr += ("<div class='commentAuthor'>");
                    commentHTMLStr += ("<div class='commentAuthorMain'>");
                    commentHTMLStr += ("<div class='commentAuthorPicture'>");
                    commentHTMLStr += ("<img src='./img/123.jpg'/>");
                    commentHTMLStr += ("</div>");
                    commentHTMLStr += ("<div class='commentStats'>");
                    commentHTMLStr += ("<h4 class='authorName'>"+ results[key].personFullName + "</h4>");
                    commentHTMLStr += ("<h4 class='postDate'>"+dateHelper+"</h4>");
                    commentHTMLStr += ("</div>");
                    commentHTMLStr += ("</div>");
                    commentHTMLStr += ("</div>");
                    commentHTMLStr += ("<div class='commentBody'>");
                    commentHTMLStr += (results[key].commentText);
                    commentHTMLStr += ("</div>");
                }
                if(isUserLoggedIn() != 0){
                    commentHTMLStr += ("<div class='articleComments'>");
                    commentHTMLStr += ("<div class='commentBody'>");
                    commentHTMLStr += ("<input type='textBox' id='newArticleComment' value='new comment'>");
                    commentHTMLStr += ("<input type='submit' onClick='postComment()' value='new comment'>");
                    commentHTMLStr += ("</div>");
                    commentHTMLStr += ("</div>");
                }
                //Add info to page
                commentsDiv.innerHTML = commentHTMLStr;
            }
        };
    //Request data from all users
    xhttp.open("GET", pathString, true);
    xhttp.send();
    }
}

function postComment(){
    //create path string for users request and grab data depending on new or edit
    console.log("Sending create comment call");
    
    articleId = document.getElementById("articleId").value;
    commentText = document.getElementById("newArticleComment").value;
    userId = "1";
    pathString = "/articles/" + articleId + "/comments";
    console.log("pathstring " + pathString);
    
    //Creation of the object to send
    let postObject = {
        articleId: articleId,
        userId: userId,
        text: commentText
    };
    console.log("Data to be sent: " + JSON.stringify(postObject));

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            feedback("user added successfully");
            //Build string with user data
        }else{
            feedback("An Issue occurred during user addition");
        }
    };


    //Request data from all users
    xhttp.open("POST", pathString, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(postObject));

    loadCommentsForArticle(articleId);
}