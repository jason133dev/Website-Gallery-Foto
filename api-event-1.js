const apiURL = "https://script.google.com/macros/s/AKfycbzCAsAFRLXTbtp5rJgIOgVIOennFZMVF85kDcqwKVA005maqrXDc0MlZnujc-DUHfm0/exec";

// asset
let koleksi2 = document.querySelector('.koleksi');
let main2 = document.querySelector(`.main2`);

let halamanSekarang = 1;
let totalHalaman = 1;
let sedangLoad = false;
let timer24Jam = 24 * 60 * 60 * 1000;

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
}

// -----------------------------------------------------------------------------------------

function muatData(page) {
    if (sedangLoad) return;
    sedangLoad = true;

    let dataLocalApi = localStorage.getItem(`page-${page}-event-1`);

    if (dataLocalApi) {
        let konversiData = JSON.parse(dataLocalApi);

        // cek sudah lewat 24 jam atau belum
        if (Date.now() < konversiData.timer) {
            // ambil data total halaman dari data yang sudah disimpan
            totalHalaman = konversiData.dataApi.totalHalaman;

            renderKeGrid(konversiData.dataApi.data);
            sedangLoad = false;
            main2.innerHTML = `${konversiData.dataApi.jumlahPhoto} Photo`;

            if (halamanSekarang < totalHalaman) {
                observer.observe(sentinel);
            } else {
                observer.unobserve(sentinel);
            }
        } else {
            // reset jika sudah lewat 24 jam
            localStorage.removeItem(`page-${page}-event-1`);

            const script = document.createElement('script');
            script.src = `${apiURL}?page=${page}&kategori=mpls`;
            document.body.appendChild(script);
        }
    } else {
        const script = document.createElement('script');
        script.src = `${apiURL}?page=${page}&kategori=mpls`;
        document.body.appendChild(script);
    }
}

window.panggilData = (responseApi) => {
    try {
        totalHalaman = responseApi.totalHalaman;

        let dataGabungan = {
            timer: Date.now() + timer24Jam,
            dataApi: responseApi
        };

        localStorage.setItem(`page-${halamanSekarang}-event-1`, JSON.stringify(dataGabungan));
        renderKeGrid(responseApi.data);

        sedangLoad = false;

        main2.innerHTML = `${responseApi.jumlahPhoto} Photo`;

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
});