//create.js
function createForm() {
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().slice(0, -8);

    const formElements = [
        { type: 'label', text: 'Name: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter new name', class: 'name' } },
        { type: 'label', text: 'Enabled: ', attributes: {class:'enabledLabel'}},
        { type: 'br'},
        { type: 'input', attributes: { type: 'checkbox', class: 'my-checkbox'} },
        { type: 'label', text: 'no', attributes:{class: 'message'}},
        { type: 'br'},
        { type: 'label', text: 'First Run: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'firstRun', min:`${formattedCurrentDate}` } },
        { type: 'label', text: 'Activ Until: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'activeuntil', min:`${formattedCurrentDate}` } },
        { type: 'label', text: 'Interval: ' },
        { type: 'input', attributes: { type: 'text', placeholder: '(dd)d (hh):(mm):(ss)', class: 'interval' } },
    ];

    // Container-Element erstellen
    const container = document.createElement('div');
    container.classList.add('border');

    const heading = document.createElement('h1');
    heading.innerHTML = 'Create New Job';
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
    const activeuntilInput = document.querySelector('.activeuntil');
    const intervalInput = document.querySelector('.interval')

    firstRunInput.addEventListener('change', function () {
        const selectedDateFirst = new Date(firstRunInput.value);
        const currentDate = new Date();
        const maxDate = new Date();
        const selectedActivUntil = new Date(activeuntilInput.value);
        maxDate.setFullYear(currentDate.getFullYear() + 1);

        if (selectedDateFirst < currentDate) {
            Swal.fire({
                title: "Ungültige Eingabe!",
                text: "Das ausgewählte Datum für 'first run' darf nicht in der Vergangenheit liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
        if (selectedDateFirst > maxDate) {
            Swal.fire({
                title: "Ungültige Eingabe!",
                text: "Das ausgewählte Datum für 'first run' darf nicht mehr als ein Jahr in der Zukunft liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
        if (selectedDateFirst > selectedActivUntil) {
            Swal.fire({
                title: "Ungültige Eingabe!",
                text: "Das ausgewählte Datum für 'first run' darf zeitlich gesehen nicht nach dem Datum für 'active until' liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
    });

    //Überprüfung des ActiveUntil
    activeuntilInput.addEventListener('change', function () {
        const selectedActivUntil = new Date(activeuntilInput.value);
        const selectedDateFirst = new Date(firstRunInput.value);
        const currentDate = new Date();
        if (selectedActivUntil < selectedDateFirst) {
            Swal.fire({
                title: "Ungültige Eingabe!",
                text: "Das ausgewählte Datum für 'active until' darf zeitlich gesehen nicht vor dem Datum für 'first run' liegen.",
                icon: "error"
            });
            activeuntilInput.value = '';
        }
        if (selectedActivUntil < currentDate) {
            Swal.fire({
                title: "Ungültige Eingabe!",
                text: "Das ausgewählte Datum für 'active until' darf nicht in der Vergangenheit liegen.",
                icon: "error"
            });
        }
    })

    
    intervalInput.addEventListener('change', function() {
        const interval = intervalInput.value; // Leerzeichen entfernen
        const regex = /^(\d+d\s)?(\d{1,2}:\d{1,2}:\d{1,2})$/; // Regulärer Ausdruck für das erwartete Format
    
        if (!regex.test(interval)) { // Überprüfen, ob das Format gültig ist
            Swal.fire({
                title: "Ungültige Eingabe!",
                text: "Die Eingabe entspricht nicht dem erwarteten Format (dd)d (hh):(mm):(ss).",
                icon: "error"
            });
            intervalInput.value=''; 
        }
        else{
            console.log('all correct');
        }
    });

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
            statusElement.textContent = checkbox.checked ? 'yes' : 'no';
        });
    });
}

// Funktion zum Umleiten zur Index-Seite
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

const apiUrl = '/scheduler/api/jobs/create';


async function saveElements() {
    // Daten sammeln
    const nameInput = document.querySelector('.name');
    const enabledCheckbox = document.querySelector('.my-checkbox');
    const firstRunInput = document.querySelector('.firstRun');
    const activeUntil = document.querySelector('.activeuntil');
    const scheduleInput = document.querySelector('.interval');
    const firstRunValue = new Date(firstRunInput.value);
    const activeUntilValue = new Date(activeUntil.value);
    let formatedFirstRun;
    let formatedActiveUntil

    console.log(firstRunValue.getTimezoneOffset());
    console.log(activeUntilValue.getTimezoneOffset());

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

    const FormatedFirstRunn = formatedFirstRun;
    const FormatedActiveUntill = formatedActiveUntil;

    // Nur zur Überprüfung, ob die Daten im richtigen Format vorliegen
    const firstRunDate = new Date(firstRunInput.value);
    const activeUntilDate = new Date(activeUntil.value);
    console.log('First Run:', firstRunDate);
    console.log('Active Until', activeUntilDate);
    console.log('First Run Formated:', FormatedFirstRunn);
    console.log('Active Until Formated:', FormatedActiveUntill);

    const scheduleInputValue = scheduleInput.value;
    let intervalRequestData;
    formatInterval(scheduleInputValue);

    function formatInterval(interval){
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
    const IntervalRequestData = intervalRequestData

    // Daten für den POST-Request vorbereiten
    const requestData = {
        name: nameInput.value,
        enabled: enabledCheckbox.checked,
        status: "NONE",
        activeFrom: FormatedFirstRunn,
        activeUntil: FormatedActiveUntill,
        schedule: IntervalRequestData,
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
    window.location.href = 'index.html';
}
createForm();