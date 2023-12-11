const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

let pinned = [];

// const handlePin = (e) => {

//     const scribID = (e.target.name);
//     e.preventDefault();
//     helper.hideError();

//     helper.sendPost(e.target.action, { scribID }, loadScrapbookFromServer);

//     return false;
// }


//get the inbox data from the server
const loadInboxFromServer = async () => {
    const response = await fetch('/getInbox');
    const data = await response.json();
    //render out the DOM element based on the response
    ReactDOM.render(
        //feed the retrieved list into the react component's props
        <InboxList inbox={data.inbox} />,
        //put it in the scrib container
        document.getElementById('scribContainer')
    );
}

const loadScrapbookFromServer = async () => {
    const response = await fetch('/getScrapbook');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.scrapbook} />,
        document.getElementById('domos')
    );
}
const sendToScrapbook = () => {

}

const InboxList = (props) => {
    if (props.inbox.length === 0) {
        return (
            <div className="inboxList">
                <h3 className="emptyDomo">No Scribbles Yet!</h3>
            </div>
        );
    }

    const inboxNodes = props.inbox.map(item => {
        date = new Date(item.createdDate)
        date = date.toDateString();
        return (
            <div key={item._id} className="scribble">
                {/* <form id="pinForm"
                    name={item._id}
                    onSubmit={handlePin}
                    method="POST"
                >
                    <input type="submit" class="pin"></input>
                </form> */}
                <img src={item.img} />
                <div class="scribInfo">
                    <h3>From: {item.ownerUser} </h3>
                    <h3>Date: {date}</h3>
                </div>
            </div>
        );
    });

    return (
        <div className="scribCenter">
            <div className="scribbleGrid">
                {inboxNodes}
            </div>
        </div>
    );
}
const loadPFP = async () => {
    const response = await fetch('/getPFP');
    const data = await response.json();
    ReactDOM.render(
        <PFP image={data.profilePic} />,
        document.getElementById('pfpSpot')
    );
}
const loadUserData = async () => {
    const response = await fetch('/getUserData');
    const data = await response.json();
    ReactDOM.render(
        <Username name={data.stuff[0].username} />,
        document.getElementById('username'),
    )
}
const PFP = (props) => {
    if (props.image[0]) {
        return (
            <a href="/login"><img src={props.image[0].img} id="userPFP" alt="user's profile picture" /></a>
        )
    }
}
const Username = (props) => {
    if (props.name) {
        return (
            <h2>{props.name}</h2>
        )
    }
}
const init = () => {

    ReactDOM.render(
        <PFP image='' />,
        document.getElementById('pfpSpot')
    )
    ReactDOM.render(
        <Username stuff='' />,
        document.getElementById('username')
    )
    ReactDOM.render(
        <InboxList inbox={[]} />,
        document.getElementById('scribContainer')
    );


    loadInboxFromServer();
    loadUserData();
    loadPFP();
}

window.onload = init;