/* 
    Colors Section - JS functionality for the colors section.
*/

// Global Selections
const colors = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const allSliders = document.querySelectorAll("input[type='range']");
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustBtns = document.querySelectorAll(".adjust");
const lockBtns = document.querySelectorAll(".lock");
const sliderContainers = document.querySelectorAll(".sliders");
const adjustCloseBtns = document.querySelectorAll(".close-adjustment");
const controls = document.querySelectorAll(".controls button");
let initialColors;

// Event Listeners
window.onload = generateRandomColors();

allSliders.forEach((slider) => {
    slider.addEventListener("input", hslControls);
});

colors.forEach((color, index) => {
    color.addEventListener("change", () => {
        updateColorHexOnChange(index);
    });
});

currentHexes.forEach((hex) => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    });
});

popup.addEventListener("transitionend", () => {
    popup.classList.remove("active");
    popup.children[0].classList.remove("active");
});

adjustBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        openAdjustmentPanel(index);
    });
});

adjustCloseBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        closeAdjustmentPanel(index);
    });
});

generateBtn.addEventListener("click", generateRandomColors);

lockBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        lockColor(index);
    });
});

// Functions
function generateHex() {
    return chroma.random();
}

function generateRandomColors() {
    initialColors = [];

    colors.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        if (div.classList.contains("locked")) {
            initialColors.push(hexText.innerText);
            return;
        } else {
            initialColors.push(randomColor.hex());
        }

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
    updateSliders();

    adjustBtns.forEach((btn, index) => {
        checkContrast(initialColors[index], btn);
        checkContrast(initialColors[index], lockBtns[index]);
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

function hslControls(e) {
    const sliderIndex =
        e.target.getAttribute("data-hue") ||
        e.target.getAttribute("data-brightness") ||
        e.target.getAttribute("data-saturation");

    const colorSliders = e.target.parentElement.querySelectorAll(
        "input[type='range']"
    );

    const hue = colorSliders[0],
        brightness = colorSliders[1],
        saturation = colorSliders[2];

    const currentColor = initialColors[sliderIndex];

    let color = chroma(currentColor)
        .set("hsl.h", hue.value)
        .set("hsl.l", brightness.value)
        .set("hsl.s", saturation.value);

    colors[sliderIndex].style.backgroundColor = color;

    colorizeSliders(color, hue, brightness, saturation);
}

function updateColorHexOnChange(index) {
    const colorBeingChanged = colors[index];
    const color = chroma(colorBeingChanged.style.backgroundColor);
    const hexText = colorBeingChanged.querySelector("h2");
    const icons = colorBeingChanged.querySelectorAll(".controls button");

    hexText.innerText = color.hex();

    checkContrast(color, hexText);
    for (icon of icons) checkContrast(color, icon);
}

function updateSliders() {
    allSliders.forEach((slider) => {
        const color = initialColors[slider.getAttribute(`data-${slider.name}`)],
            hueValue = chroma(color).hsl()[0].toFixed(2),
            saturationValue = chroma(color).hsl()[1].toFixed(2),
            brightnessValue = chroma(color).hsl()[2].toFixed(2);

        switch (slider.name) {
            case "hue":
                slider.value = hueValue;
                break;
            case "brightness":
                slider.value = brightnessValue;
                break;
            case "saturation":
                slider.value = saturationValue;
                break;
        }
    });
}

function copyToClipboard(hex) {
    const textAreaHack = document.createElement("textarea");
    textAreaHack.value = hex.innerText;
    document.body.appendChild(textAreaHack);
    textAreaHack.select();
    document.execCommand("copy");
    document.body.removeChild(textAreaHack);

    const popupBox = popup.children[0];

    popup.classList.add("active");
    popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
    sliderContainers[index].classList.toggle("active");
}

function closeAdjustmentPanel(index) {
    sliderContainers[index].classList.remove("active");
}

function lockColor(index) {
    colors[index].classList.toggle("locked");
    lockBtns[index].children[0].classList.toggle("fa-lock-open");
    lockBtns[index].children[0].classList.toggle("fa-lock");
}

/* 
    Panels Section - JS functionality for the panels section.
*/

// Global Selections
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSaveBtn = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveNameInput = document.querySelector(".save-container input");

// Event Listeners
saveBtn.addEventListener("click", openSavePalette);
closeSaveBtn.addEventListener("click", closeSavePalette);

// Functions
function openSavePalette() {
    const popup = saveContainer.children[0];
    saveContainer.classList.add("active");
    popup.classList.add("active");
}

function closeSavePalette() {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
}
