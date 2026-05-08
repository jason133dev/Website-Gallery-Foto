// slide
let group = document.querySelector('.group');
let isDown = false;
let startX;
let scrollLeft;

group.addEventListener('mousedown', (e) => {
    isDown = true;
    group.style.cursor = 'grabbing';
    startX = e.pageX - group.offsetLeft;
    scrollLeft = group.scrollLeft;
});

group.addEventListener('mouseleave', () => {
    isDown = false;
    group.style.cursor = 'grab';
});

group.addEventListener('mouseup', () => {
    isDown = false;
    group.style.cursor = 'grab';
});

group.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    let x = e.pageX - group.offsetLeft;
    let walk = (x - startX) * 2;
    group.scrollLeft = scrollLeft - walk;
});

