// =======================================================
// FILE: js/hrd-main.js
// Logika HRD Dashboard
// =======================================================

const DOM = {
    participantIdInput: document.getElementById('participant-id-input'),
    searchParticipantButton: document.getElementById('search-participant-button'),
    participantResultCard: document.getElementById('participant-result-card'),
    searchMessage: document.getElementById('search-message'),
    reportName: document.getElementById('report-name'),
    reportType: document.getElementById('report-type'),
    reportRiasec: document.getElementById('report-riasec'),
};

const participantDatabase = {
    'PKS-001': { name: 'Ali Akbar (Calon Pegawai)', type: 'C-O: Inovator Terstruktur', riasec: 'IRA' },
    'PKS-002': { name: 'Budi Santoso (Calon Siswa Kuliah)', type: 'E-A: Kolaborator Berpengaruh', riasec: 'SEC' },
    'PKS-003': { name: 'Citra Dewi (Internal Karyawan)', type: 'N-O: Pencari Makna Sensitif', riasec: 'AEC' },
};

function handleSearchParticipant() {
    const id = DOM.participantIdInput.value.toUpperCase().trim();
    const result = participantDatabase[id];

    DOM.searchMessage.classList.add('hidden');
    DOM.participantResultCard.classList.add('hidden');

    if (result) {
        DOM.reportName.textContent = result.name;
        DOM.reportType.textContent = result.type;
        DOM.reportRiasec.textContent = result.riasec;
        DOM.participantResultCard.classList.remove('hidden');
    } else {
        DOM.searchMessage.classList.remove('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (DOM.searchParticipantButton) DOM.searchParticipantButton.addEventListener('click', handleSearchParticipant);
});