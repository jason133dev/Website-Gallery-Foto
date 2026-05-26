// asset
let group = document.querySelector('.group');
let koleksi = document.querySelector(`.koleksi`);
let lightbox = document.querySelector(`.lightbox`);
let download = document.querySelector(`.download`);
let dataSet = document.querySelector(`#dataset`);

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
    // metadata
    let metaDataJudul = e.target.dataset.judul;
    let metaDataTanggal = e.target.dataset.tanggal;
    let metaDataDownload = e.target.dataset.download;

    if (e.target.classList.contains(`klikOn`)) {
        download.style.display = `block`;

        // preview
        let preview = lightbox.querySelector(`img`);
        preview.src = ``;
        let linkPreview = e.target.src;

        let metaHtml = `
            <p id="dataset">${metaDataJudul} <br>
                <span class="date2">${metaDataTanggal}</span>
            </p>
        `;

        preview.src = linkPreview;

        // munculin preview
        function muncul() {
            lightbox.classList.remove(`lightbox-hilang`);
            dataSet.innerHTML = metaHtml;
            download.classList.remove(`download-hilang`);

            preview.removeEventListener('load', muncul)
        }

        preview.addEventListener(`load`, muncul);

        download.addEventListener(`click`, () => {
            window.open(metaDataDownload, '_blank');
        })
    }

    if (e.target.classList.contains(`lightbox`)) {
        lightbox.classList.add(`lightbox-hilang`);

        download.style.display = `none`;
        download.classList.add(`download-hilang`);
    }
})

// disable tahan lama
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});