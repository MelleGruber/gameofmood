// Passwortschutz - WICHTIG: Ändere das Passwort hier!
const FIXED_PASSWORD = "blablabla08"; // <-- HIER DEIN PASSWORT EINTRAGEN

function checkPassword() {
    const isAuthenticated = sessionStorage.getItem('bipolar_authenticated');

    // Wenn bereits in dieser Session authentifiziert
    if (isAuthenticated === 'true') {
        showMainContent();
        return;
    }

    // Immer Login-Formular anzeigen
    showPasswordLogin();
}

function showPasswordLogin() {
    const overlay = document.getElementById('password-overlay');
    const loginDiv = document.getElementById('password-login');

    overlay.style.display = 'flex';
    loginDiv.style.display = 'block';

    document.getElementById('login-form').onsubmit = function(e) {
        e.preventDefault();
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');

        if (password === FIXED_PASSWORD) {
            sessionStorage.setItem('bipolar_authenticated', 'true');
            showMainContent();
        } else {
            errorDiv.textContent = 'Falsches Passwort.';
            errorDiv.style.display = 'block';
            document.getElementById('login-password').value = '';
        }
    };
}

function showMainContent() {
    document.getElementById('password-overlay').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    initializeApp();
}

// Navigation zwischen Manie und Depression
document.addEventListener('DOMContentLoaded', function() {
    checkPassword();
});

function initializeApp() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');

            // Navigation Buttons aktualisieren
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Content Sections aktualisieren
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // Upload-Funktionalität initialisieren
    initializeUploadFunctionality();

    // Gespeicherte Nachrichten laden
    loadSavedMessages();

    // Checkbox-Funktionalität initialisieren
    initializeCheckboxes();
}

function initializeUploadFunctionality() {
    const uploadButtons = document.querySelectorAll('.upload-btn');

    uploadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const section = this.closest('.content-section').id;
            handleUpload(type, section);
        });
    });

    // Drag & Drop Funktionalität
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', handleDragOver);
        area.addEventListener('drop', handleDrop);
        area.addEventListener('dragleave', handleDragLeave);
    });
}

function handleUpload(type, section) {
    const uploadArea = document.getElementById(`${section}-upload`);

    if (type === 'text') {
        showTextInput(uploadArea, section);
    } else {
        const input = document.createElement('input');
        input.type = 'file';

        switch(type) {
            case 'audio':
                input.accept = 'audio/*';
                break;
            case 'image':
                input.accept = 'image/*';
                break;
            case 'video':
                input.accept = 'video/*';
                break;
        }

        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                handleFileUpload(file, section, type);
            }
        };

        input.click();
    }
}

function showTextInput(uploadArea, section) {
    const existingInput = uploadArea.querySelector('.text-input-area');
    if (existingInput) {
        existingInput.remove();
    }

    const textInputDiv = document.createElement('div');
    textInputDiv.className = 'text-input-area';
    textInputDiv.style.display = 'block';

    textInputDiv.innerHTML = `
        <textarea placeholder="Schreibe deine Nachricht hier..."></textarea>
        <button class="save-btn">Speichern</button>
    `;

    uploadArea.appendChild(textInputDiv);

    const saveBtn = textInputDiv.querySelector('.save-btn');
    const textarea = textInputDiv.querySelector('textarea');

    saveBtn.addEventListener('click', function() {
        const text = textarea.value.trim();
        if (text) {
            saveMessage(section, 'text', text);
            textInputDiv.remove();
        }
    });

    textarea.focus();
}

function handleFileUpload(file, section, type) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const fileData = {
            name: file.name,
            type: type,
            data: e.target.result,
            size: file.size
        };

        saveMessage(section, type, fileData);
    };

    if (type === 'audio' || type === 'video') {
        reader.readAsDataURL(file);
    } else if (type === 'image') {
        reader.readAsDataURL(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    this.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        const section = this.id.replace('-upload', '');

        let type = 'file';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('audio/')) type = 'audio';
        else if (file.type.startsWith('video/')) type = 'video';

        handleFileUpload(file, section, type);
    }
}

function saveMessage(section, type, content) {
    const messages = getStoredMessages(section);

    const newMessage = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('de-DE'),
        type: type,
        content: content
    };

    messages.push(newMessage);
    localStorage.setItem(`${section}_messages`, JSON.stringify(messages));

    displayMessages(section);

    // Erfolgs-Feedback
    showFeedback('Nachricht gespeichert!', 'success');
}

