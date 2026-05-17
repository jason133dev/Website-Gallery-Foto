// asset
let group = document.querySelector('.group');
let koleksi = document.querySelector(`.koleksi`);
let lightbox = document.querySelector(`.lightbox`);

// slide logic
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

    let sensitive = window.innerWidth < 768 ? 2 : 2;
    if (window.innerWidth < 768) {
        group.style.scrollBehavior = `auto`;
    }

    let walk = (x - startX) * sensitive;
    group.scrollLeft = scrollLeft - walk;
});

// lightbox logic
document.addEventListener(`click`, (e) => {
    if (e.target.classList.contains(`klikOn`)) {
        lightbox.classList.remove(`lightbox-hilang`);
        let preview = lightbox.querySelector(`img`);
        preview.src = ``;
        let linkPreview = e.target.src;

        preview.src = linkPreview;
    }
    
    if (e.target.classList.contains(`lightbox`)) {
        lightbox.classList.add(`lightbox-hilang`);
    }
})

// disable tahan lama
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});