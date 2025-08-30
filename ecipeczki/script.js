document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');

    // Przyciski
    const btnYes1 = document.getElementById('btn-yes-1');
    const btnNo1 = document.getElementById('btn-no-1');
    const optionButtons = document.querySelectorAll('.btn-option');
    const btnSearch = document.getElementById('btn-search');
    const btnYes2 = document.getElementById('btn-yes-2');
    const btnNo2 = document.getElementById('btn-no-2');
    const btnGoToChat = document.getElementById('btn-goto-chat');

    // progressbar
    const progressBar = document.getElementById('bar');
    const progressInfo = document.getElementById('info-progressbar');

    // video
    const video1 = document.getElementById('video-1');
    const fullscreenContainer = document.getElementById('fullscreen-video-container');
    const video2 = document.getElementById('video-2');

    let selectedCategory = '';

    function showPage(pageId) {
        pages.forEach(page => {
            if (page.id === pageId) {
                page.classList.remove('hidden');
            } else {
                page.classList.add('hidden');
            }
        });
    }

    // --- Strona 1 ---
    btnYes1.addEventListener('click', () => {
        showPage('page-2');
    });

    btnNo1.addEventListener('click', () => {
        btnNo1.style.display = 'none'; // Ukrywa przycisk "Nie"
    });

    // --- Strona 2 ---
    optionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            selectedCategory = event.target.innerText;
            showPage('page-3');
        });
    });

    // --- Strona 3 ---
    btnSearch.addEventListener('click', startProgress);

    function startProgress() {
        btnSearch.disabled = true;
        btnSearch.style.opacity = '0.5';

        const messages = [
            "Łączenie z bazą danych...",
            "Połączono!",
            `Wybieranie tylko osób z kategorii '${selectedCategory}'...`,
            "Znaleziono użytkownika!",
            "Łączenie z użytkownikiem..."
        ];

        let currentStep = 0;
        
        const updateStep = () => {
            if (currentStep < messages.length) {
                progressInfo.innerText = messages[currentStep];
                progressBar.style.width = `${(currentStep + 1) * 20}%`;
                currentStep++;
                setTimeout(updateStep, 2000);
            } else {
                setTimeout(() => showPage('page-4'), 500);
            }
        };
        
        updateStep();
    }

    // --- Strona 4 ---
    btnYes2.addEventListener('click', () => {
        showPage('page-5');
        video1.play().catch(error => console.log("Autoodtwarzanie zablokowane:", error));
    });
    
    btnNo2.addEventListener('click', () => {
        btnNo2.style.display = 'none';
    });

    // --- Strona 5 ---
    btnGoToChat.addEventListener('click', () => {
        video1.pause();
        fullscreenContainer.classList.remove('hidden');
        video2.play();

        if (fullscreenContainer.requestFullscreen) {
            fullscreenContainer.requestFullscreen();
        } else if (fullscreenContainer.webkitRequestFullscreen) {
            fullscreenContainer.webkitRequestFullscreen();
        } else if (fullscreenContainer.msRequestFullscreen) {
            fullscreenContainer.msRequestFullscreen();
        }
    });

    showPage('page-1');
});