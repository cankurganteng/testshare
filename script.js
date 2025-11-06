// Fungsi untuk fetch data produk dari API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products.json'); // Path relatif dari root
        if (!response.ok) throw new Error('Gagal mengambil data produk');
        const products = await response.json();
        return products; // Array produk dinamis
    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback: Array dummy jika API gagal
        return [
            {
                id: 1,
                name: "Produk A",
                image: "images/gambar1.png",
                description: "Deskripsi lengkap produk A."
            },
            {
                id: 2,
                name: "Produk B",
                image: "images/gambar2.png",
                description: "Deskripsi lengkap produk B."
            },
            {
                id: 3,
                name: "Produk C",
                image: "images/gambar3.png",
                description: "Deskripsi lengkap produk C."
            }
        ];
    }
}

// Fungsi untuk render katalog di index.html
async function renderCatalog() {
    const catalog = document.getElementById('catalog');
    if (!catalog) return;

    const products = await fetchProducts();
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
    window.location.href = detail.html?id=${id};
}

// Fungsi share WhatsApp dengan gambar langsung
async function shareWhatsApp(id) {
    const products = await fetchProducts();
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
        // Fetch gambar sebagai blob
        const response = await fetch(product.image);
        if (!response.ok) throw new Error('Gagal mengunduh gambar');
        const blob = await response.blob();

        // Buat file dari blob
        const file = new File([blob], ${product.name}.jpg, { type: 'image/jpeg' });

        // Cek apakah Web Share API didukung
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: product.name,
                text: product.description,
                files: [file]
            });
        } else {
            throw new Error('Browser tidak mendukung share gambar langsung');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: Share teks dengan link gambar
        const message = Lihat produk ini: ${product.name}\n\nDeskripsi: ${product.description}\n\nGambar: ${product.image};
        const whatsappUrl = https://api.whatsapp.com/send?text=${encodeURIComponent(message)};
