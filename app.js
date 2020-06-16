// Global Selections
const colors = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");

let initialColors;

// Functions
function generateHex() {
    return chroma.random();
}

function generateRandomColors() {
    colors.forEach((div, index) => {
        const hexText = div.children[0];
        const randomHex = generateHex();

        div.style.backgroundColor = randomHex;
        hexText.innerText = randomHex;

        checkContrast(randomHex, hexText);
    });
}

function checkContrast(color, text) {
    const lume = chroma(color).luminance();
    lume > 0.5 ? (text.style.color = "black") : (text.style.color = "white");
}

generateRandomColors();

// Event Listeners
