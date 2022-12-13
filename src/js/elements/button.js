const btn1 = document.getElementById("innovation");
const btn2 = document.getElementById("education");
const btn3 = document.getElementById("entertainment");

const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const text3 = document.getElementById("text3");

btn1.onclick = function () {
    text1.classList.add("section-one__text1--active");
    text2.classList.remove("section-one__text1--active");
    text3.classList.remove("section-one__text1--active");
};
btn2.onclick = function () {
    text2.classList.add("section-one__text1--active");
    text1.classList.remove("section-one__text1--active");
    text3.classList.remove("section-one__text1--active");
};
btn3.onclick = function () {
    text3.classList.add("section-one__text1--active");
    text2.classList.remove("section-one__text1--active");
    text1.classList.remove("section-one__text1--active");
};
