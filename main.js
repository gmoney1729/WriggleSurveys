import '/style.css';
import { getCTADOM } from "./getCTADOM";
import { addResults } from "./addResults";
import { enableDragDrop, noResultsHandler, validResultHandler } from './dragDrop';
import { addDemo } from './loadDemo';

export function printCTADOM (xmlFile) {
  const arrCTAResults = getCTADOM(xmlFile);
  if (arrCTAResults.length > 0) {
    validResultHandler();
    addResults(arrCTAResults);
  } else {
    noResultsHandler();
  }
}

enableDragDrop();
addDemo();