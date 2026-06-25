// asset
let group = document.querySelector('.group');
let koleksi = document.querySelector(`.koleksi`);
let lightbox = document.querySelector(`.lightbox`);
let preview = lightbox.querySelector(`img`);
let download = document.querySelector(`.download`);
let iconDownload = document.querySelector(`#icon-download`);
let loader = document.querySelector(`.loader`);
let checkMark = document.querySelector(`.check-mark`);
let dataSet = document.querySelector(`#dataset`);
let downloadDefender = document.querySelector(`.download-defender`);

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

group.addEventListener('pointerup', () => {
    isDown = false;
    group.style.cursor = 'grab';
});

group.addEventListener('pointerleave', () => {
    isDown = false;
    group.style.cursor = 'grab';
});

group.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    let x = e.pageX - group.offsetLeft;

    let sensitive = 2;

    let walk = (x - startX) * sensitive;
    group.scrollLeft = scrollLeft - walk;
});

// lightbox logic
document.addEventListener(`click`, (e) => {
    download.style.display = `flex`;
    // metadata
    let metaDataJudul = e.target.dataset.judul;
    let metaDataTanggal = e.target.dataset.tanggal;
    let metaDataDownload = e.target.dataset.download;

    // logic preview
    if (e.target.classList.contains(`klikOn`)) {
        // preview
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
    }

    // download
    let guard = false;

    async function downloadFile(urlDownload) {
        if (guard) return;

        if (!metaDataDownload || metaDataDownload === `undefined`) {
            console.log("⚠️ [Guard] Request blocked: Oi sabar! Datanya belom siap, jangan di-spam!");
            return;
        }

        guard = true;
        try {
            const response = await fetch(urlDownload);

            if (!response.ok) {
                throw new Error(`Server overload atau status ${response.status}`);
            }

            const d = await response.json();

            const a = document.createElement("a"); // ← ini INVISIBLE, user tidak lihat
            a.href = "data:" + d.mime + ";base64," + d.base64;
            a.download = d.nama;
            a.click();

            // checkmark logic
            iconDownload.style.display = `none`;
            loader.style.display = `none`;
            checkMark.style.display = `block`;
            guard = false;
            downloadDefender.style.pointerEvents = `none`;

        } catch (error) {
            console.error("🚨 [DownloadSystem] Download gagal bray! Detail:", error.message);

            guard = false;
            iconDownload.style.display = `block`;
            loader.style.display = `none`;
            checkMark.style.display = `none`;
        }
    }
    download.onclick = () => {
        downloadFile(metaDataDownload);
    };

    if (e.target.classList.contains(`download`)) {
        iconDownload.style.display = `none`;
        loader.style.display = `block`;
        downloadDefender.style.pointerEvents = `all`;
    }

    // tutup lightbox
    if (e.target.classList.contains(`lightbox`)) {
        lightbox.classList.add(`lightbox-hilang`);

        download.href = `#`;
        download.setAttribute(`download`, `#`);
        download.style.display = `none`;
        download.classList.add(`download-hilang`);

        // reset logic icon icon download
        iconDownload.style.display = `block`;
        loader.style.display = `none`;
        checkMark.style.display = `none`;
    }

    // upload
    if (e.target.classList.contains(`logo`)) {
        console.log (`Link uplaod foto: https://drive.google.com/drive/folders/1FF5dbdUdc3c4Qk_EhERYrekGRMyXpTh3?usp=sharing`);
    }
});

// disable tahan lama
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});