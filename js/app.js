// =======================================================
// FILE: js/app.js
// Logika Landing Page (index.html)
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // File ini sekarang hanya berisi event listener tambahan jika diperlukan.
    // Karena semua tombol utama (Uji Coba Gratis) menggunakan tag <a>,
    // tidak ada logika routing JavaScript yang kompleks diperlukan di sini.
    
    // Namun, kita tambahkan listener untuk logo agar konsisten (walaupun sudah ada onclick di HTML)
    const appLogo = document.getElementById('app-logo');
    if (appLogo) {
        appLogo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Catatan: Logika Dark Mode tetap di dalam tag <script> di index.html
    // karena membutuhkan akses langsung ke DOM dan localStorage yang dimuat awal.
    
    console.log("PRAKARSA App: Landing Page scripts loaded successfully.");
});