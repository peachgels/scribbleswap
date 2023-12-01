const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// const handleDomo = (e) => {
//     e.preventDefault();
//     helper.hideError();

//     const name = e.target.querySelector('#domoName').value;
//     const age = e.target.querySelector('#domoAge').value;
//     const level = e.target.querySelector('#domoLevel').value;

//     if (!name || !age || !level) {
//         helper.handleError('All fields are required!');
//         return false;
//     }

//     helper.sendPost(e.target.action, {name, age, level}, loadDomosFromServer);

//     return false;
// }

// const DomoForm = (props) => {
//     return(
//         <form id="domoForm"
//             name="domoForm"
//             onSubmit={handleDomo}
//             action="/maker"
//             method="POST"
//             className="domoForm"
//         >
//             <label htmlFor="name">Name: </label>
//             <input id="domoName" type="text" name="name" placeholder="Domo Name" />

//             <label htmlFor="age">Age: </label>
//             <input id="domoAge" type="number" min="0" name="age" />

//             <label htmlFor="level">Level: </label>
//             <input id="domoLevel" type="number" min="0" name="level" />

//             <input className="makeDomoSubmit" type="submit" value="Make Domo" />
//         </form>
//     );
// };

// const  = (props) => {
//     if(props.domos.length === 0){
//         return (
//             <div className="">
//                 <h3 className="emptyDomo">No Domos Yet!</h3>
//             </div>
//         );
//     }

//     const domoNodes = props.domos.map(domo => {
//         return (
//             <div key={domo._id} className="domo">
//                 <img src="/assets/img/domoface.jpeg" alt ="domo face" className="domoFace" />
//                 <h3 className="domoName">Name: {domo.name} </h3>
//                 <h3 className="domoAge">Age: {domo.age} </h3>
//                 <h3 className="domoLevel">Level: {domo.level} </h3>
//             </div>
//         );
//     });

//     return (
//         <div className="domoList">
//             {domoNodes}
//         </div>
//     );
// }

const loadInboxFromServer = async () => {
    const response = await fetch('/getInbox');
    const data = await response.json();
    console.log(data);
    ReactDOM.render(
        <InboxList inbox={data.inbox} />,
        document.getElementById('domos')
    );
}

const InboxList = (props) => {
    if(props.inbox.length === 0){
        return (
            <div className="inboxList">
                <h3 className="emptyDomo">No Scribbles Yet!</h3>
            </div>
        );
    }

    const inboxNodes = props.inbox.map(item => {
        return (
            <div key={item._id} className="sribble">
                <img src={item.img} alt ="domo face" className="domoFace" />
                <h3 className="domoName">From: {item.owner} </h3>
                <h3 className="domoLevel">Date: {item.createdDate} </h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {inboxNodes}
        </div>
    );
}

const init = () => {
    // ReactDOM.render(
    //     <DomoForm />,
    //     document.getElementById('makeDomo')
    // );

    ReactDOM.render(
        <InboxList inbox={[]} />,
        document.getElementById('domos')
    );

    loadInboxFromServer();
}

window.onload = init;