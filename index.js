// asset
let group = document.querySelector('.group');
let koleksi = document.querySelector(`.koleksi`);
let sideBarBox = document.querySelector(`.sidebarbox`);
let lightbox = document.querySelector(`.lightbox`);
let preview = lightbox.querySelector(`img`);
let download = document.querySelector(`.download`);
let iconDownload = document.querySelector(`#icon-download`);
let loader = document.querySelector(`.loader`);
let checkMark = document.querySelector(`.check-mark`);
let dataSet = document.querySelector(`#dataset`);
let downloadDefender = document.querySelector(`.download-defender`);
let sideBar = document.querySelector(`.sidebar`);
let dropDownList = document.querySelectorAll(`.dropdown-list`);
let system = document.querySelector(`.system`);
let mainTextSystem = document.querySelector(`#main-text-system`);
let textSystem1 = document.querySelector(`#text-system1`);
let textSystem2 = document.querySelector(`#text-system2`);
let systemBtn = document.querySelector(`#system-button`);

// slide logic
let isDown = false;
let startX;
let scrollLeft;

// guard
let guard = false;

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

        // buat download
        download.dataset.download = metaDataDownload;

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

            // history back
            history.pushState({ previewMuncul: true }, ``)
        }

        preview.addEventListener(`load`, muncul);
    }

    // download
    async function downloadFile(urlDownload) {
        if (guard) return;

        if (!urlDownload || urlDownload === `undefined`) { return; }

        guard = true;
        try {
            iconDownload.style.display = `none`;
            loader.style.display = `block`;
            downloadDefender.style.pointerEvents = `all`;

            const response = await fetch(urlDownload);

            if (!response.ok) {
                throw new Error(`${response.status}`);
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
            downloadDefender.style.pointerEvents = `none`;
            guard = false;

        } catch (error) {
            system.classList.remove(`lightbox-hilang`);
            mainTextSystem.innerHTML = `Gagal Mengunduh Foto`;
            textSystem1.innerHTML = `Silakan periksa kembali koneksi internet Anda dan muat ulang halaman ini untuk mencoba lagi.`;
            textSystem2.innerHTML = `Eror code: ${error.message}`;

            // offline check
            if (!navigator.onLine) {
                system.classList.remove(`lightbox-hilang`);
                mainTextSystem.innerHTML = `Koneksi Internet Anda Terputus`;
                textSystem1.innerHTML = `Pastikan WiFi atau data seluler Anda aktif.`;
                textSystem2.innerHTML = `Eror code: Offline`;
            }

            guard = false;
            iconDownload.style.display = `block`;
            loader.style.display = `none`;
            checkMark.style.display = `none`;
        }
    }

    if (e.target.matches('#system-button')) {
        location.reload();
    }

    // pakadi closest karena bisa return dataset, kalau contains hanya bernilai bolean
    let btnDownload = e.target.closest(`.download`);
    if (btnDownload) {
        let urlToDownload = download.dataset.download;
        downloadFile(urlToDownload);
        download.style.pointerEvents = `none`;
    }

    // tutup lightbox
    if (e.target.classList.contains(`lightbox`)) {
        download.style.pointerEvents = `all`;
        lightbox.classList.add(`lightbox-hilang`);
        sideBar.style.translate = `1000px`;

        download.href = `#`;
        download.setAttribute(`download`, `#`);
        download.style.display = `none`;
        download.classList.add(`download-hilang`);

        // reset logic icon icon download
        iconDownload.style.display = `block`;
        loader.style.display = `none`;
        checkMark.style.display = `none`;

        // riset history
        if (history.state && history.state.previewMuncul) {
            history.back();
        }
    }

    // hamburger
    if (e.target.classList.contains(`hbr`)) {
        sideBar.style.translate = `0px`;
        sideBarBox.classList.remove(`lightbox-hilang`);
    }

    // close sidebar
    if (e.target.classList.contains(`cls`)) {
        sideBar.style.translate = `1000px`;
        sideBarBox.classList.add(`lightbox-hilang`);
    }

    if (e.target.classList.contains(`dropdown-list`)) {
        sideBar.style.translate = `1000px`;
        sideBarBox.classList.add(`lightbox-hilang`);
    }

    // upload dan reset local storage
    if (e.target.classList.contains(`logo-osis`)) {
        localStorage.clear();
        console.log(`Link uplaod foto: https://drive.google.com/drive/folders/1FF5dbdUdc3c4Qk_EhERYrekGRMyXpTh3?usp=sharing`);
    }
});

// disable tahan lama
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// hp saat rotate
let mediaQuery = window.matchMedia(`(orientation: landscape)`);

mediaQuery.addEventListener(`change`, () => {
    location.reload();
});

// tutup light box dengan deteksi back navigation
// popState hanya mendeteksi perubahan di history
// sistem ini dibuat seolah olah user sudah membuka halaman baru, jadi ketika pakai
// back navigator, ya dia bakalan keluar halaman kayak biasanya, tapi bedanya ini kita buat
// halaman transparant dengan `history.pushState({ previewMuncul: true }, ``)`
window.addEventListener(`popstate`, () => {
    if (guard) return;

    guard = false;
    lightbox.classList.add(`lightbox-hilang`);
    sideBar.style.translate = `1000px`;

    download.href = `#`;
    download.setAttribute(`download`, `#`);
    download.style.display = `none`;
    download.classList.add(`download-hilang`);

    // reset logic icon icon download
    iconDownload.style.display = `block`;
    loader.style.display = `none`;
    checkMark.style.display = `none`;
})