const apiURL = "https://script.google.com/macros/s/AKfycbzLrwYEP9FE-XeZ8c3ARNI8zeqGQt6O6fy5eHBYPdxIG2BfL0f4NM7EJx7JQJZJ7bvU/exec";


async function fetchGallery() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        let columns = document.querySelectorAll('.column-koleksi');
        columns.forEach(col => col.innerHTML = '');

        data.forEach((item, index) => {
            const columnIndex = index % columns.length;

            // STRATEGI LCP: 3-6 gambar pertama (tergantung jumlah kolom) dikasih eager
            // Sisanya baru lazy. Kita pakai threshold 'index < 6' untuk jaga-jaga di layar desktop.
            const loadingStrategy = index < 6 ? 'eager' : 'lazy';
            const priority = index < 3 ? 'high' : 'auto'; // VVIP buat 3 gambar teratas

            let htmlMarkup = `
                <div class="koleksi-img">
                    <img src="${item.url}" 
                         alt="${item.judul}" 
                         loading="${loadingStrategy}" 
                         fetchpriority="${priority}"
                         class="klikOn">
                    <p>${item.judul} <br>
                        <span class="date">${item.tanggal}</span>
                    </p>
                </div>
            `;

            columns[columnIndex].innerHTML += htmlMarkup;
        });

    } catch (error) {
        console.error("Waduh, gagal narik foto:", error);
    }
}

let koleksi = document.querySelector(`.koleksi`);
let lightbox = document.querySelector(`.lightbox`);

// lightbox logic
koleksi.addEventListener(`click`, (e) => {
    if (e.target.classList.contains(`klikOn`)) {
        lightbox.classList.remove(`lightbox-hilang`);
        let preview = lightbox.querySelector(`img`);
        preview.src = ``;
        let linkPreview = e.target.src;

        preview.src = linkPreview;
    }
})

document.addEventListener(`click`, (e) => {
    if (e.target.classList.contains(`lightbox`)) {
        lightbox.classList.add(`lightbox-hilang`);
    }
})

document.addEventListener('DOMContentLoaded', fetchGallery);