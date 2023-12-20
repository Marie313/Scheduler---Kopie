//create.js
function createForm() {

    const formElements = [
        { type: 'p', text: 'ID: ' },
        { type: 'label', text: 'Name: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter new name' } },
        { type: 'p', text: 'Enabled: ' },
        { type: 'input', attributes: { type: 'checkbox', class: 'my-checkbox' } },
        { type: 'p', text: 'false', class: 'message' },
        { type: 'label', text: 'First Run: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'firstRun'}},
        { type: 'br' },
        { type: 'label', text: 'Next Run: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'nextRun'}},
        { type: 'br' },
        { type: 'label', text: 'Interval (in seconds): ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter interval in seconds', class: 'interval'} },
    ];

    // Container-Element erstellen
    const container = document.createElement('div');
    container.classList.add('border'); 

    const heading = document.createElement('u');
    heading.innerHTML = '<h1>Create</h1>';
    container.appendChild(heading);

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

        container.appendChild(el);
    });

    document.body.appendChild(container);

    // Überprüfung des First Run-Datums
    const firstRunInput = document.querySelector('.firstRun');
    const nextRunInput = document.querySelector('.nextRun');
    firstRunInput.addEventListener('change', function () {
        updateInterval();
    const selectedDateFirst = new Date(firstRunInput.value);
    const selectedDateNext = new Date(nextRunInput.value);
    const currentDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(currentDate.getFullYear() + 1);

    if (selectedDateFirst < currentDate || selectedDateFirst > maxDate || selectedDateFirst >= selectedDateNext) {
        alert('Das ausgewaehlte Datum fuer "First Run" darf weder in der Vergangenheit, noch mehr als ein Jahr in der Zukunft liegen. Des weiteren ist der Fall, dass das Datum fuer first Run vor dem fuer next Run liegt, ausgeschlossen.');
        firstRunInput.value = ''; 
    }
    });

    // Überprüfung des Next Run-Datums
    nextRunInput.addEventListener('change', function () {
        updateInterval();
    const selectedDateNext = new Date(nextRunInput.value);
    const selectedDateFirst = new Date(firstRunInput.value);

    if (selectedDateNext <= selectedDateFirst) {
        alert('Das ausgewaehlte Datum fuer "Next Run" darf zeitlich nicht vor first Run gelegen sein.');
        nextRunInput.value = ''; 
    }
    });

    function updateInterval() {
        const firstRunDate = new Date(firstRunInput.value);
        const nextRunDate = new Date(nextRunInput.value);
    
        if (!isNaN(firstRunDate.getTime()) && !isNaN(nextRunDate.getTime())) {
            const intervalInSeconds = Math.abs((nextRunDate - firstRunDate) / 1000);
    
            const intervalInput = document.querySelector('.interval');
            if (intervalInput) {
                intervalInput.value = intervalInSeconds;
            }
        }
    }
    
    // Überprüfung des Interval-Felds
    const intervalInput = document.querySelector('.interval');
    if (intervalInput) {
        intervalInput.addEventListener('input', function () {
            updateNextRun(); 
        });
    }

    // Funktion zum Aktualisieren des Next Runs basierend auf dem Interval
    function updateNextRun() {
        const firstRunDate = new Date(document.querySelector('.firstRun').value);
        const intervalInSeconds = parseFloat(intervalInput.value);

        if (!isNaN(firstRunDate.getTime()) && !isNaN(intervalInSeconds)) {
            const nextRunDate = new Date(firstRunDate.getTime() + intervalInSeconds * 1000 + 3600000);

            const nextRunInput = document.querySelector('.nextRun');
            if (nextRunInput) {
                nextRunInput.value = nextRunDate.toISOString().slice(0, 16); // Formatierung für datetime-local
            }
    }
}

    // Button zum Speichern
    const saveButtonContainer = document.createElement('div');
    saveButtonContainer.classList.add('save');
    saveButtonContainer.innerHTML = '<button  onclick="saveElements()">Save</button>';
    container.appendChild(saveButtonContainer);
    
    // Button zum Zurückkehren zum Scheduler
    const backButtonContainer = document.createElement('div');
    saveButtonContainer.classList.add('back');
    backButtonContainer.innerHTML = '<button onclick="redirectToScheduler()">Go back to scheduler</button>';
    container.appendChild(backButtonContainer);

    document.body.appendChild(container);

    // Checkbox-Logik
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