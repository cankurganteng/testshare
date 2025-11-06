// Data produk dummy (ganti dengan data dari database/API jika perlu)
// Pastikan URL gambar bisa di-fetch (misalnya gambar lokal atau dari domain Anda)
const products = [
    {
        id: 1,
        name: "Produk A",
        image: "images/gambar1.png", // Ganti dengan URL gambar asli, misalnya "images/produkA.jpg"
        description: "Deskripsi lengkap produk A. Ini adalah produk berkualitas tinggi dengan fitur unggulan."
    },
    {
        id: 2,
        name: "Produk B",
        image: "images/gambar2.png", // Ganti dengan URL gambar asli
        description: "Deskripsi lengkap produk B. Cocok untuk kebutuhan sehari-hari."
    },
    {
        id: 3,
        name: "Produk C",
        image: "images/gambar3.png", // Ganti dengan URL gambar asli
        description: "Deskripsi lengkap produk C. Inovatif dan tahan lama."
    }
];

// Fungsi untuk render katalog di index.html
function renderCatalog() {
    const catalog = document.getElementById('catalog');
    if (!catalog) return; // Jika bukan di index.html, skip

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description.substring(0, 100)}...</p>
            <button onclick="viewDetail(${product.id})">Detail</button>
            <button onclick="shareWhatsApp(${product.id})">Share WhatsApp</button>
        `;
        catalog.appendChild(card);
    });
}

// Fungsi untuk navigasi ke halaman detail
function viewDetail(id) {
    window.location.href = `detail.html?id=${id}`;
}

// Fungsi share WhatsApp dengan gambar langsung
async function shareWhatsApp(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
        // Fetch gambar sebagai blob
        const response = await fetch(product.image);
        if (!response.ok) throw new Error('Gagal mengunduh gambar');
        const blob = await response.blob();

        // Buat file dari blob
        const file = new File([blob], `${product.name}.jpg`, { type: 'image/jpeg' });

        // Cek apakah Web Share API didukung dan bisa share file
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: product.name,
                text: product.description,
                files: [file] // Share gambar sebagai file
            });
        } else {
            throw new Error('Browser tidak mendukung share gambar langsung');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: Share teks dengan link gambar
        const message = `Lihat produk ini: ${product.name}\n\nDeskripsi: ${product.description}\n\nGambar: ${product.image}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        alert('Browser Anda tidak mendukung share gambar langsung. Menggunakan share teks dengan link gambar.');
    }
}

// Fungsi untuk render detail produk di detail.html
function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === id);

    if (!product) {
        document.getElementById('product-detail').innerHTML = '<p>Produk tidak ditemukan.</p>';
        return;
    }

    document.getElementById('product-detail').innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <button onclick="shareWhatsApp(${product.id})">Share WhatsApp</button>
    `;
}

// Jalankan fungsi sesuai halaman
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    renderCatalog();
} else if (window.location.pathname.includes('detail.html')) {
    renderProductDetail();
}