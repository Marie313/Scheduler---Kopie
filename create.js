// Funktion zum dynamischen Erstellen des Formulars
function createForm() {
    // Überschrift
    const heading = document.createElement('u');
    heading.innerHTML = '<h1>Create</h1>';
    document.body.appendChild(heading);

    // Formular-Elemente
    const formElements = [
        { type: 'p', text: 'ID: ' },
        { type: 'label', text: 'Name: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter new name' } },
        { type: 'p', text: 'Enabled: ' },
        { type: 'input', attributes: { type: 'checkbox', class: 'my-checkbox' } },
        { type: 'p', text: 'false', class: 'message' },
        { type: 'label', text: 'First Run: ' },
        { type: 'input', attributes: { type: 'datetime-local' } },
        { type: 'br' },
        { type: 'label', text: 'Next Run: ' },
        { type: 'input', attributes: { type: 'datetime-local' } },
        { type: 'br' },
        { type: 'label', text: 'Interval: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter interval in seconds' } },
    ];

    formElements.forEach(element => {
        const el = document.createElement(element.type);
        
        if (element.text) {
            el.textContent = element.text;
        }

        if (element.attributes) {
            for (const [key, value] of Object.entries(element.attributes)) {
                el.setAttribute(key, value);
            }
        }

        document.body.appendChild(el);
    });
    // Button zum Speichern
    const saveButton = document.createElement('div');
    saveButton.innerHTML = '<div class="save"><button  onclick="saveElements()">Save</button></div>';
    document.body.appendChild(saveButton);
    
    // Button zum Zurückkehren zum Scheduler
    const backButton = document.createElement('div');
    backButton.innerHTML = '<div class="back"><button  onclick="redirectToScheduler()">Go back to scheduler</button></div>';
    document.body.appendChild(backButton);

    // Checkbox-Logik integrieren
    var checkboxes = document.querySelectorAll(".my-checkbox");

    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const statusElement = checkbox.nextElementSibling; // Nächstes Element nach der Checkbox
            statusElement.textContent = checkbox.checked ? 'true' : 'false';
        });
    });
}

// Funktion zum Umleiten zur Index-Seite
function redirectToScheduler() {
    window.location.href = 'index.html';
}

// Funktion zum Speichern
function saveElements() {
    window.location.href = 'index.html';
}

// Formular erstellen, wenn das Skript geladen wird
createForm();

