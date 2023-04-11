const G = 9.81
const SCALE = 170
const BASEX = 250
const BASEY = 250
const arrowLength = 15
const arrowAngle = 30
const textLength = 15

const generateButton = document.getElementsByClassName("generate-button")[0]

const saveButton = document.getElementById("save")

function polarToCartesian(centerX, centerY, radius, angle) {
    return {
      x: centerX + (radius * Math.cos(angle)),
      y: centerY - (radius * Math.sin(angle))
    };
  }
  
function describeArc(x, y, radius, startAngle, endAngle){
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
  
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
    const d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
  
    return d;       
}

saveButton.addEventListener("click", () => {
    const $svg = document.querySelector("svg");

    const data = new XMLSerializer().serializeToString($svg);
    const blob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});

    const $canvas = document.createElement("canvas");

    const {width, height} = $svg.getBoundingClientRect();

    $canvas.width = width; 
    $canvas.height = height;

    const ctx = $canvas.getContext('2d');

    const img = new Image();

    img.onload = (e) => {
        ctx.drawImage(e.target, 0, 0);

        const $link = document.createElement("a");

        $link.download = "image.png";
        $link.href = $canvas.toDataURL("image/png");

        $link.click();
    };

    img.src = URL.createObjectURL(blob);
})

function makeSVGElement(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
        el.setAttribute(k, attrs[k]);
    }
    return el;
}

function deg2rad(angle) {
    return angle * (Math.PI / 180.0)
}

function rad2deg(angle) {
    return angle * (180.0 / Math.PI)
}

