let linearUnitSuffix = ' [m]';
let angularUnitSuffix = ' [dms]'
let linearPrecision = 3;
let angularPrecision = 4;

export function addSummaryTable (arrCTAResults, div) {
    const header = document.createElement('h2');
    header.innerText = 'Displacement Summary';
    div.append(header);

    const tableElement = document.createElement('table');
    div.append(tableElement);

    const tableHeaderElement = document.createElement('thead');
    const headerRowElement = tableHeaderElement.insertRow();
    const columnNames = new Map([
        ['pID', 'BFC Point ID'],
        ['N', 'Northing' + linearUnitSuffix],
        ['E', 'Easting' + linearUnitSuffix],
        ['H', 'Height' + linearUnitSuffix],
        ['chainage', 'Chainage' + linearUnitSuffix],
        ['rotation', 'Rotation' + angularUnitSuffix],
        ['bfr', 'Radius' + linearUnitSuffix],
        ['ptsMeasured', 'Measured Points'],
        ['ptsUsed', 'Used Points'],
        ['tunnelCentreHOffset', 'Centre Horizontal Offset' + linearUnitSuffix],
        ['tunnelCentreVOffset', 'Centre Vertical Offset' + linearUnitSuffix],
        ['vTiltDirection', 'Vertical Direction'],
        ['vTiltValue', 'Vertical Tilt' + linearUnitSuffix],
        ['hTiltDirection', 'Horizontal Direction'],
        ['hTiltValue', 'Horizontal Tilt' + linearUnitSuffix],
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
        tableRowElement.insertCell().textContent = result['N'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = result['E'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = result['H'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = result['chainage'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = result['rotation'].toFixed(angularPrecision);
        tableRowElement.insertCell().textContent = result['bfr'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = result['ptsMeasured'];
        tableRowElement.insertCell().textContent = result['ptsUsed'];
        tableRowElement.insertCell().textContent = result['tunnelDesignCentreHOffset'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = result['tunnelDesignCentreVOffset'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = result['vTiltDirection'];
        tableRowElement.insertCell().textContent = Math.abs(result['vTiltValue']).toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = result['hTiltDirection'];
        tableRowElement.insertCell().textContent = Math.abs(result['hTiltValue']).toFixed(linearPrecision);
    }
    tableElement.append(tableBodyElement);
}