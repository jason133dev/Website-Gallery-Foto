// 1. Setup Lenis
const lenis = new Lenis({
  duration: .8,   // Berapa lama animasi scroll bertahan (detik)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Fungsi matematika biar "licin"
  direction: 'vertical', 
  gestureDirection: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1, 
  touchMultiplier: 2, // Biar swipe di HP lebih berasa mantul
});

// 2. Hubungkan Lenis dengan requestAnimationFrame (Logika Looping)
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// asset
let list1 = document.querySelector(`#list1`);
let list2 = document.querySelector(`#list2`);
let list3 = document.querySelector(`#list3`);
let dropdown1 = document.querySelector(`#dropdown1`);
let dropdown2 = document.querySelector(`#dropdown2`);
let dropdown3 = document.querySelector(`#dropdown3`);
let heroButton = document.querySelector(`#hero-button`);

let main = document.querySelector(`.main`);
let main2 = document.querySelector(`.main2`);

list1.addEventListener(`click`, () => {
    lenis.scrollTo(0, { duration: 1.5 });
});

list2.addEventListener(`click`, () => {
    lenis.scrollTo(main, { duration: 1.5, offset: -150 });
});

list3.addEventListener(`click`, () => {
    lenis.scrollTo(main2, { duration: 1.5, offset: -150 });
});

dropdown1.addEventListener(`click`, () => {
    lenis.scrollTo(0, { duration: 1.5 });
});

dropdown2.addEventListener(`click`, () => {
    lenis.scrollTo(main, { duration: 1.5, offset: -150 });
});

dropdown3.addEventListener(`click`, () => {
    lenis.scrollTo(main2, { duration: 1.5, offset: -150 });
});

heroButton.addEventListener(`click`, () => {
    lenis.scrollTo(main2, { duration: 1.5, offset: -150 });
});