generateButton.addEventListener("click", () => {
    const svg = document.getElementsByTagName('svg')[0]

    svg.replaceChildren()

    const backGround = makeSVGElement('rect', {
        width: 500,
        height: 500,
        fill: 'white',
    })

    svg.appendChild(backGround)

    const axis1 = makeSVGElement('line', { 
        x1: 0,
        y1: 250,
        x2: 500,
        y2: 250,
        stroke: 'black',
    });

    const axis2 = makeSVGElement('line', { 
        x1: 250,
        y1: 0,
        x2: 250,
        y2: 500,
        stroke: 'black',
    });

    svg.appendChild(axis1)
    svg.appendChild(axis2)

    const forces = []
    const angles = []
    const color = ['red', 'green', 'blue', 'purple']
    const inputValues = document.getElementsByClassName("input-value")
    let maxForce = 0
    for (let i = 0; i < inputValues.length; i++) {
        const force = parseFloat(inputValues[i].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value) * G

        if (maxForce < force) {
            maxForce = force
        }
    }

    for (let i = 0; i < inputValues.length; i++) {
        const force = parseFloat(inputValues[i].getElementsByTagName('div')[0].getElementsByTagName('input')[0].value) * G
        const angle = parseFloat(inputValues[i].getElementsByTagName('div')[1].getElementsByTagName('input')[0].value)

        forces.push(force)
        angles.push(angle)

        const pointX = Math.cos(deg2rad(angle)) * (force / maxForce) * SCALE
        const pointY = Math.sin(deg2rad(angle)) * (force / maxForce) * SCALE

        const line = makeSVGElement('line', { 
            x1: BASEX,
            y1: BASEY,
            x2: BASEX + pointX,
            y2: BASEY - pointY,
            stroke: color[i],
            "stroke-width": "2px",
        });
        const arrow = makeSVGElement('polygon', {
            points: `${BASEX + pointX},
            ${BASEY - pointY} 
            ${BASEX + pointX + Math.cos(deg2rad(angle + 180 - arrowAngle)) * arrowLength},
            ${BASEY - pointY - Math.sin(deg2rad(angle + 180 - arrowAngle)) * arrowLength} 
            ${BASEX + pointX + Math.cos(deg2rad(angle + 180 + arrowAngle)) * arrowLength},
            ${BASEY - pointY - Math.sin(deg2rad(angle + 180 + arrowAngle)) * arrowLength}`,
            fill: color[i],
        })

        const textX = pointX / 2
        const textY = pointY / 2

        const text = makeSVGElement('text', {
            x: BASEX + textX + Math.cos(deg2rad(angle - 90)) * textLength,
            y: BASEY - textY - Math.sin(deg2rad(angle - 90)) * textLength,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
        })

        switch (i) {
            case 0: text.textContent = 'A'; break;
            case 1: text.textContent = 'B'; break;
            case 2: text.textContent = 'C'; break;
        }

        svg.appendChild(line);
        svg.appendChild(arrow);
        svg.appendChild(text);
    }

    x1 = Math.cos(deg2rad(angles[0])) * (forces[0] / maxForce) * SCALE
    y1 = Math.sin(deg2rad(angles[0])) * (forces[0] / maxForce) * SCALE
    x2 = Math.cos(deg2rad(angles[1])) * (forces[1] / maxForce) * SCALE
    y2 = Math.sin(deg2rad(angles[1])) * (forces[1] / maxForce) * SCALE
    x3 = x1 + x2
    y3 = y1 + y2

    const xValue = Math.cos(deg2rad(angles[0])) * forces[0] + Math.cos(deg2rad(angles[1])) * forces[1]
    const yValue = Math.sin(deg2rad(angles[0])) * forces[0] + Math.sin(deg2rad(angles[1])) * forces[1]

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
    const arrow = makeSVGElement('polygon', {
        points: `${BASEX + x3},
        ${BASEY - y3} 
        ${BASEX + x3 + Math.cos(Math.atan2(y3, x3) + deg2rad(180 - arrowAngle)) * arrowLength},
        ${BASEY - y3 - Math.sin(Math.atan2(y3, x3) + deg2rad(180 - arrowAngle)) * arrowLength} 
        ${BASEX + x3 + Math.cos(Math.atan2(y3, x3) + deg2rad(180 + arrowAngle)) * arrowLength},
        ${BASEY - y3 - Math.sin(Math.atan2(y3, x3) + deg2rad(180 + arrowAngle)) * arrowLength}`,
        fill: color[3],
    })

    const textX = x3 / 2
    const textY = y3 / 2

    const text = makeSVGElement('text', {
            x: BASEX + textX + Math.cos(Math.atan2(y3, x3) - deg2rad(90)) * textLength,
            y: BASEY - textY - Math.sin(Math.atan2(y3, x3) - deg2rad(90)) * textLength,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
        })
    text.textContent = "R"

    const arc = makeSVGElement('path', {
        d: describeArc(BASEX, BASEY, 20, 0, Math.atan2(y3, x3)),
        stroke: 'black',
        fill: 'none',
        'stroke-width': '2px',
    })

    const arcText = makeSVGElement('text', {
        x: BASEX + Math.cos(Math.atan2(y3, x3) / 2) * (textLength + 20),
        y: BASEY - Math.sin(Math.atan2(y3, x3) / 2) * (textLength + 20),
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
    })

    arcText.textContent = 'φ'

    for (let i = 0; i < 3; i++) {
        const forceText = makeSVGElement('text', {
            x: 10,
            y: 10 + i * 20,
            'text-anchor': 'right',
            'dominant-baseline': 'middle',
        })

        switch (i) {
            case 0: forceText.textContent = 'A: ' + forces[i].toPrecision(3) + ' (N)'; break;
            case 1: forceText.textContent = 'B: ' + forces[i].toPrecision(3) + ' (N)'; break;
            case 2: forceText.textContent = 'C: ' + forces[i].toPrecision(3) + ' (N)'; break;
        }

        svg.appendChild(forceText)
    }

    const forceText = makeSVGElement('text', {
        x: 10,
        y: 70,
        'text-anchor': 'right',
        'dominant-baseline': 'middle',
    })
    forceText.textContent = 'R: ' + Math.sqrt(xValue * xValue + yValue * yValue).toPrecision(3) + ' (N)'
    svg.appendChild(forceText)

    const arcValueText = makeSVGElement('text', {
        x: 10,
        y: 90,
        'text-anchor': 'right',
        'dominant-baseline': 'middle',
    })

    arcValueText.textContent = 'φ: ' + rad2deg(Math.atan2(yValue, xValue)).toPrecision(3) + ' (deg)'
    svg.appendChild(arcValueText)

    svg.appendChild(line1);
    svg.appendChild(line2);
    svg.appendChild(line3);
    svg.appendChild(arrow);
    svg.appendChild(text);
    svg.appendChild(arc);
    svg.appendChild(arcText)
})