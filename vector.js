const G = 9.81
const SCALE = 100
const BASEX = 250
const BASEY = 250

const generateButton = document.getElementsByClassName("generate-button")[0]

function makeSVGElement(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
    }
    return el;
}

function deg2rad(angle) {
    return angle * (Math.PI / 180)
}

generateButton.addEventListener("click", () => {
    const svg = document.getElementsByTagName('svg')[0]
    const forces = []
    const angles = []
    const color = ['red', 'green', 'blue', 'purple']
    const inputValues = document.getElementsByClassName("input-value")
    for (let i = 0; i < inputValues.length; i++) {
        const force = parseFloat(inputValues[i].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value) * G
        const angle = parseFloat(inputValues[i].getElementsByTagName('div')[1].getElementsByTagName('input')[0].value)

        forces.push(force)
        angles.push(angle)

        const line = makeSVGElement('line', { 
            x1: BASEX,
            y1: BASEY,
            x2: BASEX + force * Math.cos(deg2rad(angle)) * SCALE,
            y2: BASEY - force * Math.sin(deg2rad(angle)) * SCALE,
            stroke: color[i],
            "stroke-width": "2px",
        });

        svg.appendChild(line);
    }

    x1 = forces[0] * Math.cos(deg2rad(angles[0])) * SCALE
    y1 = forces[0] * Math.sin(deg2rad(angles[0])) * SCALE
    x2 = forces[1] * Math.cos(deg2rad(angles[1])) * SCALE
    y2 = forces[1] * Math.sin(deg2rad(angles[1])) * SCALE
    x3 = x1 + x2
    y3 = y1 + y2
    const line1 = makeSVGElement('line', { 
        x1: BASEX + x1,
        y1: BASEY - y1,
        x2: BASEX + x3,
        y2: BASEY - y3,
        stroke: color[3],
        "stroke-width": "2px",
        "stroke-dasharray": "2px",
    });
    const line2 = makeSVGElement('line', { 
        x1: BASEX + x2,
        y1: BASEY - y2,
        x2: BASEX + x3,
        y2: BASEY - y3,
        stroke: color[3],
        "stroke-width": "2px",
        "stroke-dasharray": "2px",
    });
    const line3 = makeSVGElement('line', { 
        x1: BASEX,
        y1: BASEY,
        x2: BASEX + x3,
        y2: BASEY - y3,
        stroke: color[3],
        "stroke-width": "2px",
        "stroke-dasharray": "2px",
    });
    svg.appendChild(line1);
    svg.appendChild(line2);
    svg.appendChild(line3);
})