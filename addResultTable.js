let linearUnitSuffix = ' [m]';
let angularUnitSuffix = ' [dms]'
let linearPrecision = 3;
let angularPrecision = 4;

export function addResultTable (objCTARes, resultDiv) {
    
    const tableElement = document.createElement('table');
    resultDiv.append(tableElement);

    const tableHeaderElement = document.createElement('thead');
    const headerRowElement = tableHeaderElement.insertRow();
    const columnNames = new Map([
        ['pID', 'Measured Point ID'],
        ['N', 'Northing' + linearUnitSuffix],
        ['E', 'Easting' + linearUnitSuffix],
        ['H', 'Height' + linearUnitSuffix],
        ['chainage', 'Chainage' + linearUnitSuffix],
        ['alignmentHOffset', 'CL Offset' + linearUnitSuffix],
        ['alignmentVOffset', 'CL Height Diff' + linearUnitSuffix],
        ['rotation', 'Rotation' + angularUnitSuffix],
        ['radialDistance', 'Radial Distance' + linearUnitSuffix],
        ['radiusResidual', 'Radius Deviation' + linearUnitSuffix],
        ['tunnelCentreHOffset', 'Centre Horizontal Offset' + linearUnitSuffix],
        ['tunnelCentreVOffset', 'Centre Vertical Offset' + linearUnitSuffix],
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
        tableRowElement.insertCell().textContent = measPoint['N'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['E'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['H'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['chainage'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['alignmentHOffset'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['alignmentVOffset'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['rotation'].toFixed(angularPrecision);
        tableRowElement.insertCell().textContent = measPoint['radialDistance'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['radiusResidual'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['tunnelBFCHOffset'].toFixed(linearPrecision);
        tableRowElement.insertCell().textContent = measPoint['tunnelBFCVOffset'].toFixed(linearPrecision);
    }
    tableElement.append(tableBodyElement);
}