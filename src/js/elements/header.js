// const nav = document.getElementById("nav");
// const closeBtn = document.getElementById("close");

// function showMenu() {
//     const btn = document.getElementById("burger");
//     btn.onclick = () => {
//         nav.classList.add('nav--active');
//     };
//   }
// function closeMenu() {
//     closeBtn.onclick = () => {
//         nav.classList.remove('nav--active');
//     };
//   }

// showMenu();
// closeMenu();

const nav = document.getElementById("nav");
const burger = document.getElementById("burger");

function toggleMenu() {
  if( burger.classList.contains('open') ) {
    closeMenu();
  }
  else{
    openMenu();
  }
}

function openMenu() {
  nav.classList.add('nav--active');
  burger.classList.add('open');
}
function closeMenu() {
  nav.classList.remove('nav--active');
  burger.classList.remove('open');
}

burger.onclick = toggleMenu;