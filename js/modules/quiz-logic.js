// =======================================================
// FILE: js/modules/quiz-logic.js
// Mengelola scoring, profiling, dan rekomendasi + Skrip Chat Ahli
// =======================================================
import { oceanQuestions, riasecQuestions, oceanDescMap, riasecDescMap, experts } from './data.js';

const scores = { O: 0, C: 0, E: 0, A: 0, N: 0, R: 0, I: 0, S: 0, E_R: 0, C_R: 0 }; 

export function getQuestionsByPath(path) {
    if (['job', 'study', 'business', 'style'].includes(path)) {
        return oceanQuestions.concat(riasecQuestions);
    }
    return oceanQuestions;
}

export function getExperts() {
    return experts;
}

export function calculateScores(questionsToAsk, answers) {
    Object.keys(scores).forEach(key => scores[key] = 0);
    
    questionsToAsk.forEach(q => {
        const answerValue = answers[q.id];
        let scoreToAdd = q.reverse ? (6 - answerValue) : answerValue;
        
        if (q.type === 'OCEAN') {
            scores[q.dimension] += scoreToAdd;
        } else if (q.type === 'RIASEC') {
            const riasecKey = q.dimension === 'E' ? 'E_R' : (q.dimension === 'C' ? 'C_R' : q.dimension);
            scores[riasecKey] += scoreToAdd;
        }
    });

    return scores;
}

export function getPersonalityProfile(allScores, selectedPath, questionsToAsk) {
    const oceanScores = { O: allScores.O, C: allScores.C, E: allScores.E, A: allScores.A, N: allScores.N };
    const dominantOcean = Object.keys(oceanScores).sort((a, b) => oceanScores[b] - oceanScores[a]);
    const d1 = dominantOcean[0];
    const d2 = dominantOcean[1];
    
    let oceanType = `${d1}${d2}`;
    let typeName = '';
    let description = '';
    
    if (d1 === 'C' && d2 === 'O') { typeName = "Inovator Terstruktur"; description = "Anda adalah pemikir yang sangat disiplin dalam merencanakan inovasi dan ide orisinal. Kekuatan Anda adalah mewujudkan visi dengan presisi."; }
    else if (d1 === 'E' && d2 === 'A') { typeName = "Kolaborator Berpengaruh"; description = "Anda unggul dalam membangun hubungan dan memimpin tim melalui empati dan energi sosial yang tinggi. Anda adalah pusat koneksi dalam organisasi."; }
    else if (d1 === 'N' && d2 === 'O') { typeName = "Pencari Makna Sensitif"; description = "Anda memiliki kedalaman kreativitas dan kepekaan yang tinggi, ideal untuk pekerjaan artistik mendalam atau penelitian yang membutuhkan intuisi."; }
    else { typeName = "Aktor Adaptif"; description = "Profil Anda menunjukkan fleksibilitas karir yang tinggi. Anda cepat beradaptasi dengan perubahan, namun perlu fokus pada satu bidang untuk spesialisasi."; }

    let riasecCode = '';
    if (questionsToAsk.length > oceanQuestions.length) {
        const riasecRaw = { R: allScores.R, I: allScores.I, A: allScores.A, S: allScores.S, E: allScores.E_R, C: allScores.C_R };
        riasecCode = Object.keys(riasecRaw).sort((a, b) => riasecRaw[b] - riasecRaw[a]).slice(0, 3).join('');
    }

    const recs = getRecommendationsByPath(selectedPath, oceanType, riasecCode);

    return { oceanType, typeName, description, riasecCode, recommendations: recs };
}

