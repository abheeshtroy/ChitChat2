import React, { useState } from "react";
import axios from 'axios'
import PropTypes from 'prop-types'

//create css for login

function LogReg({ setLoggedIn }) {
    const [utext, setUText] = useState('');
    const [ptext, setPText] = useState('');
    let data;

    const Register = () => {
        if (utext === "" || ptext === "") {
            alert('Fill All Fields')
            return;
        }

        data = { username: utext, password: ptext }

        axios.post("http://localhost:4923/register", data)
            .then(async res => {
                alert(res.data.message)
            })
    }
    const Login = () => {
        if (utext === "" || ptext === "") {
            alert('Fill All Fields')
            return;
        }

        data = { username: utext, password: ptext }

        axios.post("http://localhost:4923/login", data)
            .then(async res => {
                alert(res.data.message)
                setLoggedIn(res.data.status)
                // return;
            })
    }

    return (
        <div id='Authen' className="register-form-container">
            <div className="boxes">
                <h1 className="form-title">Enter Chat</h1>
                <div className="form-field">
                    <input type="username" placeholder="Username" onChange={(event) => { setUText(event.target.value) }} required />
                </div>
                <div className="form-field">
                    <input type="password" placeholder="Password" onChange={(event) => { setPText(event.target.value) }} required />
                </div>

                <div className="form-buttons">
                    <button className="button" type="submit" id="submitlog" onClick={Login}>Login</button>
                    <button className="button" type="submit" id="submitreg" onClick={Register}>Register</button>
                </div>
            </div>
        </div>
    )
}

export default LogReg;

LogReg.propTypes = {
    setLoggedIn: PropTypes.func.isRequired
}