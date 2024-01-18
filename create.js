//create.js
function createForm() {

    const formElements = [
        { type: 'label', text: 'ID: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'ID', class: 'ID'} },
        { type: 'label', text: 'Name: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter new name', class:'name' } },
        { type: 'label', text: 'description: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter new description', class:'description' } },
        { type: 'label', text: 'Enabled: ' },
        { type: 'input', attributes: { type: 'checkbox', class: 'my-checkbox' } },
        { type: 'p', text: 'false', class: 'message' },
        { type: 'label', text: 'status: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'success', class: 'status' } },
        { type: 'label', text: 'First Run: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'firstRun'}},
        { type: 'br' },
        { type: 'label', text: 'Next Run: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'nextRun'}},
        { type: 'br' },
        { type: 'label', text: 'activ until: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'activeuntil'}},
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
    const activeuntilInput = document.querySelector('.activeuntil');
    
    firstRunInput.addEventListener('change', function () {
        updateInterval();
        const selectedDateFirst = new Date(firstRunInput.value);
        const selectedDateNext = new Date(nextRunInput.value);
        const currentDate = new Date();
        const maxDate = new Date();
        const selectedActivUntil = new Date(activeuntilInput.value);
        maxDate.setFullYear(currentDate.getFullYear() + 1);

        if (selectedDateFirst < currentDate || selectedDateFirst > maxDate || selectedDateFirst >= selectedDateNext || selectedDateFirst > selectedActivUntil) {
            alert('Das ausgewaehlte Datum fuer "first run" darf weder in der Vergangenheit, noch mehr als ein Jahr in der Zukunft liegen. Des weiteren sind die Faell, dass das Datum fuer "first run" vor dem Datum fuer "next run" oder "active until" liegt, ausgeschlossen.');
            firstRunInput.value = ''; 
        }
    });

    // Überprüfung des Next Run-Datums
    nextRunInput.addEventListener('change', function () {
        updateInterval();
        const selectedDateNext = new Date(nextRunInput.value);
        const selectedDateFirst = new Date(firstRunInput.value);
        const selectedActivUntil = new Date(activeuntilInput.value);

        if (selectedDateNext <= selectedDateFirst || selectedDateNext > selectedActivUntil) {
            alert('Das ausgewaehlte Datum fuer "next run" darf zeitlich nicht vor "first Run" oder "activ until" gelegen sein.');
            nextRunInput.value = ''; 
        }
    });

    activeuntilInput.addEventListener('change', function(){
        const selectedActivUntil = new Date(activeuntilInput.value);
        const selectedDateFirst = new Date(firstRunInput.value);
        const selectedDateNext = new Date(nextRunInput.value);

        if (selectedActivUntil < selectedDateFirst || selectedActivUntil < selectedDateNext){
            alert('Das ausgewaehlte Datum fuer "active until" darf zeitlich gesehen nicht vor "next run" und erst recht nicht vor "first run" liegen.');
            activeuntilInput.value = '';
        }
    })

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

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'http://20.166.67.112:82/jobs/create';
 

async function saveElements() {
    // Daten sammeln
    const IDinput = document.querySelector('.ID');
    const nameInput = document.querySelector('.name');
    const descriptioninput = document.querySelector('.description');
    const enabledCheckbox = document.querySelector('.my-checkbox');
    const statusinput = document.querySelector('.status');
    const lastRunInput = document.querySelector('.firstRun');
    const firstRunInput = document.querySelector('.firstRun');
    const nextRunInput = document.querySelector('.nextRun');
    const activeUntil = document.querySelector('.activeuntil');

    //nur zur Überprüfung ob daten im richtigen Format vorliegen
    const firstRunDate = new Date(firstRunInput.value);
    console.log('First Run:', firstRunDate);

    // Daten für den POST-Request vorbereiten
    const requestData = {
        identification: IDinput.value,
        name: nameInput.value,
        description: descriptioninput.value,
        enabled: enabledCheckbox.checked,
        status: statusinput.value,
        'last-run': new Date(lastRunInput.value).toISOString(),
        'next-run': new Date(nextRunInput.value).toISOString(),
        'active-from': new Date(firstRunInput.value).toISOString(),
        'active-until': new Date(activeUntil.value).toISOString(),
        schedule: "schedule",
    };

    console.log('Request Data:', JSON.stringify(requestData));

    {
        // POST-Request an den Server senden
        const response = await fetch(proxyUrl +apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
            },
            body: JSON.stringify(requestData),
        });

        const newJob = await response.json();
        console.log('Neuer Job:', newJob);
    } 
}
createForm();