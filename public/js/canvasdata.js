//  ####  Failed Code for this Project 

// const canvas = document.getElementById('myCanvas');
// const ctx = canvas.getContext('2d');
// const colorPicker = document.getElementById('colorPicker');
// const penWidth = document.getElementById('penWidth');
// const clearCanvas = document.getElementById('clearCanvas');
// const eraserToggle = document.getElementById('eraserToggle');
// const viewbox = document.getElementById("viewbox")

// ctx.fillStyle = '#ffffff';
// ctx.fillRect(0, 0, canvas.width, canvas.height);


// // Initialize drawing state
// let drawing = false;
// let lastX = 0;
// let lastY = 0;
// let usingEraser = false;
// ctx.lineJoin = 'round';
// ctx.lineCap = 'round';


// async function uploadCanvasHandler() {
//     const dataURL = canvas.toDataURL('image/png');
//     try {
//         const response = await fetch('/upload', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ image: dataURL }),
//         });
//         if (response.ok) {
//             //alert('Canvas image uploaded successfully!');
//             response.text().then(text=>{
//                 console.log(text)
//                 viewbox.innerText = text;
//                 sendedAlready=false;
//             })

//         } else {
//             //alert('Failed to upload image.');
//         }
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         alert('Error uploading image.');
//     }
// }

// let sendedAlready = false;
//   // Function to start drawing

// // function startDrawing(e) {
    
// //     drawing = true;
// //     [lastX, lastY] = [e.offsetX, e.offsetY];
// // }

// // // Function to draw on canvas
// // function draw(e) {
// //     if (!drawing) return;
// //     ctx.strokeStyle = usingEraser ? '#fff' : colorPicker.value;
// //     ctx.lineWidth = penWidth.value;
// //     ctx.beginPath();
// //     ctx.moveTo(lastX, lastY);
// //     ctx.lineTo(e.offsetX, e.offsetY);
// //     ctx.stroke();
// //     [lastX, lastY] = [e.offsetX, e.offsetY];
// // }
// // // Function to stop drawing
// // function stopDrawing() {
// //     drawing = false;

// //     //sending part to ther server
// //     if(!sendedAlready){
// //         sendedAlready =true
// //         viewbox.innerHTML = "<h1 class ='text-danger'>Analysing...</h1>"
// //         setTimeout(function(){
// //             uploadCanvasHandler()
// //         },1000)
// //     }

// // }




// // new Functions



// // Function to start drawing
// function startDrawing(e) {
//     e.preventDefault(); // Prevent default behavior
//     drawing = true;
//     // Use touch coordinates
//     const touch = e.touches[0];
//     [lastX, lastY] = [touch.clientX - canvas.getBoundingClientRect().left, touch.clientY - canvas.getBoundingClientRect().top];
// }

// // Function to draw on canvas
// function draw(e) {
//     e.preventDefault(); // Prevent default behavior
//     if (!drawing) return;

//     const touch = e.touches[0];
//     const x = touch.clientX - canvas.getBoundingClientRect().left;
//     const y = touch.clientY - canvas.getBoundingClientRect().top;

//     ctx.strokeStyle = usingEraser ? '#fff' : colorPicker.value;
//     ctx.lineWidth = penWidth.value;
//     ctx.beginPath();
//     ctx.moveTo(lastX, lastY);
//     ctx.lineTo(x, y);
//     ctx.stroke();
//     [lastX, lastY] = [x, y];
// }

// // Function to stop drawing
// function stopDrawing() {
//     drawing = false;

//     // Sending part to the server
//     if (!sendedAlready) {
//         sendedAlready = true;
//         viewbox.innerHTML = "<h1 class ='text-danger'>Analysing...</h1>";
//         setTimeout(function() {
//             uploadCanvasHandler();
//         }, 1000);
//     }
// }










// // Function to clear the canvas
// function clearCanvasHandler() {
//    // ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = '#ffffff';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
// }

// // Function to toggle eraser mode
// function toggleEraser() {
//     usingEraser = !usingEraser;
//     eraserToggle.textContent = usingEraser ? 'Use Pen' : 'Use Eraser';
// }

// // Event listeners for canvas drawing
// canvas.addEventListener('mousedown', startDrawing);
// canvas.addEventListener('mousemove', draw);
// canvas.addEventListener('mouseup', stopDrawing);
// canvas.addEventListener('mouseout', stopDrawing);

// canvas.addEventListener('touchstart',function(e){
//     e.preventDefault();
//     startDrawing();
// } );
// canvas.addEventListener('touchmove', function(e){
//     e.preventDefault();
//     draw();
// } );
// canvas.addEventListener('touchend',function(e){
//     e.preventDefault();
//     stopDrawing();
// } );
// canvas.addEventListener('touchcancel',function(e){
//     e.preventDefault();
//     stopDrawing();
// } );


// // Event listener for clear canvas button
// clearCanvas.addEventListener('click', clearCanvasHandler);

// // Event listener for eraser toggle button
// eraserToggle.addEventListener('click', toggleEraser);