function getRecommendationsByPath(path, oceanType, riasecCode) {
    const recs = { title: '', primaryRec: '', tips: [] };
    
    const getOceanDesc = (dim) => oceanDescMap[dim] || 'Unik';
    const getRiasecDesc = (dim) => riasecDescMap[dim] || 'Spesifik';

    switch (path) {
        case 'job':
            recs.title = `Rekomendasi Peran Kerja Ideal`;
            recs.primaryRec = `Anda sangat cocok di posisi yang menuntut **${getRiasecDesc(riasecCode[0])}** dan fokus pada bidang **${getOceanDesc(oceanType[0])}**. Posisi seperti Analis Data, Manajer Proyek, atau Konsultan sangat ideal.`;
            recs.tips = [`Fokus pada pekerjaan yang memiliki korelasi kode minat **${riasecCode}** yang tinggi.`, `Asah skill **${getOceanDesc(oceanType[0])}** Anda untuk negosiasi dan presentasi yang efektif.`, "Cari perusahaan dengan budaya kerja yang menghargai tipe kepribadian Anda untuk pertumbuhan optimal."];
            break;
        case 'business':
            recs.title = `Analisis Potensi Bisnis & Kewirausahaan`;
            recs.primaryRec = (oceanType[0] === 'E') 
                ? "Anda memiliki **kepemimpinan yang natural** dan berani mengambil risiko. Fokus di Business Development atau menjadi Founder yang berhadapan langsung dengan pasar." 
                : "Anda memiliki pendekatan **strategis dan analitis** dalam bisnis. Kekuatan Anda ada pada bisnis berbasis solusi, teknologi, atau konsultasi. Pertimbangkan mencari Co-founder yang memiliki jiwa ekstrovert.";
            recs.tips = [`Kuatkan visi dan rencana bisnis berbasis kekuatan **${getOceanDesc(oceanType[0])}** Anda.`, `Pelajari manajemen risiko finansial dan operasional secara mendalam.`, "Kembangkan kemampuan *networking* Anda secara terstruktur untuk peluang kolaborasi."];
            break;
        case 'style':
            recs.title = `Gaya Kerja & Lingkungan Optimal`;
            recs.primaryRec = (oceanType[0] === 'C' && oceanType[1] === 'O') 
                ? "Ideal untuk Anda adalah **lingkungan Hybrid atau Kantoran**. Anda membutuhkan struktur yang jelas dan interaksi tim yang terencana. Hindari lingkungan kerja yang terlalu bebas atau tanpa panduan."
                : (oceanType[0] === 'E') ? "Ideal: **Kantoran** atau **Freelance Proyek** dengan banyak interaksi. Anda butuh interaksi sosial rutin. Waspada terhadap isolasi jika bekerja remote penuh." : "Ideal: **Remote** atau **Freelance** dengan fleksibilitas. Anda butuh fokus dan fleksibilitas waktu. Penting untuk menetapkan jadwal kerja yang ketat untuk diri sendiri.";
            recs.tips = [`Sesuaikan ruang kerja Anda agar menunjang **fokus** dan **produktivitas** sesuai gaya Anda.`, `Jadwalkan interaksi sosial rutin jika bekerja remote untuk menjaga keseimbangan.`, "Manajemen waktu yang ketat adalah kunci keberhasilan Anda, terlepas dari gaya kerja."];
            break;
        case 'study':
            recs.title = `Saran Jurusan Kuliah & Pendidikan Lanjutan`;
            recs.primaryRec = `Minat utama Anda ada di bidang **${getRiasecDesc(riasecCode[0])}** dan **${getRiasecDesc(riasecCode[1])}**. Bidang studi yang menjanjikan kesenangan dan keberhasilan akademik mencakup: Ilmu Komputer, Psikologi, Desain Produk, atau Bisnis Internasional.`;
            recs.tips = [`Prioritaskan jurusan yang sesuai dengan kode minat **${riasecCode}** Anda.`, "Cek fokus riset dan proyek kampus yang Anda minati.", "Pertimbangkan program magang yang relevan sejak semester awal untuk pengalaman praktis."];
            break;
        case 'skill':
            recs.title = `Saran Pengembangan Diri & Skill`;
            recs.primaryRec = (oceanType[0] === 'O') 
                ? "Fokus pada Skill **Kreatif, Abstrak, dan Pemecahan Masalah** (misalnya Coding, UI/UX Design, Berpikir Kritis, Penulisan Kreatif)."
                : "Fokus pada Skill **Terstruktur, Disiplin, dan Sosial** (misalnya Public Speaking, Manajemen Proyek, Analisis Finansial, Kepemimpinan Tim).";
            recs.tips = ["Coba kursus atau workshop di luar zona nyaman Anda untuk memperluas wawasan.", "Cari mentor dengan kelebihan yang berbeda untuk mendapatkan perspektif baru.", "Review hasil tes Anda setiap 6 bulan untuk melihat progres dan menyesuaikan tujuan."];
            break;
    }
    return recs;
}

// --- LOGIKA CHAT AHLI ---

