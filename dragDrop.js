import { printCTADOM } from "./main";

const app = document.getElementById('app');
const dropArea = document.getElementById('dropArea');
const dropText = document.getElementById('dropText')
const resultsArea = document.getElementById('results');
const defaultDropText = dropText.innerHTML;
let isReadReady = false;
let dragCounter = 0;

export function enableDragDrop () {
    app.addEventListener('drop', dropHandler);
    app.addEventListener('dragenter', dragEnterHandler);
    app.addEventListener('dragleave', dragLeaveHandler);
    app.addEventListener('dragover', e => e.preventDefault());
}

function dropHandler (e) {
    e.preventDefault();
    dragCounter = 0;
    if (isReadReady) {
        const file = e.dataTransfer.items[0].getAsFile();
        if (!file) {
            invalidFileDropHanlder();
        } else {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                printCTADOM(reader.result);
            })
            reader.addEventListener('error', () => {
                dropText.textContent = 'Error encountered while processing the file. Try another valid HeXML file';
            })
            reader.readAsText(file);
        }
    } else {
        invalidFileDropHanlder();
    }
}



function dragEnterHandler (e) {
    e.preventDefault();
    ++dragCounter;
    isReadReady = false;
    if (e.dataTransfer.items.length === 0) {
        invalidFileDragHandler();
        dropText.textContent = 'No files found. Drop a valid HeXML file with CTA results.'
    } else if (e.dataTransfer.items.length > 1) {
        invalidFileDragHandler();
        dropText.textContent = 'Multiple files detected. Drop exactly one file with CTA results.'
    } else {
        if (e.dataTransfer.items[0].type !== 'text/xml' && e.dataTransfer.items[0].type !== 'application/xml') {
            invalidFileDragHandler();
            dropText.textContent = 'Not an XML file. Drop a valid HeXML file with CTA results.'
        } else {
            validFileDragHandler();
            dropText.textContent = 'An XML file detected.'
            isReadReady = true;
        }
    }
}

function dragLeaveHandler (e) {
    e.preventDefault();
    --dragCounter;
    if (dragCounter === 0) {
        dropArea.className = '';
        resultsArea.classList[0] === 'appWithNoResults' ? dropArea.classList.add('dragNone') : dropArea.classList.add('dragNoneWithResults');
        dropText.innerHTML = defaultDropText;
    }
}

function invalidFileDragHandler () {
    dropArea.className = '';
    resultsArea.classList[0] === 'appWithNoResults' ? dropArea.classList.add('dragInvalid') : dropArea.classList.add('dragInvalidWithResults');
}

function validFileDragHandler () {
    dropArea.className = '';
    resultsArea.classList[0] === 'appWithNoResults' ? dropArea.classList.add('dragValid') : dropArea.classList.add('dragValidWithResults');
}

function invalidFileDropHanlder () {
    dropText.textContent = 'Multiple files or an invalid file dropped. Drop a single valid HeXML file with CTA results.';
}

export function noResultsHandler () {
    dropArea.className = '';
    resultsArea.classList[0] === 'appWithNoResults' ? dropArea.classList.add('dragInvalid') : dropArea.classList.add('dragInvalidWithResults');
    dropText.textContent = 'No Check Tunnel Axis (CTA) results found. Drop a HeXML file with CTA results.'
}

export function validResultHandler () {
    dropArea.className = '';
    dropArea.classList.add('dragNoneWithResults');
    dropText.textContent = 'Drop another file';
    resultsArea.className = '';
}