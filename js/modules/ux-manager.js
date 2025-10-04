// =======================================================
// FILE: js/modules/ux-manager.js
// Mengelola tampilan dan interaksi DOM untuk test.html
// =======================================================
import { paths } from './data.js';

// --- DOM Elements ---
export const DOM = {
    // Sections
    pathSelectionArea: document.getElementById('path-selection-area'),
    quizArea: document.getElementById('quiz-area'),
    resultArea: document.getElementById('result-area'),
    
    // Path Selection
    pathOptionsDiv: document.getElementById('path-options'),
    
    // Quiz Elements
    questionContainer: document.getElementById('question-container'),
    nextButton: document.getElementById('next-button'),
    currentQSpan: document.getElementById('current-q'),
    totalQSpan: document.getElementById('total-q'),
    progressBar: document.getElementById('progress-bar'),
    quizTitleSpan: document.getElementById('quiz-title'),
    
    // Result Elements
    summaryCard: document.getElementById('summary-card'),
    resultCaptureArea: document.getElementById('result-capture-area'),
    detailCard: document.getElementById('detail-card'),
    detailContent: document.getElementById('detail-content'),
    showDetailButton: document.getElementById('show-detail-button'),
    shareSocialButton: document.getElementById('share-social-button'),
    downloadResultButton: document.getElementById('download-result-button'),
    
    // Tombol Ulangi Tes yang Terkunci
    restartButtonLocked: document.getElementById('restart-button-locked'), 
    restartCountdown: document.getElementById('restart-countdown'),

    // Chat Elements
    startChatButton: document.getElementById('start-chat-button'),
    chatModalOverlay: document.getElementById('chat-modal-overlay'),
    closeChatButton: document.getElementById('close-chat-button'),
    chatBody: document.getElementById('chat-body'),
    userMessageInput: document.getElementById('user-message-input'),
    sendMessageButton: document.getElementById('send-message-button'),
    chatInputArea: document.getElementById('chat-input-area'), // Input container

    // Expert Header Elements
    chatHeader: document.getElementById('chat-header'),
    expertPhoto: document.getElementById('expert-photo'),
    expertName: document.getElementById('expert-name'),
    expertTitle: document.getElementById('expert-title'),
    expertBadge: document.getElementById('expert-badge'),
    typingIndicator: document.getElementById('typing-indicator'),
    typingExpertName: document.getElementById('typing-expert-name'),

    // Element Modal Peringatan Validitas
    validityWarningModalOverlay: document.getElementById('validity-warning-modal-overlay'),
    closeValidityWarningButton: document.getElementById('close-validity-warning'),
    understoodWarningButton: document.getElementById('understood-warning-button'),

    // Feedback Chat
    feedbackPopup: document.getElementById('feedback-popup'),
    feedbackMessage: document.getElementById('feedback-message'),
    sendFeedbackButton: document.getElementById('send-feedback-button'),
};

