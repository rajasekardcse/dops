	async function fetchData() {
    const sheetId = '1REChA-k-xs8zezOCeBHXTWGPBHxqtnehdllqm9drFYQ'; // Replace with your Google Sheets ID
    const apiKey = 'AIzaSyAQS4wnHD4cw2y6VoqdyXqiOnmaV6PAQxc';   // Replace with your API Key
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Commands?key=${apiKey}`;
	//https://sheets.googleapis.com/v4/spreadsheets/1REChA-k-xs8zezOCeBHXTWGPBHxqtnehdllqm9drFYQ/values/Commands?key=AIzaSyAQS4wnHD4cw2y6VoqdyXqiOnmaV6PAQxc
	
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        populateTable(data.values); // Pass the rows to populate the table
    } catch (error) {
        console.error('Error:', error);
        document.body.innerHTML = '<h2>Failed to load data. Please check the console for details.</h2>';
    }
}

function populateTable(rows) {
    const tableBody = document.querySelector('#commandsTable tbody');
    rows.slice(1).forEach((row, index) => {
        const tr = document.createElement('tr');
        const rowData = [index + 1, ...row]; // Add serial number to each row

        rowData.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData;
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
}

// Fetch and display data from Google Sheets
fetchData();
