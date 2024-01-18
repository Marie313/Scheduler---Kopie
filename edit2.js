//edit.js
// Laden der ausgewählten Variable-ID aus der URL
const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'http://20.166.67.112:82/jobs/135';

async function fetchJobs() {
    const response = await fetch(proxyUrl + apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
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
            <p>ID: ${job.identification}</p>
            <label>Name: </label><input class="inputName" placeholder="please enter new name..." value=${job.name}>
            ${checkboxHtml}
            <p>Status: ${job.status}</p>
            <div class="run"><label>First Run: </label><input class="firstRun" type="datetime-local" value=${job['active-from']} ${isFirstRunInPast ? 'disabled' : ''}>
            <br>
            <label>Next Run: </label><input class="nextRun" type="datetime-local" value=${job['next-run']} min="${formattedMinDate}">
            <br>
            <label>Last Run: </label><input class="lastRun" type="datetime-local" value=${job['last-run']} disabled>
            <br>
            <label>Interval (in seconds): </label><input placeholder="please enter new interval in seconds..." class="interval" value=${selectedJob.interval}>
            <div class=save><button onclick="saveElements()" class="saveButton">Save</button></div>
            <div class=back><button onclick="redirectToScheduler()">go back to scheduler</button></div>
            </div>
            `;
        } else {
        console.error('Ungültige Variable-ID');
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

//Funktion zum Zurückkehren zum Scheduler
function redirectToScheduler(){
    window.location.href= 'index.html';
}

//Funktion zum Speichern und überprüfen der geänderten Daten
function saveElements(){
    const inputFirstRun = document.querySelector('.firstRun');
    const inputNextRun = document.querySelector('.nextRun');

    const currentDate = new Date();
    const maxDate = new Date();
    const selectedDateNext = new Date(inputNextRun.value);
    const selectedDateFirst = new Date(inputFirstRun.value)
    maxDate.setFullYear(currentDate.getFullYear() + 1);

    if (selectedDateNext < currentDate) {
        alert('Das fuer next Run ausgewaehlte Datum darf nicht in der Vergangenheit liegen.');
        return;
    }
    if (selectedDateFirst > selectedDateNext || selectedDateFirst >= maxDate){
        alert('Das fuer First Run ausgewaehlte Datum darf zeitlich gesehen, nicht nach dem next Run liegen. Des Weiteren sollte das ausgewaehlte Datum fuer first Run nicht mehr als ein Jahr in der Zukunft datiert sein.');
        return;
    }
    
    window.location.href= 'index.html';
}
getJobs();