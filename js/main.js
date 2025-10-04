// =======================================================
// FILE: js/main.js (Controller Utama Kuis & Chat)
// =======================================================
import * as UX from './modules/ux-manager.js';
import * as QUIZ from './modules/quiz-logic.js';

// --- GLOBAL STATE ---
let currentQuestionIndex = 0;
const answers = {};
window.selectedPath = ''; 
let questionsToAsk = [];
let finalProfile = {};

// --- STATE BARU: Nama, Foto, dan Kunci Ulangi Tes ---
window.profilePhotoURL = localStorage.getItem('prakarsa_profile_photo') || null; 
window.userName = localStorage.getItem('prakarsa_user_name') || 'Anonim';
window.restartUnlockTime = localStorage.getItem('prakarsa_restart_unlock_time') ? new Date(localStorage.getItem('prakarsa_restart_unlock_time')) : null;

// --- GLOBAL STATE CHAT ---
window.chatStage = 0;
window.chatIsActive = false;
window.currentExpert = null; 

// --- TIMER INTERVALS ---
let restartUnlockTimer = null;
const EMAIL_TARGET = 'yulianorifal043@gmail.com'; // Email Target

// --- HANDLER FUNGSI FOTO & NAMA ---

/** Menangani proses upload foto dan menyimpan ke localStorage */
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { 
        alert("Ukuran file terlalu besar. Maksimal 2MB.");
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        window.profilePhotoURL = e.target.result;
        localStorage.setItem('prakarsa_profile_photo', window.profilePhotoURL); 
        document.getElementById('photo-status').classList.remove('hidden');
        document.getElementById('photo-status').textContent = 'Foto berhasil dimuat! Siap muncul di hasil.';
        if (!UX.DOM.resultArea.classList.contains('hidden')) {
            UX.renderSummary(finalProfile);
        }
    };
    reader.readAsDataURL(file);
}

/** Menangani input nama */
function handleNameInput(event) {
    const name = event.target.value.trim();
    window.userName = name || 'Anonim';
    localStorage.setItem('prakarsa_user_name', window.userName);
    if (!UX.DOM.resultArea.classList.contains('hidden')) {
        UX.renderSummary(finalProfile);
    }
}


// --- HANDLER QUIZ LOGIC ---

/** Menangani pemilihan jalur dan memulai kuis */
function handlePathSelection(event) {
    const nameInput = document.getElementById('user-name-input');
    if (!nameInput || !nameInput.value.trim()) {
        alert("Mohon masukkan nama Anda terlebih dahulu sebelum memulai tes!");
        nameInput.focus();
        return;
    }
    window.userName = nameInput.value.trim();
    localStorage.setItem('prakarsa_user_name', window.userName);
    
    const button = event.target.closest('.path-btn'); 
    if (!button) return;

    window.selectedPath = button.dataset.path;
    questionsToAsk = QUIZ.getQuestionsByPath(window.selectedPath);
    currentQuestionIndex = 0;

    UX.renderQuestion(
        questionsToAsk[currentQuestionIndex], 
        currentQuestionIndex, 
        questionsToAsk.length, 
        answers, 
        handleAnswer
    );
}

/** Menangani klik jawaban */
function handleAnswer(event) {
    const selectedValue = parseInt(event.target.dataset.value);
    const q = questionsToAsk[currentQuestionIndex];
    
    answers[q.id] = selectedValue;
    
    const currentQuestionContainer = event.target.closest('#question-container');
    currentQuestionContainer.querySelectorAll('.answer-btn').forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white', 'shadow-md', 'ring-2', 'ring-primary', 'transform', 'scale-[1.01]');
        btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-primary/10', 'dark:hover:bg-primary/20', 'hover:shadow-sm');
    });

    event.target.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300', 'hover:bg-primary/10', 'dark:hover:bg-primary/20', 'hover:shadow-sm');
    event.target.classList.add('bg-primary', 'text-white', 'shadow-md', 'ring-2', 'ring-primary', 'transform', 'scale-[1.01]');
    
    UX.DOM.nextButton.disabled = false;
}

/** Melanjutkan ke pertanyaan berikutnya atau melihat hasil */
function handleNext() {
    if (answers[questionsToAsk[currentQuestionIndex].id] === undefined) {
        return; 
    }
    
    if (currentQuestionIndex < questionsToAsk.length - 1) {
        currentQuestionIndex++;
        UX.renderQuestion(
            questionsToAsk[currentQuestionIndex], 
            currentQuestionIndex, 
            questionsToAsk.length, 
            answers, 
            handleAnswer
        );
    } else {
        processResults();
    }
}