/** Mengubah tampilan antar segmen di test.html */
export function changeView(targetId) { 
    const sections = [DOM.pathSelectionArea, DOM.quizArea, DOM.resultArea];
    sections.forEach(section => {
        if (section) {
            section.classList.add('hidden');
        }
    });

    const targetSection = DOM[targetId] || document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

export function renderPathSelection(handler) { 
    changeView('pathSelectionArea');

    DOM.pathOptionsDiv.innerHTML = paths.map(path => `
        <button data-path="${path.key}" 
                class="path-btn p-6 text-left rounded-2xl border-2 border-transparent hover:border-primary dark:hover:border-secondary transition duration-300 bg-card-light dark:bg-card-dark shadow-custom-light dark:shadow-custom-dark hover:shadow-2xl group transform hover:scale-[1.02] ease-in-out">
            
            <div class="icon-circle bg-icon-bg-light dark:bg-icon-bg-dark ${path.color} mb-4 shadow-lg">
                ${path.icon}
            </div>
            
            <span class="text-xl font-bold text-gray-900 dark:text-white block group-hover:text-primary dark:group-hover:text-secondary">${path.name}</span>
            <span class="text-sm text-gray-600 dark:text-gray-400 mt-2">${path.desc}</span>
        </button>
    `).join('');

    document.querySelectorAll('.path-btn').forEach(button => {
        button.addEventListener('click', handler);
    });
}

export function renderQuestion(question, index, total, answers, answerHandler) { 
    DOM.quizTitleSpan.textContent = `Fokus: ${paths.find(p => p.key === window.selectedPath).name}`;
    DOM.currentQSpan.textContent = index + 1;
    DOM.totalQSpan.textContent = total;
    
    const progress = (index / total) * 100;
    DOM.progressBar.style.width = `${progress}%`;

    const isAnswered = answers[question.id] !== undefined;

    DOM.questionContainer.innerHTML = `
        <p class="text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            ${index + 1}. ${question.text}
        </p>
        <div id="answer-options" class="grid grid-cols-2 md:grid-cols-5 gap-3">
        </div>
    `;

    const answerOptionsDiv = document.getElementById('answer-options');
    const labels = ["Sangat Tdk Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"];

    for (let i = 1; i <= 5; i++) {
        const isSelected = answers[question.id] === i;
        const buttonClass = isSelected 
            ? 'bg-primary text-white shadow-md ring-2 ring-primary transform scale-[1.01]' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20 hover:shadow-sm';

        answerOptionsDiv.innerHTML += `
            <button data-value="${i}" 
                    class="answer-btn p-3 rounded-lg border-2 border-transparent font-semibold transition duration-200 ${buttonClass}">
                ${labels[i-1]} 
            </button>
        `;
    }
    
    document.querySelectorAll('.answer-btn').forEach(button => {
        button.addEventListener('click', answerHandler);
    });

    DOM.nextButton.disabled = !isAnswered;
    DOM.nextButton.textContent = (index === total - 1) ? 'Lihat Hasil' : 'Selanjutnya';
    
    changeView('quizArea');
}

/** Merender tampilan hasil ringkas (Summary Card) dengan FOTO dan NAMA */
export function renderSummary(profile) {
    changeView('resultArea');
    
    const pathName = paths.find(p => p.key === window.selectedPath).name;
    const photoUrl = window.profilePhotoURL || 'https://via.placeholder.com/150/E6FFFA/2F855A?text=FP'; // Fallback Placeholder

    DOM.summaryCard.innerHTML = `
        <div class="flex flex-col items-center text-center p-4">
            <img src="${photoUrl}" alt="Foto Profil" class="profile-photo-large">
            
            <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-1">
                ${window.userName} <i class="fas fa-check-circle text-primary text-xl ml-1"></i>
            </h3>
            
            <p class="text-lg font-medium text-primary dark:text-secondary mb-3">${profile.typeName}</p>

            <p class="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mb-4">
                ${profile.description}
            </p>

            <div class="w-full flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-700 py-3 mt-3">
                <span><i class="fas fa-briefcase mr-1"></i> ${profile.oceanType}</span>
                ${profile.riasecCode ? `<span><i class="fas fa-code-branch mr-1"></i> ${profile.riasecCode}</span>` : ''}
            </div>
        </div>
    `;
    
    DOM.detailCard.classList.add('hidden');
    DOM.showDetailButton.innerHTML = '<i class="fas fa-file-alt mr-2"></i> Lihat Detail & Aksi Nyata';
}

export function renderDetail(profile) { 
    const recs = profile.recommendations;

    DOM.detailContent.innerHTML = `
        <h4 class="text-xl font-bold text-primary dark:text-secondary mb-3">${recs.title}</h4>
        <p class="text-gray-700 dark:text-gray-300 mb-6">${recs.primaryRec}</p>

        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-6">Aksi Nyata & Langkah Berikutnya:</h4>
        <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            ${recs.tips.map(tip => `<li class="border-b border-gray-100 dark:border-gray-700 pb-1">${tip}</li>`).join('')}
        </ul>

        <div class="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 rounded-lg">
            <p class="font-bold text-yellow-800 dark:text-yellow-300">📈 **Tarik Investor/HRD**: Laporan Psikometrik Lengkap (Skor Grafik Penuh) dan Analisis Komparatif tersedia di versi Premium.</p>
        </div>
    `;

    if (DOM.detailCard.classList.contains('hidden')) {
        DOM.detailCard.classList.remove('hidden');
        DOM.showDetailButton.innerHTML = '<i class="fas fa-chevron-circle-up mr-2"></i> Sembunyikan Detail';
    } else {
        DOM.detailCard.classList.add('hidden');
        DOM.showDetailButton.innerHTML = '<i class="fas fa-file-alt mr-2"></i> Lihat Detail & Aksi Nyata';
    }
}

/** Memperbarui header chat dengan detail Ahli yang dipilih */
export function updateChatExpertHeader(expert) {
    if (DOM.expertPhoto) DOM.expertPhoto.src = expert.photoUrl;
    if (DOM.expertName) DOM.expertName.textContent = expert.name;
    if (DOM.expertTitle) DOM.expertTitle.textContent = expert.title;
    if (DOM.expertBadge) DOM.expertBadge.textContent = expert.badge;
    if (DOM.typingExpertName) DOM.typingExpertName.textContent = expert.name.split(' ')[0];
}

/** Menambahkan pesan ke chat body */
export function addMessageToChat(sender, text, time) {
    const isUser = sender === 'user';
    const align = isUser ? 'text-right' : 'text-left';
    const bg = isUser ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-700';

    const messageHTML = `
        <div class="${align}">
            <div class="inline-block px-4 py-2 ${bg} rounded-xl shadow-sm max-w-xs">
                <p class="text-sm font-medium whitespace-pre-wrap">${text}</p>
                <span class="text-xs text-gray-500 dark:text-gray-400 block mt-1">${time}</span>
            </div>
        </div>
    `;
    DOM.chatBody.innerHTML += messageHTML;
    DOM.chatBody.scrollTop = DOM.chatBody.scrollHeight;
}

/** Menampilkan/menyembunyikan animasi mengetik */
export function toggleTyping(show) {
    DOM.typingIndicator.classList.toggle('hidden', !show);
}

/** Menampilkan/menyembunyikan form feedback */
export function toggleFeedbackPopup(show) {
    DOM.feedbackPopup.classList.toggle('hidden', !show);
}

/** Mengatur status input chat (aktif/nonaktif) */
export function setChatInputActive(active) {
    if (active) {
        DOM.chatInputArea.classList.remove('hidden'); // Tampilkan area input
        DOM.feedbackPopup.classList.add('hidden'); // Sembunyikan feedback
        DOM.userMessageInput.disabled = false;
        DOM.sendMessageButton.disabled = false;
        DOM.userMessageInput.placeholder = "Tulis pesan Anda...";
    } else {
        // Nonaktif
        DOM.userMessageInput.disabled = true;
        DOM.sendMessageButton.disabled = true;
        DOM.userMessageInput.placeholder = "Percakapan selesai.";
    }
}