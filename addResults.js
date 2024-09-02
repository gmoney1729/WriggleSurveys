import { drawCanvas } from "./drawCanvas";
import { addResultTable } from "./addResultTable";
import { addSummaryTable } from "./addSummaryTable";

const resultsArea = document.getElementById('results');

export function addResults (arrCTAResults) {
    resultsArea.textContent = '';
    const summaryTableDiv = document.createElement('div');
    addSummaryTable(arrCTAResults, summaryTableDiv);
    resultsArea.append(summaryTableDiv);
    
    for (const objCTARes of arrCTAResults) {
        const resultDiv = document.createElement('div');
        drawCanvas(objCTARes, resultDiv);
        addResultTable(objCTARes, resultDiv);
        resultsArea.append(resultDiv);
    }
}