/** Proses hasil akhir */
function processResults() {
    const scores = QUIZ.calculateScores(questionsToAsk, answers);
    finalProfile = QUIZ.getPersonalityProfile(scores, window.selectedPath, questionsToAsk);
    
    // Setel waktu kunci tombol "Ulangi Tes" jika belum ada atau sudah kedaluwarsa
    if (!window.restartUnlockTime || window.restartUnlockTime.getTime() < Date.now()) {
        const restartLockTime = new Date(Date.now() + 60 * 60 * 1000); // 1 jam dari sekarang
        window.restartUnlockTime = restartLockTime;
        localStorage.setItem('prakarsa_restart_unlock_time', restartLockTime.toISOString());
    }
    
    UX.renderSummary(finalProfile);
    checkRestartButtonLockStatus(); // Periksa status kunci tombol "Ulangi Tes"
}

/** Mengecek status kunci tombol "Ulangi Tes" dan mengaktifkan/menonaktifkan */
function checkRestartButtonLockStatus() {
    if (restartUnlockTimer) {
        clearInterval(restartUnlockTimer);
    }

    const now = Date.now();
    const unlockTime = window.restartUnlockTime ? window.restartUnlockTime.getTime() : 0;
    const restartButton = UX.DOM.restartButtonLocked;
    const restartCountdownSpan = UX.DOM.restartCountdown;

    if (!restartButton || !restartCountdownSpan) return;

    if (now < unlockTime) {
        // Tombol Ulangi Tes masih terkunci
        restartButton.disabled = true;
        restartButton.classList.add('opacity-50', 'cursor-not-allowed');
        restartButton.removeEventListener('click', restartQuiz);

        const updateCountdown = () => {
            const remainingTime = window.restartUnlockTime.getTime() - Date.now();
            if (remainingTime <= 0) {
                clearInterval(restartUnlockTimer);
                restartButton.disabled = false;
                restartButton.classList.remove('opacity-50', 'cursor-not-allowed');
                restartButton.innerHTML = '<i class="fas fa-sync-alt mr-2"></i> Ulangi Tes';
                restartButton.addEventListener('click', restartQuiz);
            } else {
                const minutes = Math.floor(remainingTime / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                restartCountdownSpan.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        };

        updateCountdown();
        restartUnlockTimer = setInterval(updateCountdown, 1000);

    } else {
        // Tombol Ulangi Tes sudah tidak terkunci
        restartButton.disabled = false;
        restartButton.classList.remove('opacity-50', 'cursor-not-allowed');
        restartButton.innerHTML = '<i class="fas fa-sync-alt mr-2"></i> Ulangi Tes';
        restartButton.addEventListener('click', restartQuiz);
    }
}


/** Menampilkan/menyembunyikan detail hasil (Tidak terkunci) */
function handleShowDetail() {
    UX.renderDetail(finalProfile);
}

/** Menangani share ke sosial media */
function handleShare() {
    const resultText = `Profil PRAKARSA ${window.userName}: ${finalProfile.typeName} (${finalProfile.oceanType}). Saya mendapat rekomendasi untuk ${finalProfile.recommendations.title.toLowerCase()}. Temukan potensi karir ideal Anda sekarang! #Prakarsa #TesKarir #PsikologiKarir`;
    const shareUrl = window.location.href.split('?')[0]; 

    if (navigator.share) {
        navigator.share({
            title: `Profil PRAKARSA ${window.userName}`,
            text: resultText,
            url: shareUrl,
        }).catch(console.error);
    } else {
        alert(`Salin teks ini dan bagikan:\n\n${resultText} ${shareUrl}`);
    }
}

/** Menangani unduh kartu hasil sebagai gambar (HTML2CANVAS) */
function handleDownload() {
    const captureElement = UX.DOM.resultCaptureArea; 

    const options = {
        scale: 2, 
        useCORS: true, 
        backgroundColor: null,
    };
    
    // Sembunyikan tombol sebelum capture
    UX.DOM.downloadResultButton.style.display = 'none';
    UX.DOM.showDetailButton.style.display = 'none';
    UX.DOM.shareSocialButton.style.display = 'none';
    UX.DOM.startChatButton.style.display = 'none';
    UX.DOM.restartButtonLocked.style.display = 'none';

    // Jika detail card terbuka, sembunyikan sementara untuk capture ringkasan
    const isDetailCardOpen = !UX.DOM.detailCard.classList.contains('hidden');
    if (isDetailCardOpen) {
        UX.DOM.detailCard.classList.add('hidden');
    }

    html2canvas(captureElement, options).then(canvas => {
        
        // Tampilkan kembali tombol
        UX.DOM.downloadResultButton.style.display = 'block'; 
        UX.DOM.showDetailButton.style.display = 'block';
        UX.DOM.shareSocialButton.style.display = 'block';
        UX.DOM.startChatButton.style.display = 'block';
        UX.DOM.restartButtonLocked.style.display = 'block'; 
        
        // Tampilkan kembali detail card jika sebelumnya terbuka
        if (isDetailCardOpen) {
            UX.DOM.detailCard.classList.remove('hidden');
        }

        const imageURL = canvas.toDataURL('image/png'); 
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `Prakarsa_Hasil_${window.userName.replace(/\s/g, '_')}_${Date.now()}.png`; 
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Kartu hasil Anda berhasil diunduh! Siap dibagikan di media sosial.');
    }).catch(error => {
        // Pastikan semua tombol kembali muncul jika ada error
        UX.DOM.downloadResultButton.style.display = 'block'; 
        UX.DOM.showDetailButton.style.display = 'block';
        UX.DOM.shareSocialButton.style.display = 'block';
        UX.DOM.startChatButton.style.display = 'block';
        UX.DOM.restartButtonLocked.style.display = 'block';
        if (isDetailCardOpen) {
            UX.DOM.detailCard.classList.remove('hidden');
        }
        console.error('Download Gagal:', error);
        alert('Gagal mengunduh kartu hasil. Silakan coba lagi.');
    });
}

/** Mereset aplikasi (kembali ke pemilihan jalur) */
function restartQuiz() {
    // Pastikan tombol tidak terkunci saat ini
    if (UX.DOM.restartButtonLocked.disabled) {
        alert("Mohon maaf, Anda tidak dapat mengulang tes saat ini. Silakan tunggu hingga hitungan mundur selesai.");
        return;
    }
    
    currentQuestionIndex = 0;
    Object.keys(answers).forEach(key => delete answers[key]);
    window.selectedPath = '';
    
    // Reset kunci tes ulang
    window.restartUnlockTime = null;
    localStorage.removeItem('prakarsa_restart_unlock_time');
    
    // Hapus timer jika ada
    if (restartUnlockTimer) clearInterval(restartUnlockTimer);

    UX.renderPathSelection(handlePathSelection);
}


// --- LOGIKA CHAT AHLI ---

/** Fungsi utama untuk merespons pesan user */
function handleChatResponse(userMessage) {
    if (!window.chatIsActive || window.chatStage >= 6) return;

    UX.setChatInputActive(false); // Sembunyikan input, tampilkan typing indicator
    UX.toggleTyping(true);

    const delay = Math.random() * 1500 + 1500; 

    setTimeout(() => {
        const response = QUIZ.generateExpertResponse(window.chatStage, userMessage, finalProfile);
        
        UX.addMessageToChat('expert', response.text, response.time);
        
        window.chatStage = response.nextStage; 
        
        UX.toggleTyping(false); // Sembunyikan typing indicator
        
        if (window.chatStage >= 6) {
            // Sesi selesai (setelah 5 balasan)
            UX.setChatInputActive(false); // Nonaktifkan input (sembunyikan area input)
            UX.toggleFeedbackPopup(true); // Tampilkan popup feedback
        } else {
            // Lanjutkan sesi
            UX.setChatInputActive(true); // Aktifkan input kembali
        }

    }, delay);
}

/** Menangani pengiriman pesan dari user */
function handleSendMessage() {
    const input = UX.DOM.userMessageInput;
    const message = input.value.trim();

    if (!message || !window.chatIsActive) return;

    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    UX.addMessageToChat('user', message, time);
    input.value = ''; 

    handleChatResponse(message);
}

/** Memulai dan menginisiasi chat modal */
function handleStartChat() {
    window.chatStage = 0;
    window.chatIsActive = true;
    UX.DOM.chatBody.innerHTML = '';
    UX.DOM.userMessageInput.value = '';
    UX.toggleFeedbackPopup(false);
    UX.setChatInputActive(true);
    
    // ** LOGIKA PEMILIHAN AHLI ONLINE **
    const availableExperts = QUIZ.getExperts(); 
    const randomIndex = Math.floor(Math.random() * availableExperts.length);
    window.currentExpert = availableExperts[randomIndex]; // Tetapkan ahli yang online
    
    UX.updateChatExpertHeader(window.currentExpert); // Update UI chat header
    UX.DOM.chatModalOverlay.classList.remove('hidden');

    handleChatResponse("INIT_START"); 
}

/** Menangani pengiriman feedback ke Gmail (Simulasi) */
function handleSendFeedback() {
    const message = UX.DOM.feedbackMessage.value;
    const recipient = 'yulianorifal043@gmail.com';
    const expertName = window.currentExpert ? window.currentExpert.name : 'Tim Ahli'; 
    const subject = `[KONSULTASI LANJUTAN] Dari ${window.userName} - Sesi dengan ${expertName}`;
    
    if (!message.trim()) {
        alert("Mohon isi pesan/kontak Anda untuk melanjutkan konsultasi.");
        return;
    }

    const body = `Pesan Lanjutan dari User:\n${message}\n\n---\nData Profil:\nNama: ${window.userName}\nTipe PRAKARSA: ${finalProfile.typeName} (${finalProfile.oceanType})\nFokus Tes: ${window.selectedPath}\nSesi Chat Akhir dengan: ${expertName}`;
    
    window.open(`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    
    UX.DOM.feedbackMessage.value = '';
    alert("Terima kasih! Email permintaan konsultasi lanjutan Anda sudah siap di aplikasi email Anda. Kami akan segera menghubungi Anda!");
    UX.DOM.feedbackPopup.classList.add('hidden');
}

/** Menangani pengiriman Early Adopter/Feedback dari form utama */
function handleSubmitAdopterFeedback() {
    const emailInput = document.getElementById('early-adopter-email');
    const messageInput = document.getElementById('early-adopter-message');
    const successMessage = document.getElementById('feedback-success-message');

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const expertName = "Landing Page"; // Sumber feedback

    if (!email || !email.includes('@') || !email.includes('.')) {
        alert("Mohon masukkan alamat email yang valid!");
        emailInput.focus();
        return;
    }

    const subject = `[EARLY ADOPTER - FEEDBACK] Dari ${window.userName} (${finalProfile.typeName})`;
    
    const body = `--- Pendaftaran User Pertama PRAKARSA ---\n\n` +
                 `Nama: ${window.userName}\n` +
                 `Email Kontak: ${email}\n` +
                 `Fokus Tes: ${window.selectedPath}\n\n` +
                 `Feedback Singkat: ${message || 'Tidak ada pesan.'}`;

    window.open(`mailto:${EMAIL_TARGET}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    
    // UI Feedback
    emailInput.disabled = true;
    messageInput.disabled = true;
    document.getElementById('submit-adopter-feedback').disabled = true;
    successMessage.classList.remove('hidden');
    alert("Terima kasih! Permintaan akses prioritas Anda sudah siap di aplikasi email Anda.");
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Set listeners for the initial modal
    if (UX.DOM.closeValidityWarningButton) UX.DOM.closeValidityWarningButton.addEventListener('click', () => {
        UX.DOM.validityWarningModalOverlay.classList.add('hidden');
    });
    if (UX.DOM.understoodWarningButton) UX.DOM.understoodWarningButton.addEventListener('click', () => {
        UX.DOM.validityWarningModalOverlay.classList.add('hidden');
    });

    // 1. Logika Input Nama dan Foto
    const photoInput = document.getElementById('profile-photo-input');
    const uploadButton = document.getElementById('upload-photo-button');
    const photoStatus = document.getElementById('photo-status');
    const nameInput = document.getElementById('user-name-input');
    
    if (nameInput) {
        nameInput.value = window.userName === 'Anonim' ? '' : window.userName;
        nameInput.addEventListener('input', handleNameInput);
    }

    if (uploadButton && photoInput) {
        uploadButton.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', handlePhotoUpload);
        
        if (window.profilePhotoURL) {
            photoStatus.classList.remove('hidden');
            photoStatus.textContent = 'Foto profil sudah siap!';
        }
    }
    
    // 2. Hubungkan tombol navigasi kuis dan hasil
    if (UX.DOM.nextButton) UX.DOM.nextButton.addEventListener('click', handleNext);
    if (UX.DOM.showDetailButton) UX.DOM.showDetailButton.addEventListener('click', handleShowDetail);
    if (UX.DOM.shareSocialButton) UX.DOM.shareSocialButton.addEventListener('click', handleShare);
    if (UX.DOM.downloadResultButton) UX.DOM.downloadResultButton.addEventListener('click', handleDownload);
    
    // 3. Hubungkan logika CHAT dan FEEDBACK UTAMA
    if (UX.DOM.startChatButton) UX.DOM.startChatButton.addEventListener('click', handleStartChat);
    if (UX.DOM.closeChatButton) UX.DOM.closeChatButton.addEventListener('click', () => UX.DOM.chatModalOverlay.classList.add('hidden'));
    
    if (UX.DOM.sendMessageButton) UX.DOM.sendMessageButton.addEventListener('click', handleSendMessage);
    if (UX.DOM.userMessageInput) {
        UX.DOM.userMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !UX.DOM.sendMessageButton.disabled) {
                handleSendMessage();
            }
        });
    }

    if (UX.DOM.sendFeedbackButton) UX.DOM.sendFeedbackButton.addEventListener('click', handleSendFeedback);
    if (document.getElementById('submit-adopter-feedback')) {
        document.getElementById('submit-adopter-feedback').addEventListener('click', handleSubmitAdopterFeedback);
    }
    
    // 4. Set state awal: Tampilkan Path Selection
    UX.renderPathSelection(handlePathSelection);
    
    // 5. Check status penguncian tombol restart saat load awal
    checkRestartButtonLockStatus();
});