function getStoredMessages(section) {
    const stored = localStorage.getItem(`${section}_messages`);
    return stored ? JSON.parse(stored) : [];
}

function loadSavedMessages() {
    displayMessages('manie');
    displayMessages('depression');
}

function displayMessages(section) {
    const messagesContainer = document.getElementById(`${section}-messages`);
    const messages = getStoredMessages(section);

    if (messages.length === 0) {
        messagesContainer.innerHTML = '<p>[Hier werden deine persönlichen Nachrichten angezeigt]</p>';
        return;
    }

    let html = '';
    messages.forEach(message => {
        html += createMessageHTML(message);
    });

    messagesContainer.innerHTML = html;
}

function createMessageHTML(message) {
    let contentHTML = '';

    switch(message.type) {
        case 'text':
            contentHTML = `<div class="message-content">${escapeHtml(message.content)}</div>`;
            break;
        case 'image':
            contentHTML = `
                <div class="message-content">Bild: ${message.content.name}</div>
                <img src="${message.content.data}" alt="Hochgeladenes Bild" class="message-media" style="max-width: 300px;">
            `;
            break;
        case 'audio':
            contentHTML = `
                <div class="message-content">Audio: ${message.content.name}</div>
                <audio controls class="message-media">
                    <source src="${message.content.data}" type="audio/*">
                    Dein Browser unterstützt kein Audio-Element.
                </audio>
            `;
            break;
        case 'video':
            contentHTML = `
                <div class="message-content">Video: ${message.content.name}</div>
                <video controls class="message-media" style="max-width: 400px;">
                    <source src="${message.content.data}" type="video/*">
                    Dein Browser unterstützt kein Video-Element.
                </video>
            `;
            break;
    }

    return `
        <div class="message-item" data-message-id="${message.id}">
            <div class="message-timestamp">${message.timestamp}</div>
            ${contentHTML}
            <button class="delete-btn" onclick="deleteMessage('${message.id}', '${document.querySelector('.content-section.active').id}')" style="float: right; background: #6c757d; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 0.75rem;">Löschen</button>
        </div>
    `;
}

function deleteMessage(messageId, section) {
    const messages = getStoredMessages(section);
    const filteredMessages = messages.filter(msg => msg.id != messageId);

    localStorage.setItem(`${section}_messages`, JSON.stringify(filteredMessages));
    displayMessages(section);

    showFeedback('Nachricht gelöscht!', 'info');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 0.75rem 1.5rem;
        background: ${type === 'success' ? '#495057' : '#6c757d'};
        color: white;
        border-radius: 4px;
        z-index: 1000;
        font-size: 0.9rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    feedback.textContent = message;

    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        feedback.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 3000);
}

function initializeCheckboxes() {
    // Frühwarnzeichen-Checkboxen (werden nicht gespeichert)
    const warningCheckboxes = document.querySelectorAll('input[type="checkbox"][data-section]');
    warningCheckboxes.forEach(checkbox => {
        // Checkboxen immer leer starten (keine Speicherung)
        checkbox.checked = false;

        // Event Listener für Änderungen
        checkbox.addEventListener('change', function() {
            const section = this.getAttribute('data-section');
            // Warnsystem aktualisieren
            updateWarningSystem(section);
        });
    });

    // Persistente Checkboxen (werden gespeichert)
    const persistentCheckboxes = document.querySelectorAll('input[type="checkbox"][data-storage]');
    persistentCheckboxes.forEach(checkbox => {
        const storageKey = checkbox.getAttribute('data-storage');
        const checkboxId = checkbox.id;
        
        // Gespeicherten Zustand laden
        const savedState = localStorage.getItem(`${storageKey}_${checkboxId}`);
        if (savedState === 'true') {
            checkbox.checked = true;
        }

        // Event Listener für Speicherung
        checkbox.addEventListener('change', function() {
            localStorage.setItem(`${storageKey}_${checkboxId}`, this.checked);
        });
    });

    // Warnsysteme initial aktualisieren
    updateWarningSystem('manie');
    updateWarningSystem('depression');
}

