//index.js

const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

const apiUrl = '/scheduler/api/jobs';
const apiUrlDelete = '/scheduler/api/job';

async function getJobs() {
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    });

    const jobs = await response.json();
    console.log(jobs);
    displayJobs(jobs);
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
            { value: job.status ? statusNoneValue(job.status) : '- - -' },
            { value: job.activeFrom ? formatDate(job.activeFrom) : '- - -' },
            { value: job.lastRun ? formatDate(job.lastRun) : '- - -' },
            { value: job.nextRun ? formatDate(job.nextRun) : '- - -' },
            { value: job.activeUntil ? formatDate(job.activeUntil) : '- - -' },
            { value: job.schedule },
            {
                value: `
                <div class="edit"><a href="edit.html?id=${job.id}"><svg width="16" height="16"><use xlink:href="#edit-icon"></use></svg></a></div>
                <div class="delete"><button class="deleteButton" data-job-id="${job.id}"><svg width="16" height="16"><use xlink:href="#delete-icon"></use></svg></button></div>
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
        return new Date(dateString).toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    }

    function statusNoneValue(status) {
        if (status == 'NONE') {
            return '- - -';
        }
        else {
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
                return 'rgba(225, 225, 225, 1)';
            default:
                return '';
        }
    }

    async function deleteJob(jobId) {
        try {
            const response = await fetch(`${apiUrlDelete}/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.log(jobId);
                throw new Error('Failed to delete job');
            }
            window.location.href = 'index.html';

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
            Swal.fire({
                title: "Wollen Sie diesen Job wirklich loeschen?",
                text: "Wenn sie dies bestaetigen wird der ausgewaehlte Job augenblicklich und unwiderruflich geloescht!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                confirmButtonText: "Ok"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteJob(jobId);
                }
            });
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
        var backgroundColor = getComputedStyle(row).backgroundColor;

        // Bedingungen für Vergleich von Hintergrundfarben
        var colorMatches =
            (selectedStatus === "all") ||
            (selectedStatus === "SUCCESS" && (
                backgroundColor === "rgba(61, 255, 61, 0.75)" || backgroundColor === "rgb(61, 255, 61)"
            )) ||
            (selectedStatus === "FAILED" && (
                backgroundColor === "rgba(255, 66, 66, 0.73)" || backgroundColor === "rgb(255, 66, 66)"
            )) ||
            (selectedStatus === "WARNING" && (
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

//Funktion um zum Scheduler zurückkzukehren
function redirectToEditPage() {
    window.location.href = `edit.html?id=0`;
}

//Funktion um neue Seite zu speichern
function createPage() {
    window.location.href = `create.html`;
}