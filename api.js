const apiURL = "https://script.google.com/macros/s/AKfycbxdmiyNmtdyUiepgh5EIsqKwhJWu89e5z8GurQoyRm6OSPJtJsJC1A0kqhuikI0QPHv/exec";

async function fetchGallery() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        // Ambil ketiga kolom kamu dari HTML
        const columns = document.querySelectorAll('.column-koleksi');
        
        // Bersihkan isi kolom statis (MPLS OSIS 2026 yang kamu tulis manual tadi)
        columns.forEach(col => col.innerHTML = '');

        // Looping data dan bagi ke kolom secara adil (0, 1, 2, kembali ke 0...)
        data.forEach((item, index) => {
            const columnIndex = index % columns.length; // Hasilnya bakal 0, 1, atau 2
            
            const htmlMarkup = `
                <div class="koleksi-img">
                    <img src="${item.url}" alt="${item.judul}" loading="lazy">
                    <p>${item.judul} <br>
                        <span class="date">${item.tanggal}</span>
                    </p>
                </div>
            `;
            
            // Masukkan foto ke kolom yang dapet gilirannya
            columns[columnIndex].innerHTML += htmlMarkup;
        });

    } catch (error) {
        console.error("Waduh, gagal narik foto:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchGallery);