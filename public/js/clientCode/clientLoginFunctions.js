/* Loads current users and adds them to the page. */
function isUserLoggedIn() {
    return new Promise((resolve, reject) => {
        //create path string for users request
        let pathString = "/login";
        var userType = 0;
        //Set up XMLHttpRequest
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {//Called when data returns from server
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //Convert JSON to a JavaScript object
                let results = JSON.parse(xhttp.responseText);
                //Return not logged in if response 
                if(results.login){
                    userType = results.loginLevel;
                }
                //Otherwise has result, logged in with X user type
                resolve(userType);
            }
            };

            //Request data from all users
            xhttp.open("GET", pathString, true);
            xhttp.send();
        });
}

function loginUser(){
    //create path string for login request
    let pathString = "/login";


    //Extract user data
    let userEmail = document.getElementById("userEmail").value;
    let userPass = document.getElementById("userPass").value;
    
    //Creation of the object to send
    let postObject = {
        email: userEmail,
        pass: userPass
    };

    //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //Convert JSON to a JavaScript object
            let results = JSON.parse(xhttp.responseText);
            
            //Check if login successful then close popup
            isUserLoggedIn().then( res => {
                if(res != 0){
                    //Reload the navigation bar
                    console.log("Reloading navigation after login");
                    setTimeout(loadNav, 2000);
                    feedback("Login successful");
                    for(let key in results){
                        console.log(results[key].personFullName);
                    }
                    console.log(results[0].personFullName);
                    console.log(results.personFullName);
                    console.log(results[0].login);
                    console.log(results);
                    document.cookie = results.personFullName;
                    centerPopupDiv.style.display = "none";
                }
            });
        }else{
            feedback("An error occurred - try again");
        }
    };

    //Request data from all users
    xhttp.open("POST", pathString, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(postObject));

}

function logout(){
    //create path string for login request
    let pathString = "/logout";

   //Set up XMLHttpRequest
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {//Called when data returns from server
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            feedback("Logged out successfully");
            document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        }else{
            feedback("An error occurred - try again");
        }
    };

    //Request data from all users
    xhttp.open("POST", pathString, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();

    //Reload the navigation bar
    loadNav();
}