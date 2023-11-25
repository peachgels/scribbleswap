const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handlePass = (e) => {
    e.preventDefault();
    helper.hideError();

    const newPass = e.target.querySelector('#newPass').value;
    const newPass2 = e.target.querySelector('#newPass2').value;
    console.log(newPass);
    console.log(newPass2);

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
            <label htmlFor="newPass">New Password: </label>
            <input id="newPass" type="password" name="newPass" placeholder="password" />
            <label htmlFor="newPass2">New Password: </label>
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