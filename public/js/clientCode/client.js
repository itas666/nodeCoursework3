//Points to a div element where website parts will be changed
let navDiv;
let footerDiv;
let homeDiv;
let aboutDiv;
let manageDiv;
let feedbackDiv;
let centerPopupDiv;

//Sliding feedback popup
//https://codepen.io/Web_Cifar/pen/qBEvGrZ?ref=morioh.com&utm_source=morioh.com
let close_btn;
let popup;
let main_popup;

//Set up page when window has loaded
window.onload = init;

//Get pointers to parts of the DOM after the page has loaded
function init(){
    navDiv = document.getElementById("navButtons");
    footerDiv = document.getElementById("footer");
    homeDiv = document.getElementById("homeWrapper");
    aboutDiv = document.getElementById("aboutWrapper");
    manageDiv = document.getElementById("popupManageDiv");
    feedbackDiv = document.getElementById("popup-content");
    centerPopupDiv = document.getElementById("centerPopup");

    close_btn = document.getElementById("close-btn");
    popup = document.getElementById("popup");
    main_popup = document.getElementById("main-popup");

    loadNav();
    loadArticles();
    loadFooter();
}


function feedbackPopupClose(){
    main_popup.style.animation = 'slide-out .5s ease';
    main_popup.style.animationFillMode = 'forwards';
	setTimeout(() => {
		popup.style.display = 'none';
	}, 500);
}
function feedbackPopupOpen(){
	popup.style.display = 'flex';
    main_popup.style.animation = 'slide-in .5s ease';
    main_popup.style.animationFillMode = 'forwards';
}

window.addEventListener('click', (e) => {
        feedbackPopupClose();
});


console.log("Welcome Again" + document.cookie);