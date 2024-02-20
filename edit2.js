//edit.js
// Laden der ausgewählten Variable-ID aus der URL
const urlParams = new URLSearchParams(window.location.search);
console.log(window.location.search);
const selectedVariableId = urlParams.get(`id`);
console.log(selectedVariableId);

const apiUrl = `/scheduler/api/jobs/${selectedVariableId}`;

async function fetchJobs() {
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });
    
    const data = await response.json();
    console.log(data);
    return Array.isArray(data)? data :[];
}

// Überprüfen, ob eine Variable ausgewählt wurde
async function getJobs(){
    const jobs = await fetchJobs();

    if(Array.isArray(jobs)){
    
        const selectedJob = jobs.find(job => job.id === parseInt(selectedVariableId));

        if (selectedJob) {

        const jobDetails = document.getElementById('jobDetails');

        const checkboxHtml = `
            <p>Enabled:</p>
            <div class="checkbox">
                <input type="checkbox" class="my-checkbox" ${job.enabled ? 'checked' : ''}>
            </div>
            <p class="message">${job.enabled}</p>
        `;

        const currentDate = new Date();
        const formattedMinDate = currentDate.toISOString().slice(0, 16);
        const selectedFirstRunDate = new Date(selectedJob.firstRun);
        const isFirstRunInPast = selectedFirstRunDate < currentDate;


        // Anzeigen der Details der ausgewählten Variable
        jobDetails.innerHTML = `
            <div class="border">
            <h1>Edit</h1>
            <p>ID: </p><p class="ID">${job.id}</p>
            <label>Name: </label><input class="inputName" placeholder="please enter new name..." value=${job.name}>
            ${checkboxHtml}
            <lable>description: </lable><input class="description" placeholder="please enter new description..." value=${job.description}>
            <p>Status: </p><p class="status">${job.status}</p>
            <div class="run"><label>First Run: </label><input class="firstRun" type="datetime-local" value=${job.activeFrom} ${isFirstRunInPast ? 'disabled' : ''}>
            <br>
            <label>Next Run: </label><input class="nextRun" type="datetime-local" value=${job.nextRun} min="${formattedMinDate}">
            <br>
            <label>Last Run: </label><input class="lastRun" type="datetime-local" value=${job.lastRun} disabled>
            <br>
            <label>Active Until: </label><input class="activeUntil" type="datetime-local" value=${job.activeUntil}>
            <br>
            <label>Interval (in seconds): </label><input placeholder="please enter new interval in seconds..." class="interval" value=${selectedJob.interval}>
            <div class=save><button onclick="saveElements()" class="saveButton">Save</button></div>
            <div class=back><button onclick="redirectToScheduler()">go back to scheduler</button></div>
            </div>
            `;
        } else {
        console.error('Ungueltige Variable-ID');
         }
    }
    else{
        console.error('Fehler beim Abrufen von Jobs');
    }
}

// Erstelle ein link-Element
var linkElement = document.createElement('link');

    // Attribute des link-Elements
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = 'edit.css';
    // Füge das link-Element dem head-Element der Seite hinzu
    document.head.appendChild(linkElement);

//Checkbox-Logik
var checkbox = document.querySelectorAll(".my-checkbox");
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
const nextRunInput = document.querySelector('.nextRun');

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

const inputFirstRun = document.querySelector('.firstRun');
const inputNextRun = document.querySelector('.nextRun');

//Überprüfen des Wertes für nextRun
inputNextRun.addEventListener('change', function(){
    const currentDate = new Date();
    const selectedDateNext = new Date(inputNextRun.value);

    if (selectedDateNext < currentDate) {
        alert('Das fuer next Run ausgewaehlte Datum darf nicht in der Vergangenheit liegen.');
        inputNextRun.value='';
    }
})

//Überprüfen des Wertes für firstRun
inputFirstRun.addEventListener('change', function(){
    const maxDate = new Date();
    const selectedDateNext = new Date(inputNextRun.value);
    const selectedDateFirst = new Date(inputFirstRun.value)
    maxDate.setFullYear(currentDate.getFullYear() + 1);

    if (selectedDateFirst > selectedDateNext || selectedDateFirst >= maxDate){
        alert('Das fuer First Run ausgewaehlte Datum darf zeitlich gesehen, nicht nach dem next Run liegen. Des Weiteren sollte das ausgewaehlte Datum fuer first Run nicht mehr als ein Jahr in der Zukunft datiert sein.');
        inputFirstRun.value='';
    }
})

//Funktion zum Zurückkehren zum Scheduler
function redirectToScheduler(){
    const confirmed = confirm('Die geaenderten Daten werden nicht gespeichert!');
    if (confirmed){
        window.location.href= 'index.html';
    }
}

//Funktion zum Speichern und überprüfen der geänderten Daten
async function saveElements(){
    // Daten sammeln
    const IDinput = document.querySelector('.ID');
    const nameInput = document.querySelector('.inputName');
    const descriptioninput = document.querySelector('.description');
    const enabledCheckbox = document.querySelector('.my-checkbox');
    const statusinput = document.querySelector('.status');
    const lastRunInput = document.querySelector('.lastRun');
    const firstRunInput = document.querySelector('.firstRun');
    const nextRunInput = document.querySelector('.nextRun');
    const activeUntil = document.querySelector('.activeUntil');

    // Daten für Request vorbereiten
    const requestData = {
        id: IDinput.value,
        name: nameInput.value,
        description: descriptioninput.value,
        enabled: enabledCheckbox.checked,
        status: statusinput.value,
        lastRun: new Date(lastRunInput.value).toISOString(),
        nextRun: new Date(nextRunInput.value).toISOString(),
        activeFrom: new Date(firstRunInput.value).toISOString(),
        activeUntil: new Date(activeUntil.value).toISOString(),
        schedule: "schedule",
    };

    console.log('Request Data:', JSON.stringify(requestData));

    {
        //PUT-Request
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', 
            },
            body: JSON.stringify(requestData),
        })
        
        const newJob = await response.json();
        console.log('Neuer Job:', newJob);
    }
}
getJobs();