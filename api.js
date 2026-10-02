const apiURL = "https://script.google.com/macros/s/AKfycbzCAsAFRLXTbtp5rJgIOgVIOennFZMVF85kDcqwKVA005maqrXDc0MlZnujc-DUHfm0/exec";

// asset
let koleksi2 = document.querySelector('.koleksi');

let halamanSekarang = 1;
let totalHalaman = 1;
let sedangLoad = false;
let lastUpdate = document.querySelector(`#last-updated`);

function renderKeGrid(data) {
    let skeletons = koleksi2.querySelectorAll('.skeleton');
    skeletons.forEach(skel => skel.remove());

    let column = document.querySelectorAll(`.column`);

    data.forEach((item, index) => {
        const loadingStrategy = index < 6 ? 'eager' : 'lazy';
        const priority = index < 3 ? 'high' : 'low';

        let sortir;
        if (window.innerWidth < 768) {
            sortir = index % 2;
        } else {
            sortir = index % 3;
        }

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
        column[sortir].insertAdjacentHTML('beforeend', htmlMarkup);
    });

    // Last updated
    let tanggalTerakhir = data[0].tanggal;
    let pengubahTanggal = (tanggalTerakhir) => {
        let tanggalPisah = tanggalTerakhir.toLowerCase().split(" ");
        let tanggal = tanggalPisah[0];
        let bulan = tanggalPisah[1];
        let tahun = tanggalPisah[2];

        let bulanIndo = {
            januari: "01",
            februari: "02",
            maret: "03",
            april: "04",
            mei: "05",
            juni: "06",
            juli: "07",
            agustus: "08",
            september: "09",
            oktober: "10",
            november: "11",
            desember: "12"
        };

        return `${tanggal}/${bulanIndo[bulan]}/${tahun}`;
    }

    if (window.innerWidth < 768) {
        lastUpdate.innerHTML = `Last Updated: <br>${pengubahTanggal(tanggalTerakhir)}`;
    } else {
        lastUpdate.innerHTML = `Last Updated: ${pengubahTanggal(tanggalTerakhir)}`;
    }
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
    let column = document.querySelectorAll(`.column`);

    for (i = 0; i < n; i++) {
        let sortir;
        if (window.innerWidth < 768) {
            sortir = i % 2;
        } else {
            sortir = i % 3;
        }

        let createSkeleton = document.createElement(`div`);
        createSkeleton.className = `skeleton loading-asset`;

        column[sortir].appendChild(createSkeleton);
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
})