function updateWarningSystem(section) {
    const checkboxes = document.querySelectorAll(`input[type="checkbox"][data-section="${section}"]`);
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const totalCount = checkboxes.length;
    const percentage = (checkedCount / totalCount) * 100;

    const statusElement = document.getElementById(`${section}-status`);
    const statusElementBottom = document.getElementById(`${section}-status-bottom`);

    // Status zurücksetzen für beide Elemente
    [statusElement, statusElementBottom].forEach(element => {
        if (element) {
            element.className = 'warning-status';
            element.style.display = 'block';
        }
    });

    let content = '';
    let className = 'warning-status';

    if (percentage === 0) {
        [statusElement, statusElementBottom].forEach(element => {
            if (element) element.style.display = 'none';
        });
        return;
    } else if (percentage < 30) {
        className = 'warning-status safe';
        content = `${checkedCount} von ${totalCount} Frühwarnzeichen - Weiter beobachten (${Math.round(percentage)}%).`;
    } else if (percentage < 50) {
        className = 'warning-status warning';
        content = `${checkedCount} von ${totalCount} Frühwarnzeichen - Gespräch zu Kontaktperson suchen (${Math.round(percentage)}%).`;
    } else {
        className = 'warning-status danger';
        content = `
            <strong>🚨 ACHTUNG!</strong><br>
            ${checkedCount} von ${totalCount} Frühwarnzeichen - <strong>Gegenmaßnahmen einleiten!</strong> (${Math.round(percentage)}%)<br>
            <a onclick="scrollToMeasures('${section}')" style="color: #721c24; text-decoration: underline; cursor: pointer; font-weight: bold;">Zu den Maßnahmen</a> | 
            <a onclick="scrollToReasons('${section}')" style="color: #721c24; text-decoration: underline; cursor: pointer;">Gründe nachlesen</a>
        `;
    }

    // Inhalt für beide Elemente setzen
    [statusElement, statusElementBottom].forEach(element => {
        if (element) {
            element.className = className;
            element.innerHTML = content;
        }
    });
}


function scrollToReasons(section) {
    // Erst zur richtigen Sektion wechseln
    if (!document.getElementById(section).classList.contains('active')) {
        const targetButton = document.querySelector(`[data-section="${section}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }

    // Dann zum entsprechenden Bereich scrollen
    setTimeout(() => {
        const reasonsSection = document.querySelector(`#${section} .subsection:nth-child(3) h3`);
        if (reasonsSection) {
            reasonsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            reasonsSection.style.backgroundColor = '#fff3cd';
            setTimeout(() => {
                reasonsSection.style.backgroundColor = '';
            }, 2000);
        }
    }, 100);
}

function scrollToMeasures(section) {
    // Erst zur richtigen Sektion wechseln
    if (!document.getElementById(section).classList.contains('active')) {
        const targetButton = document.querySelector(`[data-section="${section}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }

    // Dann zum entsprechenden Bereich scrollen
    setTimeout(() => {
        const measuresSection = document.querySelector(`#${section} .subsection:nth-child(4) h3`);
        if (measuresSection) {
            measuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            measuresSection.style.backgroundColor = '#fff3cd';
            setTimeout(() => {
                measuresSection.style.backgroundColor = '';
            }, 2000);
        }
    }, 100);
}

function scrollToKontaktpersonen() {
    const kontaktpersonenSection = document.getElementById('manie-contacts');
    if (kontaktpersonenSection) {
        kontaktpersonenSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Kurze Hervorhebung
        kontaktpersonenSection.style.backgroundColor = '#fff3cd';
        setTimeout(() => {
            kontaktpersonenSection.style.backgroundColor = '';
        }, 2000);
    }
}

// Schnellnavigation Funktionen
function toggleQuickNav() {
    const content = document.getElementById('quick-nav-content');
    const isVisible = content.style.display === 'block';
    content.style.display = isVisible ? 'none' : 'block';
}

function scrollToSection(sectionType, subsection) {
    // Erst zur richtigen Sektion wechseln
    const targetButton = document.querySelector(`[data-section="${sectionType}"]`);
    if (targetButton && !document.getElementById(sectionType).classList.contains('active')) {
        targetButton.click();
    }

    // Kurz warten und dann zum Unterabschnitt scrollen
    setTimeout(() => {
        const targetId = `${sectionType}-${subsection}`;
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Kurze Hervorhebung
            const heading = targetElement.querySelector('h3');
            if (heading) {
                heading.style.backgroundColor = '#fff3cd';
                setTimeout(() => {
                    heading.style.backgroundColor = '';
                }, 2000);
            }
        }
        
        // Schnellnavigation schließen
        document.getElementById('quick-nav-content').style.display = 'none';
    }, 100);
}