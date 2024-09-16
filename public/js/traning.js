const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const penWidth = document.getElementById('penWidth');
const clearCanvas = document.getElementById('clearCanvas');
const eraserToggle = document.getElementById('eraserToggle');
const viewbox = document.getElementById("viewbox");
const undoButton = document.getElementById('undoButton'); 
const micbtn = document.getElementById('micbtn'); // Add an undo button element
// Add an undo button element

ctx.fillStyle = '#ffffff';
// ctx.fillRect(0, 0, canvas.width, canvas.height);

// Initialize drawing state
let drawing = false;
let lastX = 0;
let lastY = 0;
let usingEraser = false;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// Stack to keep track of canvas states for undo functionality
const undoStack = [];
const MAX_UNDO_HISTORY = 10; // Limit the number of undo steps

// Function to save the current canvas state
function saveState() {
    if (undoStack.length >= MAX_UNDO_HISTORY) {
        undoStack.shift(); // Remove the oldest state if the stack is full
    }
    undoStack.push(canvas.toDataURL());
}

// Function to undo the last action
function undo() {
    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = previousState;
    }
}

// Function to start drawing
function startDrawing(e) {
    e.preventDefault();
    drawing = true;
    saveState(); // Save the current state before starting a new drawing
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    [lastX, lastY] = [x, y];
}

// Function to draw on canvas
function draw(e) {
    e.preventDefault();
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (usingEraser) {
        ctx.strokeStyle = '#ffffff';
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.strokeStyle = colorPicker.value;
        ctx.globalCompositeOperation = 'source-over';
    }

    ctx.lineWidth = penWidth.value;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
}




// Function to draw on canvas
function drawTouches(e) {
    e.preventDefault();
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.changedTouches[0].clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.changedTouches[0].clientY - rect.top) * (canvas.height / rect.height);

    if (usingEraser) {
        ctx.strokeStyle = '#ffffff';
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.strokeStyle = colorPicker.value;
        ctx.globalCompositeOperation = 'source-over';
    }

    ctx.lineWidth = penWidth.value;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
}



// Function to stop drawing
function stopDrawing() {
    drawing = false;
    if (!sendedAlready) {
        sendedAlready = true;
        viewbox.innerHTML = "<h1 class ='text-danger'>Analysing...</h1>";
        setTimeout(() => uploadCanvasHandler(), 1000);
    }
}

// Function to clear the canvas
function clearCanvasHandler() {
    saveState(); // Save the current state before clearing
    ctx.fillStyle = '#ffffff';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to toggle eraser mode
function toggleEraser() {
    usingEraser = !usingEraser;
    eraserToggle.textContent = usingEraser ? 'Use Pen' : 'Use Eraser';
}

// Event listeners for canvas drawing (mouse)
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
// canvas.addEventListener('mouseout', stopDrawing);

// Event listeners for canvas drawing (touch)
canvas.addEventListener('touchstart', (e) => startDrawing(e));
canvas.addEventListener('touchmove', (e) =>{
    console.log("Touching Screen")
    console.log(e.changedTouches[0].clientX)

    drawTouches(e)
} );
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Event listener for clear canvas button
clearCanvas.addEventListener('click', clearCanvasHandler);

// Event listener for eraser toggle button
eraserToggle.addEventListener('click', toggleEraser);

// Event listener for undo button
undoButton.addEventListener('click', undo);

// Flag to track if the canvas has been sent to the server
let sendedAlready = false;



// mic option button
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;  // This allows you to see partial text while speaking.
    recognition.continuous = true;  // Keep listening until explicitly stopped.

recognition.onerror = function(event) {
    viewbox.textContent = 'Error occurred in recognition: ' + event.error;
};

recognition.onresult = function(event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }
    viewbox.innerHTML = transcript;
    console.log(transcript)
    micbtn.classList.remove("bg-danger")
};
micbtn.addEventListener("click",function(){
    if(micbtn.classList.contains("bg-danger")){
        recognition.stop();
        micbtn.classList.remove("bg-danger")
    }
    else{
        recognition.start()
        micbtn.classList.add("bg-danger")
    }
    console.log("Mic Mode")
})




// Function to handle canvas upload
async function uploadCanvasHandler() {
    const dataURL = canvas.toDataURL('image/png');
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: dataURL }),
        });
        if (response.ok) {
            const text = await response.text();
            console.log(text);
            viewbox.innerText = text;
            sendedAlready = false;
        } else {
            console.error('Failed to upload image.');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image.');
    }
}
