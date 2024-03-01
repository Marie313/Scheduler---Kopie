//create.js
function createForm() {

    const formElements = [
        { type: 'label', text: 'Name: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter new name', class:'name' } },
        { type: 'label', text: 'Enabled: ' },
        { type: 'input', attributes: { type: 'checkbox', class: 'my-checkbox' } },
        { type: 'p', text: 'false', class: 'message' },
        { type: 'label', text: 'First Run: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'firstRun'}},
        { type: 'br' },
        { type: 'label', text: 'Next Run: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'nextRun'}},
        { type: 'br' },
        { type: 'label', text: 'activ until: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'activeuntil'}},
        { type: 'label', text: 'Interval (in seconds): ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'every ... seconds', class: 'interval'} },
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

    //Überprüfung des Active
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
                intervalInput.value = "every " + intervalInSeconds + " seconds";
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
    backButtonContainer.classList.add('back');
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
    const confirmed = confirm('Die geaenderten Daten werden nicht gespeichert!');
    if (confirmed){
        window.location.href= 'index.html';
    }
}

const apiUrl = '/scheduler/api/jobs/create';
 

async function saveElements() {
    // Daten sammeln
    const nameInput = document.querySelector('.name');
    const enabledCheckbox = document.querySelector('.my-checkbox');
    const firstRunInput = document.querySelector('.firstRun');
    const nextRunInput = document.querySelector('.nextRun');
    const activeUntil = document.querySelector('.activeuntil');
    const scheduleInput = document.querySelector('.interval');
    const lastRunInput = new Date("0001-01-01T00:00:00");

    const firstRunValue = new Date (firstRunInput.value);
    const nextRunValue = new Date (nextRunInput.value);
    const activeUntilValue = new Date (activeUntil.value);
    let formatedFirstRun;
    let formatedNextRun;
    let formatedActiveUntil

    console.log(firstRunValue.getTimezoneOffset());
    console.log(nextRunValue.getTimezoneOffset());
    console.log(activeUntilValue.getTimezoneOffset());

    if(firstRunValue.getTimezoneOffset() < -60){
        formatedFirstRun = new Date(firstRunValue.getTime() + 7200000)
    }
    else{
        formatedFirstRun = new Date(firstRunValue.getTime() + 3600000)
    }

    if(nextRunValue.getTimezoneOffset() < -60){
        formatedNextRun = new Date(nextRunValue.getTime() + 7200000)
    }
    else{
    formatedNextRun = new Date(nextRunValue.getTime() + 3600000)
    }

    if(activeUntilValue.getTimezoneOffset() < -60){
        formatedActiveUntil= new Date(activeUntilValue.getTime() + 7200000)
    }
    else{
        formatedActiveUntil= new Date(activeUntilValue.getTime() + 3600000)
    }

    // Umwandlung in ISO-Format
    const isoFormatedFirstRun = formatedFirstRun.toISOString();
    const isoFormatedNextRun = formatedNextRun.toISOString();
    const isoFormatedActiveUntil = formatedActiveUntil.toISOString();

    // Nur zur Überprüfung, ob die Daten im richtigen Format vorliegen
    const firstRunDate = new Date(firstRunInput.value);
    const nextRunDate = new Date(nextRunInput.value);
    const activeUntilDate = new Date(activeUntil.value);
    console.log('First Run:', firstRunDate);
    console.log('Next Run:', nextRunDate);
    console.log('Active Until', activeUntilDate);
    console.log('First Run Formated:', isoFormatedFirstRun);
    console.log('Next Run Formated:', isoFormatedNextRun);
    console.log('Active Until Formated:', isoFormatedActiveUntil);

    // Daten für den POST-Request vorbereiten
    const requestData = {
        name: nameInput.value,
        enabled: enabledCheckbox.checked,
        nextRun: isoFormatedNextRun,
        lastRun: lastRunInput,
        activeFrom: isoFormatedFirstRun,
        activeUntil: isoFormatedActiveUntil,
        schedule: scheduleInput.value,
    };

    console.log('Request Data:', JSON.stringify(requestData));

    {
        // POST-Request an den Server senden
        const response = await fetch(apiUrl, {
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