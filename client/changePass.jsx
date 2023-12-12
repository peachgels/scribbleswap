const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handlePass = (e) => {
    e.preventDefault();
    helper.hideError();

    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;

    if(!newPass || !newPass2){
        helper.handleError('All fields are required!')
        return false;
    }

    if(newPass !== newPass2){
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {newPass, newPass2});

    return false;
};

const PasswordWindow = (props) => {
    return(
        <form id="passwordForm"
            name="passwordForm"
            onSubmit={handlePass}
            action="/changePassword"
            method="POST"
            className="mainForm"
        >
            <input id="newPass" type="password" name="newPass" placeholder="password" />
            <input id="newPass2" type="password" name="newPass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Update" />
        </form>
    );
};

const init = () => {
    ReactDOM.render(<PasswordWindow />,
        document.getElementById('content'));
};

window.onload = init;