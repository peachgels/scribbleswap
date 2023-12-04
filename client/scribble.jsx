const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');
import { useState } from "react";


const handleScribble = (e) => {
    e.preventDefault();
    helper.hideError();

    const img = canvas.toDataURL();

    let sendToList = Array.from(document.querySelectorAll('#recipient'));
    for (let i = 0; i < sendToList.length; i++) {
        sendToList[i] = (sendToList[i].textContent.trim() || sendToList[i].innerText.trim())
    }

    helper.sendPost(e.target.action, { img, sendToList });

    return false;
}

const DrawingTools = (props) => {

    return (
        <div>
            <input id="drawButton" type="radio" name="drawing" checked="true" value="draw" onClick={setToDraw}></input>
            <label for="drawButton">Draw</label>
            <input id="eraseButton" type="radio" name="drawing" value="erase" onClick={setToErase}></input>
            <label for="eraseButton">Erase</label>
            <hr></hr>
            <label for="stroke">Pen Color</label>
            <input id="stroke" name='stroke' type="color"></input>
            <label for="lineWidth">Line Width</label>
            <input id="lineWidth" type="range" min="1" max="50" defaultValue="5"></input>
            <hr></hr>
            <div class="row colors">
                <label class="title">Colors</label>
                <ul class="options">
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option" onClick={colorButtonClicked}></li>
                    <li class="option selected" onClick={colorButtonClicked}></li>
                </ul>
            </div>
            <button id="clear">Clear</button><br></br>
            <hr></hr>
            <button id="finished">Finish</button>
        </div>
    );
};


//https://react.dev/learn/updating-arrays-in-state
const RecipientsMenu = (props) => {
    const [list, setList] = useState([]);

    const [value, setValue] = useState("");

    const addToList = () => {

        let tempArr = list;

        tempArr.push(value);

        setList(tempArr);

        setValue("");

    };

    const deleteItem = (index) => {

        let temp = list.filter((item, i) => i !== index);

        setList(temp);

    };

    return (
        <div>
            <label htmlFor="friend">Friend: </label>
            <input id="friendInput" type="text" name="friend" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type a friend's username..." />
            <button type='button' id="addFriend" onClick={addToList}>Add Friend</button>
            <ul id="recipients">
                {list.length > 0 &&
                    list.map((item, i) => <li id="recipient" onClick={() => deleteItem(i)}>{item} </li>)}
            </ul>
            <form id="scribbleSendForm"
                name="scribbleSendForm"
                onSubmit={handleScribble}
                action="/scribble"
                method="POST"
                className="2"
            >
                <input className="2" type="submit" value="Send" />
            </form>
        </div>
    );
};

//frankenstiened these together
//https://codepen.io/javascriptacademy-stash/pen/porpeoJ
//https://www.codingnepalweb.com/build-drawing-app-html-canvas-javascript/

const canvas = document.getElementById('drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

let isPainting = false;
let allowPainting = true;
let lineWidth = 5;
let sendToList = [];

const colorButtonClicked = (e) => {
    document.querySelector(".options .selected").classList.remove("selected");
    e.target.classList.add("selected");
    // passing selected btn background color as selectedColor value
    ctx.strokeStyle = window.getComputedStyle(e.target).getPropertyValue("background-color");
}

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
    if (allowPainting) {
        isPainting = true;
    }
});

canvas.addEventListener('mouseup', e => {
    if (allowPainting) {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    }
});
const setToDraw = () => {
    ctx.globalCompositeOperation = 'source-over';
};

const setToErase = () => {
    ctx.globalCompositeOperation = 'destination-out';
};

canvas.addEventListener('mousemove', draw);

const init = () => {
    ReactDOM.render(<DrawingTools />,
        document.getElementById('toolbar'));
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    document.querySelector("#finished").addEventListener("click", () => {
        allowPainting = false;
        const link = document.createElement("a"); // creating <a> element
        link.download = `${Date.now()}.jpg`; // passing current date as link download value
        link.href = canvas.toDataURL(); // passing canvasData as link href value
        ReactDOM.render(
            <RecipientsMenu sendToList={[]} />,
            document.getElementById('toolbar'));
    });
};
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    init();
});