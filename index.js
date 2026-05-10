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
    e.preventDefault();
    let x = e.pageX - group.offsetLeft;
    let walk = (x - startX) * 2;
    group.scrollLeft = scrollLeft - walk;
});