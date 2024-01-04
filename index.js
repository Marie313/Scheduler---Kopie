//index.js
// Laden der ausgewählten Variable-ID aus der URL
const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

const allJobs = [
    {
        id: 1234,
        name: "Beispiel_1",
        enabled: true,
        status: "success",
        lastRun: "2024-01-12T11:24",
        nextRun: "2024-01-13T11:24",
        interval: "every_86.400_seconds",
        backgroundColor: "rgba(61, 255, 61, 0.75)"
    },
    {
        id: 2023,
        name: "Beispiel_2",
        enabled: true,
        status: "success",
        lastRun: "2023-06-14T22:24",
        nextRun: "2023-12-14T22:24",
        interval: "every_15.768.000_seconds",
        backgroundColor: "rgba(61, 255, 61, 0.75)"
    },
    {
        id: 5678,
        name: "Beispiel_3",
        enabled: true,
        status: "warning",
        lastRun: "2023-09-12T10:19",
        nextRun: "2023-11-12T10:15",
        interval: "every_7.884.000_seconds",
        backgroundColor: "rgba(255, 252, 71, 0.8)"
    },
    {
        id: 1010,
        name: "Beispiel_4",
        enabled: false,
        status: "none",
        lastRun: "-",
        nextRun: "-",
        interval: "-",
    },
    {
        id: 3103,
        name: "Beispiel_5",
        enabled: true,
        status: "failed",
        lastRun: "2023-10-08T09:35",
        nextRun: "2023-10-18T09:35",
        interval: "every_864.000_seconds",
        backgroundColor: "rgba(255, 66, 66, 0.73)"
    },
    {
        id: 9876,
        name: "Beispiel_6",
        enabled: true,
        status: "success",
        lastRun: "2023-10-12T10:01",
        nextRun: "2023-10-13T10:02",
        interval: "every_60_seconds",
        backgroundColor: "rgba(61,255, 61, 0.75)"
    },
    {
        id: 2005,
        name: "Beispiel_7",
        enabled: false,
        status: "success",
        lastRun: "2015-12-30T04:24",
        nextRun: "-",
        interval: "-",
        backgroundColor: "rgba(61, 255, 61, 0.75)"
    }
];
    const jobDetailsTableBody = document.getElementById('jobTable');

    allJobs.forEach(job => {
    const jobDetailRow = document.createElement('tr');
    jobDetailRow.className = 'job-detail';
    
    const jobDetailCells = [
        { value: job.id },
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
        { value: job.lastRun },
        { value: job.nextRun },
        { value: job.interval},
        {
            value: `
                <div class="edit"><a href="edit.html?id=${job.id}"><svg width="16" height="16"><use xlink:href="#edit-icon"></use></svg></a></div>
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

    jobDetailRow.style.backgroundColor = job.backgroundColor || '';

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

var deleteButton = document.querySelectorAll('.deleteButton')
deleteButton.forEach(function(button){
    button.addEventListener('click',function(){
        var row = button.closest('tr');
        row.remove();
    });
});

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
