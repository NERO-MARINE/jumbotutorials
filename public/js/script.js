
// var icon = document.getElementById("iconbar");
// var links = document.querySelector(".links_side_con");

// icon.addEventListener("click", () => {
//     links.classList.toggle('active');
// });
const toggler = document.querySelector('.toggler');
const navbarlinks = document.querySelector('.nav-links');
const navbarSearch = document.querySelector('input[type="search"]');

toggler.addEventListener('click', ()=> {
    navbarlinks.classList.toggle('active');
    toggler.classList.toggle('toggler_small_screen');
    navbarSearch.classList.toggle('active');
});

var sidenav = document.getElementById("sidenav");
var open = document.getElementById("open").addEventListener("click", () => {
  sidenav.classList.toggle("active");
});

var close = document.getElementById("close").addEventListener("click", () => {
  sidenav.classList.remove("active");
});



function trans() {
  // if(links.classList.contains('active')){
  //   links.classList.remove('active')
  // }

  if(sidenav.classList.contains('active')){
    sidenav.classList.remove('active')
  }
}

trans();
