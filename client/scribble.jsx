const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleScribble = (e) => {
    e.preventDefault();
    helper.hideError();

    const img = canvas.toDataURL();

    helper.sendPost(e.target.action, {img, sendToList});

    return false;
}

const DrawingTools = (props) => {
    return (
        <div>
            <label for="stroke">Pen Color</label>
            <input id="stroke" name='stroke' type="color"></input>
            <label for="lineWidth">Line Width</label>
            <input id="lineWidth" name='lineWidth' type="number" value="5"></input>
            <button id="clear">Clear</button>
            <button id="finished">Finish</button>
        </div>
    );
};

const RecipientsMenu = (props) => {
    // const friends = props.sendToList;
    // const friendNodes = friends.map(friend => {
    //     return (
    //         <ol>
    //             <li key={friend}>{friend}</li>
    //         </ol>
    //     );
    // });

    return (
        <div>
            <label htmlFor="friend">Friend: </label>
            <input id="friendInput" type="text" name="friend" placeholder="Type a friend's username..." />
            <button type='button' id="addFriend" onClick={addFriendsToList}>Add Friend</button>
            <ol>
                {/* {friendNodes} */}
            </ol>
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
let startX;
let startY;
let sendToList = [];

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
        startX = e.clientX;
        startY = e.clientY;
    }
});

canvas.addEventListener('mouseup', e => {
    if (allowPainting) {
        isPainting = false;
        ctx.stroke();
        ctx.beginPath();
    }
});

canvas.addEventListener('mousemove', draw);

const addFriendsToList = () => {
    let currentFriend = document.querySelector('#friendInput').value;
    sendToList.push(currentFriend);
    document.querySelector('#friendInput').value = '';
}

const init = () => {
    ReactDOM.render(<DrawingTools />,
        document.getElementById('toolbar'));
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    let saveImg = document.querySelector("#finished")
    saveImg.addEventListener("click", () => {
        allowPainting = false;
        const link = document.createElement("a"); // creating <a> element
        link.download = `${Date.now()}.jpg`; // passing current date as link download value
        link.href = canvas.toDataURL(); // passing canvasData as link href value
        //link.click(); // clicking link to download image
        ReactDOM.render(
        <RecipientsMenu sendToList={[]}/>,
            document.getElementById('toolbar'));
    });
};
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    init();
});