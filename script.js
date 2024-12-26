async function fetchData() {
    const sheetId = '1REChA-k-xs8zezOCeBHXTWGPBHxqtnehdllqm9drFYQ'; // Replace with your Google Sheets ID
    const apiKey = 'AIzaSyAQS4wnHD4cw2y6VoqdyXqiOnmaV6PAQxc';   // Replace with your API Key
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Commands?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        processSections(data.values); // Process data to display in sections
    } catch (error) {
        console.error('Error:', error);
        document.body.innerHTML = '<h2>Failed to load data. Please check the console for details.</h2>';
    }
}

function processSections(rows) {
    const sections = {};
    rows.slice(1).forEach(row => {
        const section = row[1];
        if (!sections[section]) {
            sections[section] = [];
        }
        sections[section].push(row);
    });

    const sectionsContainer = document.querySelector('#sections');

    // Add universal toggle button
    const toggleContainer = document.createElement('div');
    toggleContainer.style.display = 'flex';
    toggleContainer.style.justifyContent = 'flex-start';
    toggleContainer.style.marginBottom = '10px';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Expand All';
    toggleButton.style.backgroundColor = '#EFF3EA';
    toggleButton.style.color = 'gray';
    toggleButton.style.padding = '10px 20px';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';

    toggleButton.addEventListener('click', () => toggleAllSections(toggleButton));
    toggleContainer.appendChild(toggleButton);
    sectionsContainer.appendChild(toggleContainer);

    Object.keys(sections).forEach(section => {
        const sectionData = sections[section];
        const sectionElement = createSection(section, sectionData);
        sectionsContainer.appendChild(sectionElement);
    });
}

function createSection(section, rows) {
    const sectionElement = document.createElement('div');
    sectionElement.classList.add('collapsed'); // Start collapsed by default

    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header');
    
    sectionHeader.innerHTML += section;
    sectionHeader.addEventListener('click', () => toggleSection(sectionElement));

    const sectionTable = document.createElement('table');
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th class="sno-column">S.No</th>
            <th>Command</th>
            <th>Description</th>
        </tr>
    `;
    sectionTable.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    rows.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-row', index);
        
        const sno = `${index + 1}`; // Sequential numbering
        tr.innerHTML = `
            <td>${sno}</td>
            <td class="command">${row[2]}</td>
            <td>${row[3]}</td>
        `;
        
        tr.addEventListener('click', () => copyToClipboard(row[2], tr));
        tableBody.appendChild(tr);
    });
    sectionTable.appendChild(tableBody);
    sectionElement.appendChild(sectionHeader);
    sectionElement.appendChild(sectionTable);
    return sectionElement;
}

function toggleSection(sectionElement) {
    sectionElement.classList.toggle('collapsed');
}

function toggleAllSections(toggleButton) {
    const sections = document.querySelectorAll('.section-container > div');
    const isCollapsed = toggleButton.textContent === 'Expand All';

    sections.forEach(section => {
        if (isCollapsed) {
            section.classList.remove('collapsed');
        } else {
            section.classList.add('collapsed');
        }
    });

    toggleButton.textContent = isCollapsed ? 'Collapse All' : 'Expand All';
}

function copyToClipboard(command, row) {
    const popup = document.getElementById('popup');
    popup.textContent = `Copied: ${command}`;
    popup.style.display = 'block';
    
    setTimeout(() => {
        popup.style.display = 'none';
    }, 4000);
    
    row.classList.add('highlight');
    setTimeout(() => {
        row.classList.remove('highlight');
    }, 2000);
    
    navigator.clipboard.writeText(command).then(() => {
        console.log('Command copied to clipboard');
    }).catch(err => {
        console.error('Error copying command: ', err);
    });
}

fetchData();
