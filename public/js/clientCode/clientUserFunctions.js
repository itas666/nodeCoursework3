function showManageUsers(userId = null){
    //create path string for users request
    let pathString = "/users";
    if(userId != null) pathString += "/" + userId;
    dateHelper = "";
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
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
            htmlStr += ("<td>Full name</td>");
            htmlStr += ("<td>Email</td>");
            htmlStr += ("<td>Password</td>");
            htmlStr += ("<td>Created timestamp</td>");
            htmlStr += ("<td>User Type</td>");
            htmlStr += ("<td>Actions</td>");
            htmlStr += ("</tr>");
            //If path is for one user in manage, means we are editing
            // load single record with the same loop (will run once) with 
            if (userId != null){
                for(let key in results){
                    dateHelper = results[key].personCreatedDate.substring(0,10) + " " + results[key].personCreatedDate.substring(11,19);
                    htmlStr += ("<tr>");
                    htmlStr += ("<td>" + results[key].personId + "</td>");
                    htmlStr += ("<td><input type='text' id='editUserFullName' value='" + results[key].personFullName + "'></td>");
                    htmlStr += ("<td><input type='text' id='editUserEmail' value='" + results[key].personEmail + "'></td>");
                    htmlStr += ("<td><input type='text' id='editUserPassword' value='" + results[key].personPassword + "'></td>");
                    htmlStr += ("<td> " + dateHelper + "</td>");
                    htmlStr += ("<td><select id='editUserType><option value='1'>1</option><option value='2'></option></td>");
                    htmlStr += ("<td> <input type='button' value='Edit' onClick='postUser("+results[key].personId+")'><br>");
                    htmlStr += ("<input type='button' value='Delete' onClick='deleteUser(" + results[key].personId + ")'></td>");
                    htmlStr += ("</tr>");
                }
                pathString = "users/" + userId;
            } else{
                for(let key in results){
                    dateHelper = results[key].personCreatedDate.substring(0,10) + " " + results[key].personCreatedDate.substring(11,19);
                    htmlStr += ("<tr>");
                    htmlStr += ("<td>" + results[key].personId + "</td>");
                    htmlStr += ("<td>" + results[key].personFullName + "</td>");
                    htmlStr += ("<td>" + results[key].personEmail + "</td>");
                    htmlStr += ("<td>" + results[key].personPassword + "</td>");
                    htmlStr += ("<td>" + dateHelper + "</td>");
                    htmlStr += ("<td>" + results[key].description + "</td>");
                    htmlStr += ("<td> <input type='button' value='Edit' onClick='showManageUsers("+results[key].personId+")'><br>");
                    htmlStr += ("<input type='button' value='Delete' onClick='deleteUser(" + results[key].personId + ")'></td>");
                    htmlStr += ("</tr>");
                }
                htmlStr += ("<tr>");
                htmlStr += ("<td> - </td>");
                htmlStr += ("<td><input type='text' id='newUserFullName'></td>");
                htmlStr += ("<td><input type='text' id='newUserEmail'></td>");
                htmlStr += ("<td><input type='text' id='newUserPassword'></td>");
                htmlStr += ("<td> - </td>");
                htmlStr += ("<td><select id='newUserType'><option value='1'>Guest</option><option value='2'>Admin</option></select></td>");
                htmlStr += ("<td> <input type='button' value='Add' onClick='postUser()'></td>");
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


function postUser(userId = null){
    //create path string for users request and grab data depending on new or edit
    console.log("Sending create user call");
    if (userId != null){
        //Afterthought, post can handle creation and update, but project is almost done
        callType = "put";
        console.log("Updating user " + userId);
        pathString = "/users/" + userId;
        userFullName = document.getElementById("editUserFullName").value;
        userEmail = document.getElementById("editUserEmail").value;
        userPassword = document.getElementById("editUserPassword").value;
        userType = document.getElementById("editUserType").value;
    }else{    
        callType = "POST";
        pathString = "/users";
        userFullName = document.getElementById("newUserFullName").value;
        userEmail = document.getElementById("newUserEmail").value;
        userPassword = document.getElementById("newUserPassword").value;
        userType = document.getElementById("newUserType").value;
    }
    
    //Creation of the object to send
    let postObject = {
        userFullName: userFullName,
        userEmail: userEmail,
        userPassword: userPassword,
        userTypeId: userType
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
    xhttp.open(callType, pathString, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(postObject));

    showManageUsers();
}

function registerUser(){
    //create path string for users request and grab data depending on new or edit
    console.log("Sending create user call");
    callType = "POST";
    pathString = "/users";
    userFullName = document.getElementById("newUserFullName").value;
    userEmail = document.getElementById("newUserEmail").value;
    userPassword = document.getElementById("newUserPassword").value;
    userType = document.getElementById("newUserType").value;
    
    //Creation of the object to send
    let postObject = {
        userFullName: userFullName,
        userEmail: userEmail,
        userPassword: userPassword,
        userTypeId: userType
    };
    console.log("Data to be sent: " + JSON.stringify(postObject));

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            feedback("Registered successfully");
            //Build string with user data
            centerPopupDiv.style.display = 'none';
        }else{
            feedback("An Issue occurred during user addition");
        }
    };


    //Request data from all users
    xhttp.open(callType, pathString, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(postObject));
    centerPopupDiv.style.display = 'none';
    init();
}

function deleteUser(userId){
    //create path string for users request
    let pathString = "/users/" + userId;
    console.log("Sending to path " + pathString);
    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            let results = JSON.parse(xhttp.responseText);
            
            feedback("user deleted successfully")
            showManageUsers();
        }
    };
 
    //Request data from all users
    xhttp.open("DELETE", pathString, true);
    xhttp.send();
}