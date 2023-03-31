class ColorPicker {
    constructor(root) {
        this.root = root;
        this.colorjoe = colorjoe.rgb(this.root.querySelector(".colorjoe"));
        this.selectedColor = null;

        this.colorjoe.show();
        this.setSelectedColor("#009578");

        this.colorjoe.on("change", color => {
            this.setSelectedColor(color.hex(), true);

        });

        this.root.querySelectorAll(".selected-color").forEach((el, i) => {
            el.addEventListener("mouseup", e => {
                this.setSelectedColor(el.dataset.color);
                });
            });
        }

    setSelectedColor(color, skipCjUpdate = false) {
        this.selectedColor = color;
        this.root.querySelector(".selected-color-text").textContent = color;
        this.root.querySelector(".selected-color").style.background = color;

        if (!skipCjUpdate) {
            this.colorjoe.set(color);
        }
    }
}

if (location.protocol != "https:") {
  location.href =
    "https:" +
    window.location.href.substring(window.location.protocol.length);
}

var modelViewerParameters = document.querySelector("model-viewer#model");

const cp = new ColorPicker(document.querySelector(".container"));
cp.colorjoe.on("change", color => {
  let [materialCol] = modelViewerParameters.model.materials;
  materialCol.pbrMetallicRoughness.setBaseColorFactor(color.hex());
});

document.querySelector('#metalness-range').addEventListener('input', (event) => {
  var material = modelViewerParameters.model.materials[0];
  material.pbrMetallicRoughness.setMetallicFactor(event.target.value);
});

document.querySelector('#roughness-range').addEventListener('input', (event) => {
  var material = modelViewerParameters.model.materials[0];
  material.pbrMetallicRoughness.setRoughnessFactor(event.target.value);
});

var buttonOn = false

let roundButton = document.querySelector("#roundButton");
roundButton.addEventListener("click", showMenu, true);

let colorPalette = document.querySelector(".container");

function showMenu(e) {
    if (buttonOn == true) {
      hideMenu(e)
      buttonOn = false;
      return
    }
    colorPalette.classList.add("show");
    document.body.style.overflow = "hidden";
    buttonOn = true
}

function hideMenu(e) {
    colorPalette.classList.remove("show");
	  e.stopPropagation();
    document.body.style.overflow = "auto";
}		