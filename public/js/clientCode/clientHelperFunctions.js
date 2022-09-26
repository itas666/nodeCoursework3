let timeoutVar = setTimeout(console.log, 1, "Setting timeout variable");

function loadFooter(){
    let footerHTML = '<div onClick="showDisclaimer()">Disclaimer</div>' +
    '<div onclick="showAbout()">About this site</div>' + 
    '<div onClick="showNodeJs()">node.js</div>' + 
    '<div onClick="showW3Schools()">w3schools</div>';

    footerDiv.innerHTML = footerHTML;
}

// Many attempts to make this return just the HTML, but all I could do is return promise
// or incorrect async behavior - changing innerHTML inside this function solved my 2 big issues
function loadNav(){
    let navHTML = "";
    let userType = 0;
    var promise = isUserLoggedIn();
    //Execute promise
    promise.then( res => {
        //Save the promise result and change CSS of elements in line to show or hide
        userType = res;

        navHTML = '<ul style="display: inline; margin-right: 25px;">' + 
        '<li style="display: inline; margin-left: 20px; font-size: 18px;" onClick="init()">Home</li>' + 
        '<li style="display: inline; margin-left: 20px; font-size: 18px;">About me</li>' + 
        '<li style="display: inline; margin-left: 20px; font-size: 18px;">Online CV</li>' + 
        '<li style="display: inline; margin-left: 20px; font-size: 18px;">Online Repo</li>';

        //Build links according to permissions
        switch(userType){
            case 0:
                navHTML = navHTML + '<li id="loginLink" style="display: inline; margin-left: 20px; font-size: 18px;" onClick="registerUserForm()">Register/Login</li>';
                break;
            case 1:
                navHTML = navHTML + '<li id="logoutLink" style="display: inline; margin-left: 20px; font-size: 18px;" onClick="logout()">Logout</li></ul>';
                break;
            case 2:
                navHTML = navHTML + '<li id="manArtLink" style="display: inline; margin-left: 20px; font-size: 18px;" onClick="showManageArticles()">Manage Articles</li>' + 
                '<li id="manUsLink" style="display: inline; margin-left: 20px; font-size: 18px;" onClick="showManageUsers()">Manage Users</li>' + 
                '<li id="manComLink" style="display: inline; margin-left: 20px; font-size: 18px;">Manage Comments</li>' + 
                '<li id="logoutLink" style="display: inline; margin-left: 20px; font-size: 18px;" onClick="logout()">Logout</li></ul>';
        }
        navDiv.innerHTML = navHTML;
    });
}


function createRegisterForm(){
    htmlText = "<h1>Register</h1>" + 
    "<label for='newUerEmail'>Email</label> <input type='text' id='newUserEmail'></input><br>" +
    "<label for='newUserPass'>Password</label> <input type='text' id='newUserPassword'></input><br>" +
    "<label for='newUserFullName'>Full Name</label><input type='text' id='newUserFullName'></input><br>" +
    "<input type='hidden' id='newUserType' value='1'>" + 
    "<input type='button' onClick='registerUser()' value='Register' onClick='addUser()'><br>" + 
    "Or <p onClick='createLoginForm()'>click here</p> to log in";

    manageDiv.innerHTML = htmlText;
}


function createLoginForm(){
    htmlText = "<h1>Log in</h1>" + 
    "<label for='userEmail'>Email</label> <input type='text' id='userEmail'></input><br>" +
    "<label for='userPass'>Password</label> <input type='text' id='userPass'></input><br>" +
    "<input type='button' onClick='loginUser()' value='Log in' onClick='addUser()'><br>" + 
    "Or <p onClick='createRegisterForm()'>click here</p> to register";

    manageDiv.innerHTML = htmlText;
}

function registerUserForm(){
    centerPopupDiv.style.display = "block";
    createRegisterForm();
}

function showManageArticles(){
    listManageArticles();
}

function feedback(text){
    clearTimeout(timeoutVar);
    feedbackPopupOpen();
    feedbackDiv.innerHTML = text;
    timeoutVar = setTimeout(feedbackPopupClose, 8000);
}