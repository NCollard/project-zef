const inputs = document.querySelectorAll('.option');
const effectsInputs = document.querySelectorAll('.option[name="options-effect"]');
const boxInputs = document.querySelectorAll('.option[name="options-box"]');
const colorInput = document.querySelector('.option[name="options-color"]');
const boxText = document.querySelector('#options-box>.options-text');

const effects = {
    distortion: {
        "name": "Distortion +",
        "knobs": 2,
        get minBody() {
            return this.knobs <= 2 ? 1 : this.knobs == 3 ? 2 : this.knobs >= 4 ? 3 : 3;
        }
    },

    squeezer: {
        "name": "Orange Squeezer",
        "knobs": 2,
        get minBody() {
            return this.knobs <= 2 ? 1 : this.knobs == 3 ? 2 : this.knobs >= 4 ? 3 : 3;
        }
    },

    tremolo: {
        "name": "Smooth Tremolo",
        "knobs": 2,
        get minBody() {
            return this.knobs <= 2 ? 1 : this.knobs == 3 ? 2 : this.knobs >= 4 ? 3 : 3;
        }
    },

    fuzz: {
        "name": "8-Bit Fuzz",
        "knobs": 1,
        get minBody() {
            return this.knobs <= 2 ? 1 : this.knobs == 3 ? 2 : this.knobs >= 4 ? 3 : 3;
        }
    },

    shocktave: {
        "name": "Shocktave",
        "knobs": 3,
        get minBody() {
            return this.knobs <= 2 ? 1 : this.knobs == 3 ? 2 : this.knobs >= 4 ? 3 : 3;
        }
    }
};

let values = {
    box: 2,
    knobs: 1,
    knobtype: 1,
    color: colorInput.value,
    design: 1
};

function firstEffect() {
    inputs.forEach(input => {
        input.removeAttribute("disabled");
    });

    document.querySelector('.option[name="options-knobtype"]').checked = true;
    document.querySelector('.option[name="options-design"]').checked = true;

    updateBoxText();

    effectsInputs.forEach(effect => {
        effect.removeEventListener("input", firstEffect);
    });
};

function updateEffect() {
    boxInputs.forEach(input => {
        input.removeAttribute("disabled");
    });

    const effect = this.value;
    const minBody = effects[effect].minBody;
    const knobs = effects[effect].knobs;

    for (let i = 1; i < minBody; i++) {
        document.querySelector(`.option[id="box-${i}"]`).setAttribute("disabled", "");
        document.querySelector(`.option[id="box-${i}"]`).checked = false;
    }

    values.box = minBody == 1 || minBody == 2 ? 2 : 3;
    values.knobs = knobs;

    updateBoxText();

    minBody == 1 || minBody == 2 ? document.querySelector('.option[id="box-2"]').checked = true : document.querySelector('.option[name="options-box"]:enabled').checked = true;
}

function updateValues() {
    const option = this.name.slice(8);

    testOption:
    if (option == "effect") {
        break testOption;
    }
    else if (option == "color") {
        values[option] = this.value;
    }
    else if (option == "box") {
        values[option] = parseInt(this.value);
        updateBoxText();
    } else {
        values[option] = parseInt(this.value);
    }
}

function updateBoxText() {
    const boxType = values.box;

    switch (boxType) {
        case 1: boxText.innerText = "Dimensions: 3.622 Length x 1.496 Width x 1.220 Height (inches)";
            break;
        case 2: boxText.innerText = "Dimensions: 4.409 Length x 2.402 Width x 1.260 Height (inches)";
            break;
        case 3: boxText.innerText = "Dimensions: 4.724 Length x 3.720 Width x 1.339 Height (inches)";
            break;
    }
}

//Update values for each set of radio buttons

effectsInputs.forEach(effect => {
    effect.addEventListener("input", firstEffect);
    effect.addEventListener("input", updateEffect);
})

inputs.forEach(input => {
    input.addEventListener("input", updateValues);
});

export { values };