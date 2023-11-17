var checkbox = document.querySelectorAll(".my-checkbox");
var message = document.querySelectorAll(".message");
checkbox.forEach(function(checkbox, index){
    checkbox.addEventListener('change',function(){
        if (checkbox.checked){
            message[index].textContent='Enabled'}
        else {
            message[index].textContent='Disabled'}
    });
});
// Laden der ausgewählten Variable-ID aus der URL
const urlParams = new URLSearchParams(window.location.search);
const selectedVariableId = urlParams.get('id');

// Alle Jobs in einem Array
const allJobs = [
    {
        id: 1234,
        name: "Beispiel_1",
        enabled: true,
        lastRun: "2023-10-12T11:24",
        nextRun: "2023-10-13T11:24",
        backgroundColor: "rgba(61, 255, 61, 0.75)"
    },
    {
        id: 2023,
        name: "Beispie_2",
        enabled: true,
        lastRun: "2023-06-14T22:24",
        nextRun: "2023-12-14T22:24",
        backgroundColor: "rgba(61, 255, 61, 0.75)"
    },
    {
        id: 5678,
        name: "Beispie_3",
        enabled: true,
        lastRun: "2023-09-12T10:19",
        nextRun: "2023-11-12T10:15",
        backgroundColor: "rgb(255, 252, 71, 0.8)"
    },
    {
        id: 1010,
        name: "Beispiel_4",
        enabled: false,
        lastRun: "-",
        nextRun: "-",
    },
    {
        id: 3103,
        name: "Beispiel_5",
        enabled: true,
        lastRun: "2023-10-08T09:35",
        nextRun: "2023-10-18T09:35",
        backgroundColor: "rgba(255, 66, 66, 0.726)"
    },
    {
        id: 9876,
        name: "Beispiel_6",
        enabled: true,
        lastRun: "2023-10-12T10:01",
        nextRun: "2023-10-13T10:02",
        backgroundColor: "rgb(61,255, 61, 0.75)"
    },
    {
        id: 2005,
        name: "Beispiel_7",
        enabled: false,
        lastRun: "2015-12-30T04:24",
        nextRun: "-",
        backgroundColor: "rgba(61, 255, 61, 0.75)"
    }
];
// Anzeigen der Jobs in der Tabelle
const jobDetailsTableBody = document.getElementById('jobTable');

    allJobs.forEach(job => {
    const jobDetailRow = document.createElement('tr');
    jobDetailRow.className = 'job-detail';

    const jobDetailCells = [
        { value: job.id},
        { value: job.name},
        { 
            value: `<input type="checkbox" class="enabled-checkbox" ${job.enabled ? 'checked' : ''} disabled>`
        },
        { value: job.lastRun },
        { value: job.nextRun },
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
});

var deleteButton = document.querySelectorAll('.deleteButton')
deleteButton.forEach(function(button){
    button.addEventListener('click',function(){
        var row = button.closest('tr');
        row.remove();
    });
});