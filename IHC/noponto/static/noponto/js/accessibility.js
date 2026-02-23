/**
 * NoPonto Accessibility Script
 * Handles themes, font size scaling, Text-to-Speech, and accessibility menu.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
});

function initAccessibility() {
    // 1. Initialize State from LocalStorage
    const savedTheme = localStorage.getItem('noponto-theme') || 'default';
    const savedFontSize = localStorage.getItem('noponto-font-size') || 'fs-medium';
    
    setTheme(savedTheme, false);
    applyFontSize(savedFontSize, false);

    // 2. Accessibility Menu Toggle Logic
    const trigger = document.getElementById('access-trigger');
    const panel = document.getElementById('access-panel');

    if (trigger && panel) {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            toggleMenu(!isExpanded);
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('show')) {
                toggleMenu(false);
            }
        });
    }

    function toggleMenu(open) {
        trigger.setAttribute('aria-expanded', open);
        trigger.classList.toggle('active', open);
        if (open) {
            panel.classList.add('show');
            panel.setAttribute('aria-hidden', 'false');
            // Basic focus trap: move focus to first button
            panel.querySelector('button')?.focus();
        } else {
            panel.classList.remove('show');
            panel.setAttribute('aria-hidden', 'true');
            trigger.focus();
        }
    }
}

/**
 * THEME LOGIC
 */
window.setTheme = function(theme, save = true) {
    document.body.classList.remove('dark-mode', 'high-contrast');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (theme === 'contrast') {
        document.body.classList.add('high-contrast');
    }

    if (save) {
        localStorage.setItem('noponto-theme', theme);
    }
};

/**
 * FONT SIZE LOGIC
 */
const fontSizeClasses = ['fs-small', 'fs-medium', 'fs-large', 'fs-xlarge'];

window.changeFontSize = function(direction) {
    const currentClass = Array.from(document.body.classList).find(c => fontSizeClasses.includes(c)) || 'fs-medium';
    let currentIndex = fontSizeClasses.indexOf(currentClass);

    if (direction === 0) {
        applyFontSize('fs-medium');
        return;
    }

    if (direction > 0 && currentIndex < fontSizeClasses.length - 1) {
        currentIndex++;
    } else if (direction < 0 && currentIndex > 0) {
        currentIndex--;
    }

    applyFontSize(fontSizeClasses[currentIndex]);
};

function applyFontSize(sizeClass, save = true) {
    fontSizeClasses.forEach(c => document.body.classList.remove(c));
    document.body.classList.add(sizeClass);
    if (save) {
        localStorage.setItem('noponto-font-size', sizeClass);
    }
}

/**
 * TEXT-TO-SPEECH (TTS) LOGIC
 */
let speechInstance = null;
const synth = window.speechSynthesis;

window.toggleTTS = function() {
    if (synth.speaking) {
        synth.cancel();
    }

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Remove any previous highlight
    mainContent.classList.remove('reading-active');
    
    // Get text, cleaning up whitespace
    const textToRead = mainContent.innerText.trim();
    
    if (textToRead) {
        speechInstance = new SpeechSynthesisUtterance(textToRead);
        speechInstance.lang = 'pt-BR';
        
        speechInstance.onstart = () => {
            mainContent.classList.add('reading-active');
        };

        speechInstance.onend = () => {
            mainContent.classList.remove('reading-active');
        };

        synth.speak(speechInstance);
    }
};

window.stopTTS = function() {
    if (synth.speaking) {
        synth.cancel();
    }
    document.getElementById('main-content')?.classList.remove('reading-active');
};
