//index.js
const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

const apiUrl = '/scheduler/api/jobs';

async function getJobs() {
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers:{
            'Access-Control-Allow-Origin':'*'
        }
    });

    const jobs = await response.json();
    console.log(jobs);
    displayJobs(jobs);
}
function updateInterval(lastRun, activeFrom, nextRun) {
    const currentDate = new Date();
    const lastRunDate = new Date(lastRun);
    const nullDate = new Date("0001-12-31T23:06:32");
    const firstRunDate = new Date(activeFrom);
    const nextRunDate = new Date(nextRun);

    if (firstRunDate > currentDate || lastRunDate.getTime() === nullDate.getTime()){
        const intervalInSecondsFirst = Math.abs((nextRunDate - firstRunDate) / 1000);
        return `${intervalInSecondsFirst} seconds`;
    }
    else{
        if (!isNaN(lastRunDate.getTime()) && !isNaN(nextRunDate.getTime())) {
            const intervalInSeconds = Math.abs((nextRunDate - lastRunDate) / 1000);
            return `${intervalInSeconds} seconds`;
        } 
        else{ 
            return 'not avail'
        }
    }
}

function displayJobs(jobs) {
    const jobDetailsTableBody = document.getElementById('jobTable');

    jobs.forEach(job => {
        const jobDetailRow = document.createElement('tr');
        jobDetailRow.className = 'job-detail';

    const jobDetailCells = [
        { value: job.id },
        { value: job.name },
        {
            value: `
                <div>
                    <input type="checkbox" class="my-checkbox" ${job.enabled ? 'checked' : ''} disabled>
                </div>
            `,
        },
        { value: job.status ? noneStatus(job.status, job.activeFrom) : 'not available' },
        { value: job.activeFrom ? formatDate(job.activeFrom) : 'not available'},
        { value: job.lastRun ? formatDateTime(job.lastRun) : 'not available'},
        { value: job.nextRun ? formatDate(job.nextRun) : 'not available'},
        { value: job.activeUntil ? formatDate(job.activeUntil) : 'not available'},
        { value: updateInterval(job.lastRun, job.activeFrom, job.nextRun)},
        {
            value: `
                <div class="edit"><a href="edit.html?id=${job.id}"><svg width="16" height="16"><use xlink:href="#edit-icon"></use></svg></a></div>
                <div class="delete"><button class="deleteButton" data-jobId="123"><svg width="16" height="16"><use xlink:href="#delete-icon"></use></svg></button></div>
            `,
        },
    ];

    jobDetailCells.forEach(cell => {
        const tdElement = document.createElement('td');
        tdElement.className = cell.className || '';
        tdElement.innerHTML = cell.value;
        jobDetailRow.appendChild(tdElement);
    });

    jobDetailRow.style.backgroundColor = getBackgroundColor(job.status);

    jobDetailsTableBody.appendChild(jobDetailRow);
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatDateTime(lastRun) {
    const nullDate = new Date("0001-12-31T23:06:32");
    const inputDate = new Date(lastRun);

    // Überprüfen, ob das Datum gleich der "nullDate" ist
    if (inputDate.toString() === nullDate.toString()) {
        // Rückgabe eines alternativen Strings, wenn das Datum "nullDate" entspricht
        return "noch kein last Run vorhanden";
    } else {
        // Rückgabe des formatierten Datums, wenn es sich nicht um "nullDate" handelt
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
        return new Date(lastRun).toLocaleDateString(undefined, options);
    }
}

function noneStatus(status, activeFrom){
    const firstDate = new Date(activeFrom);
    const currentDate = new Date();
    
    if (firstDate > currentDate){
        return 'NONE';
    }
    else{
        return status;
    }
}

function getBackgroundColor(status) {
    switch (status) {
        case 'SUCCESS':
            return 'rgba(61, 255, 61, 0.75)';
        case 'WARNING':
            return 'rgba(255, 252, 71, 0.8)';
        case 'FAILED':
            return 'rgba(255, 66, 66, 0.73)';
        case 'NONE':
            return '';
        default:
            return '';
    }
}

async function deleteJob(jobId) {
    try {
        const response = await fetch(`${apiUrl}/${jobId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.log(jobId);
            throw new Error('Failed to delete job');
        }

        //Zeile aus Tabelle entfernen, wenn Anfrage erfolgreich war
        const rowToRemove = document.getElementById(`job-${jobId}`);
        rowToRemove.remove();
    } catch (error) {
        console.error('Error deleting job:', error.message);
    }
}

//Event-Listener hinzufügen, um auf Klicks des Lösch-Buttons zu reagieren
const deleteButtons = document.querySelectorAll('.deleteButton');
deleteButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const jobId = button.dataset.jobId; //Job-ID aus dem Dataset entnehmen
        console.log(jobId);
        if (confirm('Wollen Sie diesen Prozess wirklich loeschen?')) {
            deleteJob(jobId);
        }
    });
});
}
getJobs();

// Event-Listener für die Selectbox 
var filterSelect = document.getElementById("selectbox");
filterSelect.addEventListener("change", function () {
    filterTable(filterSelect.value);
});

// Event-Listener für das Suchfeld 
var searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
    filterTable(filterSelect.value, searchInput.value);
});

// Funktion zum Filtern der Tabelle basierend auf dem ausgewählten Wert der Selectbox und dem Suchbegriff
function filterTable(selectedStatus, searchTerm) {
    var rows = document.querySelectorAll('.job-detail');

    rows.forEach(function (row) {
        var enabledCell = row.querySelector('.my-checkbox');
        var isEnabled = enabledCell.checked;
        var backgroundColor = getComputedStyle(row).backgroundColor;

        // Bedingungen für Vergleich von Hintergrundfarben
        var colorMatches =
            (selectedStatus === "all") ||
            (isEnabled && selectedStatus === "enabled") ||
            (!isEnabled && selectedStatus === "disabled") ||
            (selectedStatus === "success" && (
                backgroundColor === "rgba(61, 255, 61, 0.75)" || backgroundColor === "rgb(61, 255, 61)"
            )) ||
            (selectedStatus === "failed" && (
                backgroundColor === "rgba(255, 66, 66, 0.73)" || backgroundColor === "rgb(255, 66, 66)"
            )) ||
            (selectedStatus === "warning" && (
                backgroundColor === "rgba(255, 252, 71, 0.8)" || backgroundColor === "rgb(255, 252, 71)"
            ));

        // Bedingungen für die Suche
        var searchMatches = (
            !searchTerm || row.textContent.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Entscheidung, ob die Zeile angezeigt oder versteckt werden soll
        if (colorMatches && searchMatches) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    new Tablesort(document.getElementById('myTable'));
});

//Funktion um zum Scheduler zurückkzukehren
function redirectToEditPage() {
    window.location.href = `edit.html?id=0`;
}

//Funktion um neue Seite zu speichern
function createPage() {
    window.location.href = `create.html`;
}