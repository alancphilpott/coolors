// Global Selections
const colors = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const allSliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");

let initialColors;

// Functions
function generateHex() {
    return chroma.random();
}

function generateRandomColors() {
    colors.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        // Style Palette
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;

        // Adjust Text Color
        checkContrast(randomColor, hexText);

        // Initialise Sliders
        const colorSliders = div.querySelectorAll(".sliders input");
        const hue = colorSliders[0],
            brightness = colorSliders[1],
            saturation = colorSliders[2];

        colorizeSliders(randomColor, hue, brightness, saturation);
    });
}

function checkContrast(color, text) {
    const lume = chroma(color).luminance();
    lume > 0.5 ? (text.style.color = "black") : (text.style.color = "white");
}

function colorizeSliders(color, hue, brightness, saturation) {
    // Scale Brightness
    const midBrightness = color.set("hsl.l", 0.5),
        scaleBrightness = chroma.scale(["black", midBrightness, "white"]);

    // Scale Saturation
    const minSat = color.set("hsl.s", 0),
        maxSat = color.set("hsl.s", 1),
        scaleSat = chroma.scale([minSat, color, maxSat]);

    hue.style.backgroundImage = `linear-gradient(to right, rgb(255, 0, 0), rgb(255,255 ,0),rgb(0, 255, 0),rgb(0, 255, 255),rgb(0,0,255),rgb(255,0,255),rgb(255,0,0))`;
    // prettier-ignore
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0)}, ${scaleBrightness(0.5)}, ${scaleBrightness(1)})`;
    // prettier-ignore
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
}

generateRandomColors();

// Event Listeners