/** Skrip Percakapan Ahli (5 Sesi Kontekstual) */
export function generateExpertResponse(stage, userMessage, profile) {
    const expert = window.currentExpert; 
    const expertName = expert ? expert.name.split(' ')[0] : 'Ahli';
    const profileType = profile.oceanType;
    const user = window.userName.split(' ')[0];

    // Helper: Balasan pembuka yang kontekstual
    const getContextualFeedback = (message) => {
        if (message.toLowerCase().includes('tidak') || message.toLowerCase().includes('ragu') || message.toLowerCase().includes('kurang')) {
            return `Saya mengerti ${user}, hasil objektif kadang bisa berbeda dengan pandangan subjektif kita. Mari kita telaah lebih dalam...`;
        }
        if (message.toLowerCase().includes('sesuai') || message.toLowerCase().includes('iya') || message.toLowerCase().includes('benar')) {
            return `Luar biasa ${user}! Itu tandanya Anda memiliki kesadaran diri yang tinggi. Mari kita bedah mengapa...`;
        }
        return `Menarik sekali jawaban Anda, ${user}. Jawaban ini menunjukkan ${oceanDescMap[profileType[0]].toLowerCase()} Anda.`;
    };

    switch (stage) {
        case 0:
            return {
                text: `Halo ${user}, saya **${expertName}**, ${expert.badge} PRAKARSA. Selamat, Anda mendapatkan profil **${profile.typeName}**! Apakah hasil ini resonan (sesuai) dengan pandangan Anda saat ini, ${user}?`,
                nextStage: 1
            };
        case 1:
            const recTitle = profile.recommendations.title.toLowerCase();
            return {
                text: `${getContextualFeedback(userMessage)} Sesuai dengan fokus *${window.selectedPath.toUpperCase()}*, kami melihat Anda memiliki dorongan kuat di bidang ${recTitle}. Apa yang **paling memotivasi** Anda untuk mengejar bidang itu?`,
                nextStage: 2
            };
        case 2:
            const coreDimension = oceanDescMap[profileType[0]];
            const userKeyword = userMessage.toLowerCase().split(' ').slice(0, 3).join(' '); 
            
            let responseText = `Motivasi **${userKeyword}** itu luar biasa, ${user}. Ini menunjukkan tingginya skor pada dimensi **${coreDimension}** Anda. `;
            responseText += `Namun, kami perlu tahu: Apa **tantangan terbesar** Anda dalam seminggu terakhir yang berhubungan dengan **${coreDimension}**?`;
            
            return { text: responseText, nextStage: 3 };

        case 3:
            const firstTip = profile.recommendations.tips[0].split('.')[0].toLowerCase();
            responseText = `Saya memahami tantangan **${userMessage.toLowerCase().split(' ').slice(0, 3).join(' ')}** itu sangat *real*! Tantangan adalah tempat kekuatan kita akan diuji. `;
            responseText += `Sebagai langkah awal praktis, saya sarankan Anda fokus pada: **${firstTip}**. Apakah Anda memiliki rencana untuk mengaplikasikannya minggu ini?`;
            
            return { text: responseText, nextStage: 4 };

        case 4:
            responseText = `Komitmen Anda untuk **${userMessage.toLowerCase().split(' ').slice(0, 4).join(' ')}** sangat saya hargai, ${user}. Itu adalah *mindset* yang tepat! `;
            responseText += `Untuk melengkapinya, sebagai sesi terakhir: Apa **satu pertanyaan paling penting** yang ingin Anda ajukan tentang masa depan karir Anda?`;
            
            return { text: responseText, nextStage: 5 };

        case 5:
            const finalReply = `Terima kasih banyak ${user}. Pertanyaan Anda tentang **${userMessage.toLowerCase().split(' ').slice(0, 5).join(' ')}** sangat kritis! `;
            
            responseText = `${finalReply}\n\nSesi konsultasi **5 sesi** telah selesai. Silakan gunakan formulir *feedback* di bawah untuk melanjutkan pembicaraan. Saya tunggu kabar dari Anda!`;
            
            return { text: responseText, nextStage: 6 }; 

        default:
            return {
                text: `Mohon maaf ${user}, sesi konsultasi dengan **${expertName}** telah selesai. Kami mohon Anda gunakan formulir *feedback* di bawah.`,
                nextStage: stage
            };
    }
}