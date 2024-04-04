//create.js
function createForm() {

    const formElements = [
        { type: 'label', text: 'Name: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'enter new name', class: 'name' } },
        { type: 'label', text: 'Enabled: ' },
        { type: 'input', attributes: { type: 'checkbox', class: 'my-checkbox' } },
        { type: 'p', text: 'false', class: 'message' },
        { type: 'label', text: 'First Run: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'firstRun' } },
        { type: 'label', text: 'Activ Until: ' },
        { type: 'input', attributes: { type: 'datetime-local', class: 'activeuntil' } },
        { type: 'label', text: 'Interval: ' },
        { type: 'input', attributes: { type: 'text', placeholder: 'ww.dd.hh.mm.ss', class: 'interval' } },
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
    const intervalInput = document.querySelector('.interval');

    firstRunInput.addEventListener('change', function () {
        const selectedDateFirst = new Date(firstRunInput.value);
        const currentDate = new Date();
        const maxDate = new Date();
        const selectedActivUntil = new Date(activeuntilInput.value);
        maxDate.setFullYear(currentDate.getFullYear() + 1);

        if (selectedDateFirst < currentDate) {
            Swal.fire({
                title: "Ungueltige Eingabe!",
                text: "Das ausgewaehlte Datum fuer 'first run' darf nicht in der Vergangenheit liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
        if (selectedDateFirst > maxDate) {
            Swal.fire({
                title: "Ungueltige Eingabe!",
                text: "Das ausgewaehlte Datum fuer 'first run' darf nicht mehr als ein Jahr in der Zukunft liegen.",
                icon: "error"
            });
            firstRunInput.value = '';
        }
        if (selectedDateFirst > selectedActivUntil) {
            Swal.fire({
                title: "Ungueltige Eingabe!",
                text: "Das ausgewaehlte Datum fuer 'first run' darf zeitlich gesehen nicht nach dem Datum fuer 'active until' liegen.",
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
                title: "Ungueltige Eingabe!",
                text: "Das ausgewaehlte Datum fuer 'active until' darf zeitlich gesehen nicht vor dem Datum fuer 'first run' liegen.",
                icon: "error"
            });
            activeuntilInput.value = '';
        }
        if (selectedActivUntil < currentDate) {
            Swal.fire({
                title: "Ungueltige Eingabe!",
                text: "Das ausgewaehlte Datum fuer 'active until' darf nicht in der Vergangenheit liegen.",
                icon: "error"
            });
        }
    })
    
    intervalInput.addEventListener('click', function(){
        Swal.fire({
            title: "Informationen zum Format des Intervals",
            text: "Damit das von Ihnen gewaehlte Interval richtig verwendet werden kann, muessen Sie es im Format ww.dd.hh.mm.ss uebergeben. Im ersten Part 'ww' geben Sie bitte die Anzahl der Wochen an, ueber die sich das Interval erstrecken soll. Das Selbe gilt fuer die anderen vier Parts, nur dass der zweite Part 'dd' fuer Tage, der dritte Part 'hh' fuer Stunden, der vierte Part 'mm' fuer Minuten und der fuenfte und letzte Part 'ss' fuer Sekunden steht. Falls Ihre gewuenschte Eingabe nur einstellig ist, bitten wir Sie darum die vorangehende Ziffer mit einer null zu bezeichnen. Falls sie einen Part gar nicht benoetigen, befuellen Sie diesen bitte mit zwei nullen.",
            icon: "info"
        });
    })

    // Button zum Speichern
    const saveButtonContainer = document.createElement('div');
    saveButtonContainer.classList.add('save');
    saveButtonContainer.innerHTML = '<button  onclick="saveElements()">save</button>';
    container.appendChild(saveButtonContainer);

    // Button zum Zurückkehren zum Scheduler
    const backButtonContainer = document.createElement('div');
    backButtonContainer.classList.add('back');
    backButtonContainer.innerHTML = '<button onclick="redirectToScheduler()">go back to scheduler</button>';
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
        var parts = interval.split(".");
        var weekPart = parts[0];
        var dayPart = parts[1];
        var hourPart = parts[2];
        var minPart = parts[3];
        var secPart = parts[4];
        console.log(weekPart);
        console.log(dayPart);
        console.log(hourPart);
        console.log(minPart);
        console.log(secPart);

        intervalRequestData = (weekPart * 604800) + (dayPart * 86400) + (hourPart * 3600) + (minPart * 60) + (secPart * 1);
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