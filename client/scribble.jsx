const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');


// export default function App() {
//     React.useEffect(() => {
//         var c = document.getElementById("myCanvas");
//         var ctx = c.getContext("2d");
//         ctx.moveTo(0, 0);
//         ctx.lineTo(200, 100);
//         ctx.stroke();
//     }, []);
// }

// const CanvasWindow = (props) => {
//     return (
//         <div>
//             <h1>HTML5 Canvas + React.js</h1>
//             <canvas
//                 id="myCanvas"
//                 width="200"
//                 height="100"
//                 style={{ border: "1px solid #d3d3d3" }}
//             >
//                 Your browser does not support the HTML canvas tag.
//             </canvas>
//         </div>
//     );
// };

//https://codepen.io/javascriptacademy-stash/pen/porpeoJ

const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

// canvas.width = window.innerWidth - canvasOffsetX;
// canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});


toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', e => {
    if (e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if (e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }

});

const draw = (e) => {
    if (!isPainting) {
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);
    ctx.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
    console.log(canvasOffsetX);
    console.log(canvasOffsetY);
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);


// const init = () => {
//     ReactDOM.render(<CanvasWindow />,
//         document.getElementById('content'));
//     // App();
// };

// window.onload = init;