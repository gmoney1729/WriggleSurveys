import { printCTADOM } from "./main";

const demoButton = document.getElementById('demo');

export function addDemo () {
    demoButton.addEventListener('click', loadDemo);
}

async function loadDemo(e) {
    e.preventDefault();
    fetch('./sample_data/240 Down Wriggle.xml')
        .then(res => res.text())
        .then(str => printCTADOM(str));
}