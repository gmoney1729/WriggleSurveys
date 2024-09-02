export function addSummaryTable (arrCTAResults, div) {
    const header = document.createElement('h2');
    header.innerText = 'Displacement Summary';
    div.append(header);

    const tableElement = document.createElement('table');
    div.append(tableElement);

    const tableHeaderElement = document.createElement('thead');
    const headerRowElement = tableHeaderElement.insertRow();
    const columnNames = new Map([
        ['pID', 'Point ID'],
        ['N', 'Northing'],
        ['E', 'Easting'],
        ['H', 'Height'],
        ['chainage', 'Chainage'],
        ['rotation', 'Rotation'],
        ['bfr', 'Radius'],
        ['ptsMeasured', 'Measured Points'],
        ['ptsUsed', 'Used Points'],
        ['tunnelCentreHOffset', 'Centre Horizontal Offset'],
        ['tunnelCentreVOffset', 'Centre Vertical Offset'],
        ['vTiltDirection', 'Vertical Direction'],
        ['vTiltValue', 'Vertical Tilt'],
        ['hTiltDirection', 'Horizontal Direction'],
        ['hTiltValue', 'Horizontal Tilt'],
    ]);
    
    for (const value of columnNames.values()) {
        const thElement = document.createElement('th');
        thElement.textContent = value;
        headerRowElement.append(thElement);
    }
    tableElement.append(tableHeaderElement);

    const tableBodyElement = document.createElement('tbody');
    for (const result of arrCTAResults) {
        const tableRowElement = tableBodyElement.insertRow();
        tableRowElement.insertCell().textContent = result['pID'];
        tableRowElement.insertCell().textContent = result['N'].toFixed(3);
        tableRowElement.insertCell().textContent = result['E'].toFixed(3);
        tableRowElement.insertCell().textContent = result['H'].toFixed(3);
        tableRowElement.insertCell().textContent = result['chainage'].toFixed(3);
        tableRowElement.insertCell().textContent = result['rotation'].toFixed(3);
        tableRowElement.insertCell().textContent = result['bfr'].toFixed(3);
        tableRowElement.insertCell().textContent = result['ptsMeasured'];
        tableRowElement.insertCell().textContent = result['ptsUsed'];
        tableRowElement.insertCell().textContent = result['tunnelDesignCentreHOffset'].toFixed(3);
        tableRowElement.insertCell().textContent = result['tunnelDesignCentreVOffset'].toFixed(3);
        tableRowElement.insertCell().textContent = result['vTiltDirection'];
        tableRowElement.insertCell().textContent = Math.abs(result['vTiltValue']).toFixed(3);
        tableRowElement.insertCell().textContent = result['hTiltDirection'];
        tableRowElement.insertCell().textContent = Math.abs(result['hTiltValue']).toFixed(3);
    }
    tableElement.append(tableBodyElement);
}