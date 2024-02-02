const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'http://20.166.67.112:82/jobs';

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
function updateInterval(lastRun, nextRun) {
    const lastRunDate = new Date(lastRun);
    const nextRunDate = new Date(nextRun);

    if (!isNaN(lastRunDate.getTime()) && !isNaN(nextRunDate.getTime())) {
        const intervalInSeconds = Math.abs((nextRunDate - lastRunDate) / 1000);
        return `${intervalInSeconds} seconds`;
    } 
    else{ 
        return 'not available'
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
                    <p class="message">${job.enabled ? 'true' : 'false'}</p>
                </div>
            `,
        },
        { value: job.status },
        { value: job.lastRun ? formatDate(job.lastRun) : 'not available'},
        { value: job.nextRun ? formatDate(job.nextRun) : 'not available'},
        { value: updateInterval(job.lastRun,job.nextRun)},
        {
            value: `
                <div class="edit"><a href="edit.html?id=${job.identification}"><svg width="16" height="16"><use xlink:href="#edit-icon"></use></svg></a></div>
                <div class="delete"><button class="deleteButton"><svg width="16" height="16"><use xlink:href="#delete-icon"></use></svg></button></div>
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



function getBackgroundColor(status) {
    switch (status) {
        case 'SUCCESS':
            return 'rgba(61, 255, 61, 0.75)';
        case 'WARNING':
            return 'rgba(255, 252, 71, 0.8)';
        case 'FAILED':
            return 'rgba(255, 66, 66, 0.73)';
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
            throw new Error('Failed to delete job');
        }

        // Entfernen Sie die Zeile aus der Tabelle, wenn die Anfrage erfolgreich war
        const rowToRemove = document.getElementById(`job-${jobId}`);
        rowToRemove.remove();
    } catch (error) {
        console.error('Error deleting job:', error.message);
    }
}

// Fügen Sie einen Event-Listener hinzu, um auf Klicks auf Lösch-Buttons zu reagieren
var deleteButtons = document.querySelectorAll('.deleteButton');
deleteButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        var jobId = button.dataset.jobId; // Nehmen Sie die Job-ID aus dem Dataset
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