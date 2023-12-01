//edit.js
// Laden der ausgewählten Variable-ID aus der URL
const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

// Alle Jobs in einem Array
const allJobs = [
    {
        id: 1234,
        name: "Beispiel_1",
        enabled: true,
        status: "success",
        firstRun: "2023-10-12T11:24",
        nextRun: "2023-10-13T11:24",
        lastRun: "2023-10-12T11:24",
        interval: "every_86.400_seconds"
    },
    {
        id: 2023,
        name: "Beispie_2",
        enabled: true,
        status: "success",
        firstRun: "2023-06-14T22:24",
        nextRun: "2023-12-14T22:24",
        lastRun: "2023-06-14T22:24",
        interval: "every_15.768.000_seconds"
    },
    {
        id: 5678,
        name: "Beispie_3",
        enabled: true,
        status: "warning",
        firstRun: "2023-09-12T10:19",
        nextRun: "2023-11-12T10:15",
        lastRun: "2023-09-12T10:19",
        interval: "every_7.884.000_seconds"
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
        interval: "every_864.000_seconds"
    },
    {
        id: 9876,
        name: "Beispiel_6",
        enabled: true,
        status: "success",
        firstRun: "2023-10-12T10:01",
        nextRun: "2023-10-13T10:02",
        lastRun: "2023-10-12T10:01",
        interval: "every_60_seconds"
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
    },
    {
        id: 0,
        name: "",
        enabled: false,
        status: "none",
        firstRun: "",
        nextRun: "",
        lastRun: "",
        interval: ""
    }
];

// Überprüfen, ob eine Variable ausgewählt wurde
if (selectedVariableId) {
    // Anzeigen der ausgewählten Variable auf der Seite
    const jobDetails = document.getElementById('jobDetails');

    // Wählen Sie die entsprechende Variable basierend auf der ausgewählten ID
    const selectedJob = allJobs.find(job => job.id === parseInt(selectedVariableId));

    if (selectedJob) {
        const checkboxHtml = `
            <p>Enabled:</p>
            <div class="checkbox">
                <input type="checkbox" class="my-checkbox" ${selectedJob.enabled ? 'checked' : ''}>
            </div>
            <div class="message"><p class="message">${selectedJob.enabled}</p></div>
        `;
        // Anzeigen der Details der ausgewählten Variable auf der Seite
        jobDetails.innerHTML = `
            <u><h1>Edit</h1></u>
            <p>ID: ${selectedJob.id}</p>
            <label>Name: </label><input class="inputName" placeholder="please enter new name..." value=${selectedJob.name}>
            ${checkboxHtml}
            <p>Status: ${selectedJob.status}</p>
            <label>First Run: </label><input class="firstRun" type="datetime-local" value=${selectedJob.firstRun}>
            <br>
            <label>Next Run: </label><input class="nextRun" type="datetime-local" value=${selectedJob.nextRun}>
            <br>
            <label>Last Run: </label><input class="lastRun" type="datetime-local" value=${selectedJob.lastRun}>
            <br>
            <label>Interval: </label> <input placeholder="please enter new interval in seconds..." class="interval" value=${selectedJob.interval}>
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

// Setze die Attribute des link-Elements
linkElement.rel = 'stylesheet';
linkElement.type = 'text/css';
linkElement.href = 'edit.css';

// Füge das link-Element dem head-Element der Seite hinzu
document.head.appendChild(linkElement);

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

function redirectToScheduler(){
    window.location.href= 'index.html'
}
function saveElemnts(){
    window.location.href= 'index.html'
}