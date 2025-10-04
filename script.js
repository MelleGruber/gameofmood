// Navigation zwischen Manie und Depression
document.addEventListener('DOMContentLoaded', function() {
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
});

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
            <button class="delete-btn" onclick="deleteMessage('${message.id}', '${document.querySelector('.content-section.active').id}')" style="float: right; background: #e53e3e; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">Löschen</button>
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
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#48bb78' : '#4299e1'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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