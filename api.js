const apiURL = "https://script.google.com/macros/s/AKfycbwFnBXaFBNuUV4psDx6b43_d9SXnMNCg7-gTWfmvgthXUb1woU956sYl1fFyEexhwpf/exec";

let halamanSekarang = 1;
let totalHalaman = 1;
let sedangLoad = false;

function renderKeGrid(data) {
    let columns = document.querySelectorAll('.column-koleksi');

    if (halamanSekarang === 1) {
        columns.forEach(col => col.innerHTML = '');
    }

    data.forEach((item, index) => {
        const columnIndex = index % columns.length;
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
        columns[columnIndex].innerHTML += htmlMarkup;
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

const sentinel = document.querySelector('#sentinel');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !sedangLoad) {
            halamanSekarang++;
            observer.unobserve(sentinel);
            muatData(halamanSekarang);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    muatData(1);
});