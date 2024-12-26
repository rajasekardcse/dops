async function fetchData() {
    const sheetId = '1REChA-k-xs8zezOCeBHXTWGPBHxqtnehdllqm9drFYQ'; // Replace with your Google Sheets ID
    const apiKey = 'AIzaSyAQS4wnHD4cw2y6VoqdyXqiOnmaV6PAQxc';   // Replace with your API Key
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
    const container = document.querySelector('#sectionsContainer');
    if (!container) {
        console.error('Error: #sectionsContainer element not found in DOM');
        return;
    }

    const sections = {};

    // Organize rows into sections based on the 'Section' column
    rows.slice(1).forEach(row => {
        const [_, section, command, description] = row; // Skip S.No column
        if (!section || !command || !description) {
            console.warn('Skipping invalid row:', row);
            return;
        }
        if (!sections[section]) {
            sections[section] = [];
        }
        sections[section].push({ command, description });
    });

    // Create sections dynamically
    Object.keys(sections).forEach(sectionName => {
        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('section');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('section-header');
        headerDiv.textContent = sectionName;
        headerDiv.addEventListener('click', () => {
            const table = sectionDiv.querySelector('.commands-table');
            table.classList.toggle('hidden');
        });

        const table = document.createElement('table');
        table.classList.add('commands-table', 'hidden');
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Command</th>
                <th>Description</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        sections[sectionName].forEach(({ command, description }) => {
            const tr = document.createElement('tr');
            const commandCell = document.createElement('td');
            commandCell.textContent = command;
            commandCell.style.cursor = 'pointer';
            commandCell.addEventListener('click', () => copyToClipboard(command));

            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = description;

            tr.appendChild(commandCell);
            tr.appendChild(descriptionCell);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        sectionDiv.appendChild(headerDiv);
        sectionDiv.appendChild(table);
        container.appendChild(sectionDiv);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`Copied to clipboard: ${text}`);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Ensure DOM is loaded before running the script
document.addEventListener('DOMContentLoaded', fetchData);
