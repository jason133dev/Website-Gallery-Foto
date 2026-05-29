const apiURL = "https://script.google.com/macros/s/AKfycbwTksyxuz4fZJYN1pFhsOt-1RHxyE4F9eYiLnyf_slkW_P0iQsoy47x9SgNxI7Euu0e/exec"; 

function renderKeGrid(data) {
    let columns = document.querySelectorAll('.column-koleksi');
    columns.forEach(col => col.innerHTML = '');

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

window.panggilData = (data) => {
    try {
        renderKeGrid(data);
    } catch (error) {
        console.error("Waduh, gagal memproses data foto:", error);
    }
};

function gallery() {
    const newScript = document.createElement('script');
    newScript.src = apiURL;
    newScript.type = `module`;
    document.body.appendChild(newScript);
}

document.addEventListener('DOMContentLoaded', gallery);