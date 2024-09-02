export function addResultTable (objCTARes, resultDiv) {
    
    const tableElement = document.createElement('table');
    resultDiv.append(tableElement);

    const tableHeaderElement = document.createElement('thead');
    const headerRowElement = tableHeaderElement.insertRow();
    const columnNames = new Map([
        ['pID', 'Point ID'],
        ['N', 'Northing'],
        ['E', 'Easting'],
        ['H', 'Height'],
        ['chainage', 'Chainage'],
        ['alignmentHOffset', 'CL Offset'],
        ['alignmentVOffset', 'CL Height Diff'],
        ['rotation', 'Rotation'],
        ['radialDistance', 'Radial Distance'],
        ['radiusResidual', 'Radius Deviation'],
        ['tunnelCentreHOffset', 'Centre Horizontal Offset'],
        ['tunnelCentreVOffset', 'Centre Vertical Offset'],
    ]);
    
    for (const value of columnNames.values()) {
        const thElement = document.createElement('th');
        thElement.textContent = value;
        headerRowElement.append(thElement);
    }
    tableElement.append(tableHeaderElement);

    const tableBodyElement = document.createElement('tbody');
    for (const measPoint of objCTARes.measuredPoints) {
        const tableRowElement = tableBodyElement.insertRow();
        tableRowElement.insertCell().textContent = measPoint['pID'];
        tableRowElement.insertCell().textContent = measPoint['N'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['E'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['H'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['chainage'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['alignmentHOffset'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['alignmentVOffset'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['rotation'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['radialDistance'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['radiusResidual'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['tunnelBFCHOffset'].toFixed(3);
        tableRowElement.insertCell().textContent = measPoint['tunnelBFCVOffset'].toFixed(3);
    }
    tableElement.append(tableBodyElement);
}