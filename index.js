// slide
let group = document.querySelector('.group');
let isDown = false;
let startX;
let scrollLeft;

group.addEventListener('pointerdown', (e) => {
    isDown = true;
    group.style.cursor = 'grabbing';
    startX = e.pageX - group.offsetLeft;
    scrollLeft = group.scrollLeft;
});

group.addEventListener('pointerleave', () => {
    isDown = false;
    group.style.cursor = 'grab';
});

group.addEventListener('pointerup', () => {
    isDown = false;
    group.style.cursor = 'grab';
});

group.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    let x = e.pageX - group.offsetLeft;
    let sensitive = window.innerWidth < 768 ? 10 : 2;
    console.log(sensitive)
    let walk = (x - startX) * sensitive;
    group.scrollLeft = scrollLeft - walk;
});