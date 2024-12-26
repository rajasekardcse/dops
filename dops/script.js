document.addEventListener('DOMContentLoaded', function () {
    fetchData();
});

async function fetchData() {
    const sheetId = '1REChA-k-xs8zezOCeBHXTWGPBHxqtnehdllqm9drFYQ'; // Replace with your Google Sheets ID
    const apiKey = 'AIzaSyAQS4wnHD4cw2y6VoqdyXqiOnmaV6PAQxc'; // Replace with your API Key
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Commands?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        if (!data.values || data.values.length < 2) {
            throw new Error('No valid data found in the sheet');
        }

        processSections(data.values); // Process rows into sections
    } catch (error) {
        console.error('Error:', error);
        document.body.innerHTML = '<h2>Failed to load data. Please check the console for details.</h2>';
    }
}

function processSections(rows) {
    const sectionsContainer = document.getElementById('sectionsContainer');
    
    const sectionsMap = {}; // To store section data, key will be section name
    
    // Start from the second row (skip headers)
    rows.slice(1).forEach((row) => {
        const section = row[1]; // Assuming section name is in column 2
        const command = row[2]; // Command is in column 3
        const description = row[3]; // Description is in column 4
        
        // If section doesn't exist in the map, initialize it
        if (!sectionsMap[section]) {
            sectionsMap[section] = [];
        }

        // Add command and description to the section's array
        sectionsMap[section].push({ command, description });
    });

    // Now render each section based on the section data in the map
    let sectionCounter = 1; // Start from section 1
    for (let sectionName in sectionsMap) {
        const sectionData = sectionsMap[sectionName];
        addSectionToDOM(sectionsContainer, sectionName, sectionData, sectionCounter);
        sectionCounter++; // Increment section number
    }
}

function addSectionToDOM(container, sectionName, sectionData, sectionCounter) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');

    // Add toggle button for expanding/collapsing
    const toggleButton = document.createElement('button');
    toggleButton.classList.add('toggle-button');
    toggleButton.textContent = `[+] ${sectionName}`;
    toggleButton.onclick = () => toggleSectionContent(sectionContent);
    
    // Create the section content that will be toggled
    const sectionContent = document.createElement('div');
    sectionContent.style.display = 'none'; // Initially hidden

    // Create a table for the section's commands and descriptions
    const table = document.createElement('table');
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>S.No</th><th>Command</th><th>Description</th>';
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    sectionData.forEach((data, index) => {
        const row = document.createElement('tr');
        
        // Display the serial number as "section number.row number"
        const serialNumberCell = document.createElement('td');
        serialNumberCell.textContent = `${sectionCounter}.${index + 1}`; // Correct serial number format
        row.appendChild(serialNumberCell);

        const commandCell = document.createElement('td');
        commandCell.textContent = data.command;
        row.appendChild(commandCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = data.description;
        row.appendChild(descriptionCell);

        // Add click functionality to copy command to clipboard
        row.onclick = () => {
            copyToClipboard(data.command);
            alert(`Copied: ${data.command}`);
        };

        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);

    // Add table and toggle button to section div
    sectionContent.appendChild(table);
    sectionDiv.appendChild(toggleButton);
    sectionDiv.appendChild(sectionContent);

    // Add section div to container
    container.appendChild(sectionDiv);
}

function toggleSectionContent(sectionContent) {
    const isHidden = sectionContent.style.display === 'none';
    sectionContent.style.display = isHidden ? 'block' : 'none';
}

function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}
