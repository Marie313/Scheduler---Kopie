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
            ${job.enabled ? 'true' : 'false'}
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
                    <input class="firstRun" type="datetime-local" value="${job.activeFrom}" ${isFirstRunInPast ? 'disabled' : ''}>
                    <input class="lastRun" type="datetime-local" value="${job.lastRun}" disabled>
                    <input class="activeuntil" type="datetime-local" value="${job.activeUntil}">
                </div>
            </div>

            <div class="flexInterval">
                <label>Interval: </label><input placeholder="please enter new interval" class="interval" value="${job.schedule}">
            </div>
            <div class="Buttons">
                <div class=save><button onclick="saveElements()" class="saveButton">Save</button></div>
                <div class=back><button onclick="redirectToScheduler()">go back to scheduler</button></div>
                <div class=delete><button onclick="deleteJob()">delete Job</button></div>
            </div>
            `;
    checkFirstRunInput();

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
                message[index].textContent = 'true'
            }
            else {
                message[index].textContent = 'false'
            }
        });
    });

    const firstRunInput = document.querySelector('.firstRun');
    const activeuntilInput = document.querySelector('.activeuntil');

    activeuntilInput.addEventListener('change', function () {
        const selectedActivUntil = new Date(activeuntilInput.value);
        const selectedDateFirst = new Date(firstRunInput.value);
        const currentDate = new Date();
        if (selectedActivUntil < selectedDateFirst) {
            Swal.fire({
                title: "Fehler beim Speichern der Aenderung!",
                text: "Das ausgewaehlte Datum fuer 'active until' darf zeitlich gesehen nicht vor 'first run' liegen.",
                icon: "error"
            });
            activeuntilInput.value = '';
        }
        if (selectedActivUntil < currentDate) {
            Swal.fire({
                title: "Fehler beim Speichern der Aenderung!",
                text: "Das ausgewaehlte Datum fuer 'active until' darf nicht in der Vergangenheit liegen.",
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
                title: "Fehler beim Speichern der Aenderung!",
                text: "Das ausgewaehlte Datum fuer 'first run' darf nicht in der Vergangenheit liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
        if (selectedDateFirst > selectedActivUntil) {
            Swal.fire({
                title: "Fehler beim Speichern der Aenderung!",
                text: "Das ausgewaehlte Datum fuer 'first run' darf zeitlich gesehen nicht nach dem Datum fuer 'active until' liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
    })

    function checkFirstRunInput() {
        const firstRunInput = document.querySelector('.firstRun');

        const currentDate = new Date();
        const selectedFirstRunDate = new Date(firstRunInput.value);

        if (selectedFirstRunDate < currentDate) {
            firstRunInput.disabled = true;
        } else {
            firstRunInput.disabled = false;
        }
    }

}

//Funktion zum Zurückkehren zum Scheduler
function redirectToScheduler() {
    Swal.fire({
        title: "Zurueckkehren zum Scheduler?",
        text: "Die geaenderten Daten werden nicht automatisch gespeichert!",
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
        title: "Wollen Sie diesen Job wirklich loeschen",
        text: "Wenn sie dies bestaetigen wird der ausgewaehlte Job augenblicklich und unwiderruflich geloescht!",
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