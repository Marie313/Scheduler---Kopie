//edit.js
// Laden der ausgewählten Variable-ID aus der URL
const urlParams = new URLSearchParams(window.location.search);
console.log(window.location.search);
const selectedVariableId = urlParams.get(`id`);
console.log(selectedVariableId);

const apiUrl = `/scheduler/api/job/${selectedVariableId}`;

async function fetchJobs() {
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
    
    let data = await response.json();
    console.log(data);
    return data ;
}

// Überprüfen, ob eine Variable ausgewählt wurde
async function getJobs(){
    const job = await fetchJobs();
    console.log(job);

        const jobDetails = document.getElementById('jobDetails');

        const checkboxHtml = `
            <p>Enabled:</p>
            <div class="checkbox">
                <input type="checkbox" class="checkboxero" ${job.enabled ? 'checked' : ''}>
            </div>
            <p class="message" id="message">
            ${job.enabled ? 'true' : 'false'}
            </p>
        `;

        const currentDate = new Date();
        const formattedMinDate = currentDate.toISOString().slice(0, 16);
        const selectedFirstRunDate = new Date(job.firstRun);
        const isFirstRunInPast = selectedFirstRunDate < currentDate;


        // Anzeigen der Details der ausgewählten Variable
        jobDetails.innerHTML = `
            <div class="border">
            <h1>Edit</h1>
            <p>ID: </p><p class="ID">${job.id}</p>
            <label>Name: </label><input class="inputName" placeholder="please enter new name..." value="${job.name}">
            ${checkboxHtml}
            <p>Status: </p><input class="status" value=${job.status}>
            <div class="run"><label>First Run: </label><input class="firstRun" type="datetime-local" value=${job.activeFrom} ${isFirstRunInPast ? 'disabled' : ''}>
            <br>
            <label>Last Run: </label><input class="lastRun" type="datetime-local" value=${job.lastRun} disabled>
            <br>
            <label>Active Until: </label><input class="activeuntil" type="datetime-local" value=${job.activeUntil}>
            <br>
            <label>Interval (in seconds): </label><input placeholder="please enter new interval" class="interval" value="${job.schedule}">
            <div class=save><button onclick="saveElements()" class="saveButton">Save</button></div>
            <div class=back><button onclick="redirectToScheduler()">go back to scheduler</button></div>
            <div class=delete><button onclick="deleteJob()">delete Job</button></div>
            </div>
            `;

// Erstelle ein link-Element
var linkElement = document.createElement('link');

    // Attribute des link-Elements
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = 'edit.css';
    // Füge das link-Element dem head-Element der Seite hinzu
    document.head.appendChild(linkElement);

// Checkbox-Logik
var checkbox = document.querySelectorAll(".checkboxero");
var message = document.querySelectorAll(".message");
checkbox.forEach(function(checkbox, index){
    checkbox.addEventListener('change',function(){
        if (checkbox.checked){
            message[index].textContent='true'}
        else {
            message[index].textContent='false'}
    });
});

const firstRunInput = document.querySelector('.firstRun');
const activeuntilInput = document.querySelector('.activeuntil');

activeuntilInput.addEventListener('change', function(){
    const selectedActivUntil = new Date(activeuntilInput.value);
    const selectedDateFirst = new Date(firstRunInput.value);
    if (selectedActivUntil < selectedDateFirst){
        alert('Das ausgewaehlte Datum fuer "active until" darf zeitlich gesehen nicht vor "first run" liegen.');
        activeuntilInput.value = '';
    }
})

}

//Funktion zum Zurückkehren zum Scheduler
function redirectToScheduler(){
    const confirmed = confirm('Die geaenderten Daten werden nicht automatisch gespeichert!');
    if (confirmed){
        window.location.href= 'index.html';
    }
}

async function deleteJob(){
    const confirmed2 = confirm('Moechten Sie diesen Job wirklich endgueltig und unwiderruflich loeschen?');
    if (confirmed2){
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete job');
            }
    
            //Zeile aus Tabelle entfernen, wenn Anfrage erfolgreich war
            const rowToRemove = document.getElementById(`job-${jobId}`);
            rowToRemove.remove();
        } catch (error) {
            console.error('Error deleting job:', error.message);
        }
        window.location.href= 'index.html'; 
    } 
}

//Funktion zum Speichern und überprüfen der geänderten Daten
async function saveElements(){
    // Daten sammeln
    const nameInput = document.querySelector('.inputName');
    const Checkboxero = document.querySelector('.checkboxero');
    const statusinput = document.querySelector('.status');
    const lastRunInput = document.querySelector('.lastRun');
    const firstRunInput = document.querySelector('.firstRun');
    const activeUntil = document.querySelector('.activeuntil');
    const intervalInput = document.querySelector('.interval');

    const firstRunValue = new Date (firstRunInput.value);
    const activeUntilValue = new Date (activeUntil.value);
    let formatedFirstRun;
    let formatedActiveUntil

    if(firstRunValue.getTimezoneOffset() < -60){
        formatedFirstRun = new Date(firstRunValue.getTime() + 7200000)
    }
    else{
        formatedFirstRun = new Date(firstRunValue.getTime() + 3600000)
    }

    if(activeUntilValue.getTimezoneOffset() < -60){
        formatedActiveUntil= new Date(activeUntilValue.getTime() + 7200000)
    }
    else{
        formatedActiveUntil= new Date(activeUntilValue.getTime() + 3600000)
    }

    const isoformatedFirstRun = formatedFirstRun.toISOString();
    const isoformatedActiveUntil = formatedActiveUntil.toISOString();

    //nur zur Überprüfung ob daten im richtigen Format vorliegen
    const firstRunDate = new Date(firstRunInput.value);
    const activeUntilDate = new Date(activeUntil.value);
    console.log('First Run:', firstRunDate);
    console.log('Active Until', activeUntilDate);
    console.log('First Run Formated:', isoformatedFirstRun);
    console.log('Active Until Formated:', isoformatedActiveUntil);
    console.log(Checkboxero.checked);

    // Daten für Request vorbereiten
    const requestData = {
        name: nameInput.value,
        enabled: Checkboxero.checked,
        status: statusinput.value,
        lastRun: new Date(lastRunInput.value),
        activeFrom: isoformatedFirstRun,
        activeUntil: isoformatedActiveUntil,
        schedule: intervalInput.value,
    };

    console.log('Request Data:', JSON.stringify(requestData));

    {
        //PUT-Request
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        
        const newJob = await response.json();
        console.log('Neuer Job:', newJob);
    }
}
getJobs();