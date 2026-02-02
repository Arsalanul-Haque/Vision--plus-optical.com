const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const glasses = new Image();
glasses.src = "frame=3853-removebg-preview.png";

navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{
video.srcObject = stream;
});

const faceMesh = new FaceMesh({
locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
maxNumFaces:1,
refineLandmarks:true,
minDetectionConfidence:0.5,
minTrackingConfidence:0.5
});

faceMesh.onResults(results=>{
canvas.width = video.videoWidth;
canvas.height = video.videoHeight;
ctx.drawImage(video,0,0,canvas.width,canvas.height);

if(results.multiFaceLandmarks.length > 0){
let face = results.multiFaceLandmarks[0];

let leftEye = face[33];
let rightEye = face[263];

let x = leftEye.x * canvas.width;
let y = leftEye.y * canvas.height;
let x2 = rightEye.x * canvas.width;
let y2 = rightEye.y * canvas.height;

let width = x2 - x;
let height = width/3;

ctx.drawImage(glasses, x - 20, y - height/2, width+40, height);
}
});

const camera = new Camera(video,{
onFrame: async()=>{
await faceMesh.send({image:video});
},
width:640,
height:480
});
camera.start();

function download(){
let link=document.createElement("a");
link.download="tryon.png";
link.href=canvas.toDataURL();
link.click();
}
