const apiURL = "https://script.google.com/macros/s/AKfycbyhypdNWiHkKMJG-vU6dXTz-63VjUfynfgem25xzdczOwb8OwIVo3IE-oIx1pPSkqHQ/exec";

// asset
let koleksi2 = document.querySelector('.koleksi');

let halamanSekarang = 1;
let totalHalaman = 1;
let sedangLoad = false;

function renderKeGrid(data) {
    let skeletons = koleksi2.querySelectorAll('.skeleton');
    skeletons.forEach(skel => skel.remove());

    data.forEach((item, index) => {
        const loadingStrategy = index < 6 ? 'eager' : 'lazy';
        const priority = index < 3 ? 'high' : 'low';

        let htmlMarkup = `
            <div class="koleksi-img">
                <img src="${item.url}" 
                     alt="${item.judul}" 
                     loading="${loadingStrategy}" 
                     fetchpriority="${priority}"
                     data-judul="${item.judul}"
                     data-tanggal="${item.tanggal}" 
                     data-download="${item.url_download}"                      
                     class="klikOn">
                <p>${item.judul} <br>
                    <span class="date">${item.tanggal}</span>
                </p>
            </div>
        `;
        koleksi2.insertAdjacentHTML('beforeend', htmlMarkup);
    });
}

function muatData(page) {
    if (sedangLoad) return;
    sedangLoad = true;

    const script = document.createElement('script');
    script.src = `${apiURL}?page=${page}`;
    document.body.appendChild(script);
}

window.panggilData = (response) => {
    try {
        totalHalaman = response.totalHalaman;
        renderKeGrid(response.data);
        sedangLoad = false;

        if (halamanSekarang < totalHalaman) {
            observer.observe(sentinel);
        } else {
            observer.unobserve(sentinel);
        }
    } catch (error) {
        console.error("Gagal memproses data:", error);
        sedangLoad = false;
    }
};

// sentinel
const sentinel = document.querySelector('#sentinel');

function createSkeleton(n) {
    for(i = 0; i < n; i++) {
        let createSkeleton = document.createElement(`div`)
        createSkeleton.className = `skeleton loading-asset`;
        koleksi2.appendChild(createSkeleton);
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !sedangLoad) {
            halamanSekarang++;
            observer.unobserve(sentinel);

            // generate skeleton
            createSkeleton(9);

            muatData(halamanSekarang);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    muatData(1);
});