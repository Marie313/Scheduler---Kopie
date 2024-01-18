//index.js
// Laden der ausgewählten Variable-ID aus der URL
const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'http://20.166.67.112:82/jobs';

async function getJobs() {
    const response = await fetch(proxyUrl + apiUrl, {
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
        { value: job.identification },
        { value: job.name },
        {
            value: `
                <div>
                    <input type="checkbox" class="my-checkbox" ${job.enabled ? 'checked' : ''}>
                    <p class="message">${job.enabled ? 'true' : 'false'}</p>
                </div>
            `,
        },
        { value: job.status },
        { value: job['last-run'] ? formatDate(job['last-run']) : 'not available'},
        { value: job['next-run'] ? formatDate(job['next-run']) : 'not available'},
        { value: updateInterval(job['last-run'],job['next-run'])},
        {
            value: `
                <div class="edit"><a href="edit.html?id=${job.identification}"><svg width="16" height="16"><use xlink:href="#edit-icon"></use></svg></a></div>
                <div class="delete"><button onClick="alert('really want to delete this process?')" class="deleteButton"><svg width="16" height="16"><use xlink:href="#delete-icon"></use></svg></button></div>
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

    var checkbox = document.querySelectorAll(".my-checkbox");
    var message = document.querySelectorAll(".message");
    checkbox.forEach(function(checkbox, index){
        checkbox.addEventListener('change', function(){
            if (checkbox.checked) {
                message[index].textContent = 'true';
            } else {
                message[index].textContent = 'false';
            }
        });
    });
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}



function getBackgroundColor(status) {
    switch (status) {
        case 'success':
            return 'rgba(61, 255, 61, 0.75)';
        case 'warning':
            return 'rgba(255, 252, 71, 0.8)';
        case 'failed':
            return 'rgba(255, 66, 66, 0.73)';
        default:
            return '';
    }
}

var deleteButton = document.querySelectorAll('.deleteButton')
deleteButton.forEach(function(button){
    button.addEventListener('click',function(){
        var row = button.closest('tr');
        row.remove();
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
