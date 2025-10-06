const canvas = document.getElementById("canvas");
const colorChart = document.getElementById("color-chart");
const colors = ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
                "#FFFF00", "#00FFFF", "#FF00FF", "#C0C0C0", "#505050",
                "#FFA500", "#8000FF", "#FF69B4", "#8B4513", "#87CEEB",
                "#32CD32"
                ];
const eraser = document.getElementById("eraser");
const bomb = document.getElementById("bomb");
const clear = document.getElementById("clear");
const downloadImage = document.getElementById("download-image");

let selectedColor = null;
let colorMode = "normal";
let isMouseDown = false;

const GRID = 16;

for (let i = 0; i < GRID * GRID; i++) {
    const cell = document.createElement("div");
    cell.dataset.idx = i;
    canvas.appendChild(cell);

    cell.addEventListener("mouseover", () => {
        if (isMouseDown) {
            const idx = Number(cell.dataset.idx);
            const { row, column } = idxToRowColumn(idx);
            const paintColor = (selectedColor === "eraser") ? "" : selectedColor;
    
            if (colorMode === "bomb") {
                for (let distanceRow = -2; distanceRow <= 2; distanceRow++) {
                    for (let distanceColumn = -2; distanceColumn <= 2; distanceColumn++) {
                        if (Math.abs(distanceRow) + Math.abs(distanceColumn) <= 2) {
                            paintAt(row + distanceRow, column + distanceColumn, paintColor);
                        }
                    }
                }
            } else {
                paintAt(row, column, paintColor);
            }
        }
    });

    cell.addEventListener("click", () => {
        const idx = Number(cell.dataset.idx);
        const { row, column } = idxToRowColumn(idx);
        const paintColor = (selectedColor === "eraser") ? "" : selectedColor;

        if (colorMode === "bomb") {
            for (let distanceRow = -2; distanceRow <= 2; distanceRow++) {
                for (let distanceColumn = -2; distanceColumn <= 2; distanceColumn++) {
                    if (Math.abs(distanceRow) + Math.abs(distanceColumn) <= 2) {
                        paintAt(row + distanceRow, column + distanceColumn, paintColor);
                    }
                }
            }
        } else {
            paintAt(row, column, paintColor);
        }
    });
}

const cells = canvas.querySelectorAll("div");

function idxToRowColumn(idx) {
    return { row: Math.floor(idx / GRID), column: idx % GRID };
}

function rowColumnToIdx(row, column) {
    return row * GRID + column;
}

function paintAt(row, column, color) {
    if (row < 0 || column < 0 || row >= GRID || column >= GRID) return;

    const idx = rowColumnToIdx(row, column);
    cells[idx].style.backgroundColor = color;
}

for (let i = 0; i < colors.length; i++) {
    const color = document.createElement("button");
    colorChart.appendChild(color);
    color.style.backgroundColor = colors[i];

    color.addEventListener("click", () => {
        selectedColor = colors[i];
        console.log("Color seleccionado:", selectedColor);
    });
}

canvas.addEventListener("mousedown", () => {
    isMouseDown = true;
});

canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
});

canvas.addEventListener("mouseleave", () => {
    isMouseDown = false;
});

eraser.addEventListener("click", () => {
    selectedColor = "eraser";
});

bomb.addEventListener("click", () => {
    if (colorMode === "normal") {
        colorMode = "bomb";
        bomb.style.backgroundColor = "#3fe02aff";
        bomb.style.color = "black";
    } else {
        colorMode = "normal";
        bomb.style.backgroundColor = "";
        bomb.style.color = "white";
    }
});

clear.addEventListener("click", () => {
    for (let cell of cells) {
        cell.style.backgroundColor = "";
    }
});

downloadImage.addEventListener("click", () => {
    const size = GRID;
    const cellSize = 1;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext("2d");

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const idx = rowColumnToIdx(row, col);
            const color = cells[idx].style.backgroundColor || "rgb(245, 245, 245)";
            ctx.fillStyle = color;
            ctx.fillRect(col, row, cellSize, cellSize);
        }
    }

    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
});