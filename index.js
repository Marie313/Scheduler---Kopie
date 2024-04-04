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
            { value: job.schedule ? calculateUnit(job.schedule) : '- - -' },
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
                return 'rgb(122, 255, 135)';
            case 'WARNING':
                return 'rgb(255, 253, 124)';
            case 'FAILED':
                return 'rgb(255, 136, 146)';
            case 'NONE':
                return 'rgba(225, 225, 225, 1)';
            default:
                return '';
        }
    }

    function calculateUnit (seconds){
        const weeks = Math.floor(seconds / 604800);
        seconds %= 604800;
        const days = Math.floor(seconds / 86400);
        seconds %= 86400;
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
        
        return `${weeks.toString().padStart(2, '0')}.${days.toString().padStart(2, '0')}.${hours.toString().padStart(2, '0')}.${minutes.toString().padStart(2, '0')}.${seconds.toString().padStart(2, '0')}`;
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

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable2");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase() ) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase() ) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++;
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}

function sortNumberTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable2");
    switching = true;
    dir = "asc";
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}

function convertToISODate(dateString) {
    var parts = dateString.split(", ");
    var dateParts = parts[0].split(".");
    var timeParts = parts[1].split(":");
    var isoString = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0] + "T" + timeParts[0] + ":" + timeParts[1] + ":" + timeParts[2];
    return isoString;
}

function sortDateTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable2");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (new Date(getDateFromText(x.innerHTML)) > new Date(getDateFromText(y.innerHTML))) {
                    console.log(new Date(getDateFromText(x.innerHTML)));
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (new Date(getDateFromText(x.innerHTML)) < new Date(getDateFromText(y.innerHTML))) {
                    shouldSwitch = true;
                    break;
                }
            }

        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function getDateFromText(text) {
    // Die Datumszeichenfolge im Format "dd.mm.yyyy, hh:mm:ss" aufteilen
    var parts = text.split(", ");
    var datePart = parts[0];
    var timePart = parts[1];

    // Die Teile der Datumszeichenfolge aufteilen
    var dateParts = datePart.split(".");
    var timeParts = timePart.split(":");

    // Ein gültiges Datum-Objekt erstellen
    var year = parseInt(dateParts[2]);
    var month = parseInt(dateParts[1]) - 1; // Monate werden in JavaScript von 0 (Januar) bis 11 (Dezember) nummeriert
    var day = parseInt(dateParts[0]);
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    var seconds = parseInt(timeParts[2]);

    return new Date(year, month, day, hours, minutes, seconds);
}

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
                backgroundColor === "rgba(122, 255, 135, 1)" || backgroundColor === "rgb(122, 255, 135)"
            )) ||
            (selectedStatus === "FAILED" && (
                backgroundColor === "rgba(255, 136, 146, 1)" || backgroundColor === "rgb(255, 136, 146)"
            )) ||
            (selectedStatus === "WARNING" && (
                backgroundColor === "rgba(255, 253, 124, 1)" || backgroundColor === "rgb(255, 253, 124)"
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