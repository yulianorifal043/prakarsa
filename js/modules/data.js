// =======================================================
// FILE: js/modules/data.js
// Berisi semua data statis (Pertanyaan, Paths, Deskripsi, Ahli)
// =======================================================

// --- OCEAN Questions (Kepribadian) ---
export const oceanQuestions = [
    { id: 1, text: "Saya menyukai ide-ide baru yang kompleks dan abstrak.", dimension: 'O', type: 'OCEAN', reverse: false },
    { id: 2, text: "Saya selalu membuat rencana detail dan menyelesaikan tugas tepat waktu.", dimension: 'C', type: 'OCEAN', reverse: false },
    { id: 3, text: "Saya merasa senang dan berenergi saat berada di tengah keramaian.", dimension: 'E', type: 'OCEAN', reverse: false },
    { id: 4, text: "Saya mudah merasa cemas atau stres saat menghadapi masalah.", dimension: 'N', type: 'OCEAN', reverse: false },
    { id: 5, text: "Saya sering mengalah untuk menghindari pertengkaran atau konflik.", dimension: 'A', type: 'OCEAN', reverse: false },
];

// --- RIASEC Questions (Minat Karir) ---
export const riasecQuestions = [
    { id: 6, text: "Saya menikmati pekerjaan yang melibatkan perbaikan alat atau berinteraksi langsung dengan alam/benda fisik.", dimension: 'R', type: 'RIASEC' },
    { id: 7, text: "Saya suka menganalisis data, memecahkan teka-teki, dan melakukan eksperimen ilmiah.", dimension: 'I', type: 'RIASEC' },
    { id: 8, text: "Saya tertarik pada ekspresi diri, desain visual, atau seni pertunjukan.", dimension: 'A', type: 'RIASEC' },
    { id: 9, text: "Saya senang membantu, mengajar, atau memberikan saran kepada orang lain.", dimension: 'S', type: 'RIASEC' },
    { id: 10, text: "Saya suka memimpin, meyakinkan orang, dan mengambil risiko untuk mencapai tujuan.", dimension: 'E', type: 'RIASEC' },
    { id: 11, text: "Saya unggul dalam pekerjaan yang memerlukan kerapian, detail, dan mengikuti prosedur baku.", dimension: 'C', type: 'RIASEC' },
];

// --- Path Configuration ---
export const paths = [
    { key: 'job', name: 'Persiapan Kerja & Karir', icon: '<i class="fas fa-briefcase"></i>', color: 'text-secondary', desc: 'Identifikasi peran dan lingkungan kerja ideal Anda.' },
    { key: 'business', name: 'Memulai Bisnis/Startup', icon: '<i class="fas fa-rocket"></i>', color: 'text-primary', desc: 'Analisis kekuatan kepemimpinan dan risiko Anda.' },
    { key: 'style', name: 'Style & Lingkungan Pekerjaan', icon: '<i class="fas fa-laptop-code"></i>', color: 'text-indigo-500', desc: 'Tentukan Anda cocok di kantoran, remote, atau freelancer.' },
    { key: 'study', name: 'Pilihan Kuliah/Jurusan', icon: '<i class="fas fa-graduation-cap"></i>', color: 'text-teal-500', desc: 'Rekomendasi bidang studi yang selaras dengan minat.' },
    { key: 'skill', name: 'Hiburan & Tingkatkan Skill', icon: '<i class="fas fa-lightbulb"></i>', color: 'text-orange-500', desc: 'Analisis gaya belajar dan potensi pengembangan pribadi.' },
];

// --- EXPERT TEAM DATA ---
export const experts = [
    {
        name: "Shyarla Prameswari",
        title: "S.Psi., Certified Career Coach",
        badge: "Konselor Karir Klinis",
        photoUrl: "https://via.placeholder.com/150/38B2AC/FFFFFF?text=SP",
    },
    {
        name: "Angga Dirgantara",
        title: "M.B.A., Financial & Business Analyst",
        badge: "Spesialis Bisnis & Investasi",
        photoUrl: "https://via.placeholder.com/150/2F855A/FFFFFF?text=AD",
    },
    {
        name: "Anggle Clarissa",
        title: "Ph.D. Candidate in Organizational Psychology",
        badge: "Ahli Pengembangan Organisasi",
        photoUrl: "https://via.placeholder.com/150/ECC94B/1A202C?text=AC",
    }
];

// --- Deskripsi Helper ---
export const oceanDescMap = { O: 'Keterbukaan', C: 'Ketelitian', E: 'Ekstraversi', A: 'Keramahan', N: 'Stabilitas Emosi' };
export const riasecDescMap = { R: 'Praktis', I: 'Analitis', A: 'Artistik', S: 'Sosial', E: 'Wirausaha', C: 'Konvensional' };