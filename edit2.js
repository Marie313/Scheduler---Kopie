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
    return data;
}

// Überprüfen, ob eine Variable ausgewählt wurde
async function getJobs() {
    const job = await fetchJobs();
    console.log(job);

    const jobDetails = document.getElementById('jobDetails');

    const checkboxHtml = `
            <div class="checkbox">
                <input type="checkbox" class="checkboxero" ${job.enabled ? 'checked' : ''}>
            </div>
            <p class="message" id="message">
            ${job.enabled ? 'yes' : 'no'}
            </p>
        `;

    const currentDate = new Date();
    const selectedFirstRunDate = new Date(job.firstRun);
    const isFirstRunInPast = selectedFirstRunDate < currentDate;


    // Anzeigen der Details der ausgewählten Variable
    jobDetails.innerHTML = `
            <div class="border">
            <h1>Edit Selected Job</h1>
            <div class="idValue"><label>ID:</label><label class="ID">${job.id}</label></div>
            <div class="flexName">
                <div class="labelsName">
                    <div class="NameM"><label>Name: </label></div>
                    <div class="EnabledM"><label>Enabled:</label></div>
                    <label>Status: </label>
                </div>
                <div class="inputsName">
                    <input class="inputName" placeholder="please enter new name..." value="${job.name}">
                    ${checkboxHtml}
                    <input class="inputStatus" placeholder="please enter new name..." value="${job.status}" disabled>
                </div>
            </div>
            <div class="flexRun">
                <div class="labels">
                    <div class="firstRunDiv"><label>First Run: </label></div>
                    <div class="lastRunDiv"><label>Last Run: </label></div>
                    <label>Active Until: </label>
                </div>
                <div class="inputs">
                    <input class="firstRun" type="datetime-local" value="${job.activeFrom}">
                    <input class="lastRun" type="datetime-local" value="${job.lastRun}" disabled>
                    <input class="activeuntil" type="datetime-local" value="${job.activeUntil}">
                </div>
            </div>

            <div class="flexInterval">
                <div class="labelsInterval">
                    <label>Interval: </label>
                </div>
                <div class="inputsInterval">
                    <input placeholder="0d hh:mm:ss" class="interval" value="${job.schedule}">
                </div>
            </div>
            <div class="Buttons">
                <div class=save><button onclick="saveElements()" class="saveButton">Save</button></div>
                <div class=back><button onclick="redirectToScheduler()">Go back to scheduler</button></div>
                <div class=delete><button onclick="deleteJob()">Delete job</button></div>
            </div>
            `;

    const firstRunInput = document.querySelector('.firstRun');
    const activeuntilInput = document.querySelector('.activeuntil');
    const intervalInput = document.querySelector('.interval');
        
    activeuntilInput.addEventListener('change', function () {
        const selectedActivUntil = new Date(activeuntilInput.value);
        const selectedDateFirst = new Date(firstRunInput.value);
        const currentDate = new Date();
        if (selectedActivUntil < selectedDateFirst) {
            Swal.fire({
                title: "Fehler beim Speichern der Änderung!",
                text: "Das ausgewählte Datum für 'active until' darf zeitlich gesehen nicht vor 'first run' liegen.",
                icon: "error"
            });
            activeuntilInput.value = '';
        }
        if (selectedActivUntil < currentDate) {
            Swal.fire({
                title: "Fehler beim Speichern der Änderung!",
                text: "Das ausgewählte Datum für 'active until' darf nicht in der Vergangenheit liegen.",
                icon: "error"
            });
            activeuntilInput.value = '';
        }
    })
        
    firstRunInput.addEventListener('change', function () {
        const selectedActivUntil = new Date(activeuntilInput.value);
        const selectedDateFirst = new Date(firstRunInput.value);
        const currentDate = new Date();
        if (selectedDateFirst < currentDate) {
            Swal.fire({
                title: "Fehler beim Speichern der Änderung!",
                text: "Das ausgewählte Datum für 'first run' darf nicht in der Vergangenheit liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
        if (selectedDateFirst > selectedActivUntil) {
            Swal.fire({
                title: "Fehler beim Speichern der Änderung!",
                text: "Das ausgewählte Datum für 'first run' darf zeitlich gesehen nicht nach dem Datum für 'active until' liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
    })
    calculateUnit();

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
    checkbox.forEach(function (checkbox, index) {
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                message[index].textContent = 'yes'
            }
            else {
                message[index].textContent = 'no'
            }
        });
    });

    function calculateUnit() {
        const intervalInput = document.querySelector('.interval');
        let intervalValue = intervalInput.value; // Um sicherzustellen, dass der Wert als Zahl interpretiert wird
        const days = Math.floor(intervalValue / 86400);
        intervalValue %= 86400;
        const hours = Math.floor(intervalValue / 3600);
        intervalValue %= 3600;
        const minutes = Math.floor(intervalValue / 60);
        intervalValue %= 60;
    
        // Überprüfen, ob Tage vorhanden sind, und entsprechend formatieren
        if (days > 0) {
            intervalValue = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${intervalValue.toString().padStart(2, '0')}`;
        } 
        else {
            intervalValue = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${intervalValue.toString().padStart(2, '0')}`;
        }
       
    
        // Die aktualisierten Werte in die Eingabefelder einfügen
        intervalInput.value = intervalValue;
    }

}

//Funktion zum Zurückkehren zum Scheduler
function redirectToScheduler() {
    Swal.fire({
        title: "Zurückkehren zum Scheduler?",
        text: "Die geänderten Daten werden nicht automatisch gespeichert!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Ok"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'index.html';
        }
    });
}

async function deleteJob() {
    Swal.fire({
        title: "Wollen Sie diesen Job wirklich löschen",
        text: "Wenn sie dies bestätigen wird der ausgewählte Job augenblicklich und unwiderruflich gelöscht!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Ok"
    }).then(async (result) => {
        if (result.isConfirmed) {
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
            window.location.href = 'index.html';
        }
    });
}

//Funktion zum Speichern und überprüfen der geänderten Daten
async function saveElements() {
    // Daten sammeln
    const nameInput = document.querySelector('.inputName');
    const Checkboxero = document.querySelector('.checkboxero');
    const statusinput = document.querySelector('.inputStatus');
    const lastRunInput = document.querySelector('.lastRun');
    const firstRunInput = document.querySelector('.firstRun');
    const activeUntil = document.querySelector('.activeuntil');
    const intervalInput = document.querySelector('.interval');

    const firstRunValue = new Date(firstRunInput.value);
    const activeUntilValue = new Date(activeUntil.value);
    let formatedFirstRun;
    let formatedActiveUntil

    if (firstRunValue.getTimezoneOffset() < -60) {
        formatedFirstRun = new Date(firstRunValue.getTime() + 7200000)
    }
    else {
        formatedFirstRun = new Date(firstRunValue.getTime() + 3600000)
    }

    if (activeUntilValue.getTimezoneOffset() < -60) {
        formatedActiveUntil = new Date(activeUntilValue.getTime() + 7200000)
    }
    else {
        formatedActiveUntil = new Date(activeUntilValue.getTime() + 3600000)
    }

    const isoformatedFirstRun = formatedFirstRun;
    const isoformatedActiveUntil = formatedActiveUntil;

    const scheduleInputValue = intervalInput.value;
    let intervalRequestData;
    formatInterval(scheduleInputValue);

    function formatInterval(interval){
        if (interval.split("d")[0] > 0){
            var parts = interval.split("d");
            var dayPart = parts[0];
            var timePart = parts[1];
            var tparts =timePart.split(":")
            var hourPart = tparts[0];
            var minPart = tparts[1];
            var secPart = tparts[2];
            console.log(dayPart);
            console.log(timePart);
            console.log(hourPart);
            console.log(minPart);
            console.log(secPart);

            intervalRequestData =(dayPart * 86400) + (hourPart * 3600) + (minPart * 60) + (secPart * 1);
        }
        else{
            var tparts =interval.split(":")
            var hourPart = tparts[0];
            var minPart = tparts[1];
            var secPart = tparts[2];
            console.log(timePart);
            console.log(hourPart);
            console.log(minPart);
            console.log(secPart);

            intervalRequestData =(hourPart * 3600) + (minPart * 60) + (secPart * 1);
        }
    }
    const IntervalRequestData = intervalRequestData


    // Nur zur Überprüfung ob Daten im richtigen Format vorliegen
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
        schedule: IntervalRequestData,
    };

    console.log('Request Data:', JSON.stringify(requestData));

    {
        // PUT-Request
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
    window.location.href = 'index.html';
}
getJobs();