//edit.js
// Laden der ausgewählten Variable-ID aus der URL
const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

const allJobs = [
    {
        id: 1234,
        name: "Beispiel_1",
        enabled: true,
        status: "success",
        firstRun: "2024-01-12T11:24",
        nextRun: "2024-01-13T11:24",
        lastRun: "2024-01-12T11:24",
        interval: "86.400"
    },
    {
        id: 2023,
        name: "Beispie_2",
        enabled: true,
        status: "success",
        firstRun: "2023-06-14T22:24",
        nextRun: "2023-12-14T22:24",
        lastRun: "2023-06-14T22:24",
        interval: "15.768.000"
    },
    {
        id: 5678,
        name: "Beispie_3",
        enabled: true,
        status: "warning",
        firstRun: "2023-09-12T10:19",
        nextRun: "2023-11-12T10:15",
        lastRun: "2023-09-12T10:19",
        interval: "7.884.000"
    },
    {
        id: 1010,
        name: "Beispiel_4",
        enabled: false,
        status: "none",
        firstRun: "",
        nextRun: "",
        lastRun: "",
        interval: ""
    },
    {
        id: 3103,
        name: "Beispiel_5",
        enabled: true,
        status: "failed",
        firstRun: "2023-10-08T09:35",
        nextRun: "2023-10-18T09:35",
        lastRun: "2023-10-08T09:35",
        interval: "864.000"
    },
    {
        id: 9876,
        name: "Beispiel_6",
        enabled: true,
        status: "success",
        firstRun: "2023-10-12T10:01",
        nextRun: "2023-10-13T10:02",
        lastRun: "2023-10-12T10:01",
        interval: "60"
    },
    {
        id: 2005,
        name: "Beispiel_7",
        enabled: false,
        status: "success",
        firstRun: "2015-12-30T04:24",
        nextRun: "",
        lastRun: "2015-12-30T04:24",
        interval: ""
    }
];

// Überprüfen, ob eine Variable ausgewählt wurde
if (selectedVariableId) {
    // Anzeigen der ausgewählten Variable auf der Seite
    const jobDetails = document.getElementById('jobDetails');
    const selectedJob = allJobs.find(job => job.id === parseInt(selectedVariableId));

    if (selectedJob) {

        const checkboxHtml = `
            <p>Enabled:</p>
            <div class="checkbox">
                <input type="checkbox" class="my-checkbox" ${selectedJob.enabled ? 'checked' : ''}>
            </div>
            <p class="message">${selectedJob.enabled}</p>
        `;

        const currentDate = new Date();
        const formattedMinDate = currentDate.toISOString().slice(0, 16);
        const selectedFirstRunDate = new Date(selectedJob.firstRun);
        const isFirstRunInPast = selectedFirstRunDate < currentDate;


        // Anzeigen der Details der ausgewählten Variable
        jobDetails.innerHTML = `
            <div class="border">
            <h1>Edit</h1>
            <p>ID: ${selectedJob.id}</p>
            <label>Name: </label><input class="inputName" placeholder="please enter new name..." value=${selectedJob.name}>
            ${checkboxHtml}
            <p>Status: ${selectedJob.status}</p>
            <div class="run"><label>First Run: </label><input class="firstRun" type="datetime-local" value=${selectedJob.firstRun} ${isFirstRunInPast ? 'disabled' : ''}>
            <br>
            <label>Next Run: </label><input class="nextRun" type="datetime-local" value=${selectedJob.nextRun} min="${formattedMinDate}">
            <br>
            <label>Last Run: </label><input class="lastRun" type="datetime-local" value=${selectedJob.lastRun} disabled>
            <br>
            <label>Interval (in seconds): </label><input placeholder="please enter new interval in seconds..." class="interval" value=${selectedJob.interval}>
            <div class=save><button onclick="saveElements()" class="saveButton">Save</button></div>
            <div class=back><button onclick="redirectToScheduler()">go back to scheduler</button></div>
            </div>
            `;
    } else {
        console.error('Ungültige Variable-ID');
    }
} else {
    // Falls keine Variable ausgewählt wurde, eine Meldung anzeigen oder andere Aktionen durchführen
    console.error('Keine Variable ausgewählt');
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

firstRunInput.addEventListener('change', function (){
    updateInterval();
})

nextRunInput.addEventListener('change', function () {
    updateInterval();
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

//Funktion zum Zurückkehren zum Scheduler
function redirectToScheduler(){
    window.location.href= 'index.html';
}

//Funktion zum Speichern und überprüfen der geänderten Daten
function saveElements(){
    const inputFirstRun = document.querySelector('.firstRun');
    const inputNextRun = document.querySelector('.nextRun');
    const inputLastRun = document.querySelector('.lastRun');
    const inputInterval = document.querySelector('.interval');

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