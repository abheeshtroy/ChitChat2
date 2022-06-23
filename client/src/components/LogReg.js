import React,{useState} from "react";
import axios from 'axios'
import PropTypes from 'prop-types'
import "./LogReg.css"

//create css for login

function LogReg({setLoggedIn}){
    const [utext , setUText] = useState('');
    const [ptext , setPText] = useState('');
    let data;

    const Register = () =>{
        if (utext === "" || ptext === "") {
            alert('Fill All Fields')
            return;
        }

        data = {username: utext , password: ptext}

        axios.post("http://localhost:4923/register", data)
            .then(async res=>{
                alert(res.data.message)
          })
    }
    const Login = () =>{
        if (utext === "" || ptext === "") {
            alert('Fill All Fields')
            return;
        }

        data = {username: utext , password: ptext}
                    
        axios.post("http://localhost:4923/login", data)
            .then(async res=>{
                alert(res.data.message)
                setLoggedIn(res.data.status)
                // return;
            })
    }

    return(
        <div id='Authen'>
                <h1>Enter your info boi</h1>
                <label>Username:</label>
                <input type="username" placeholder="Username" onChange={(event)=>{setUText(event.target.value)}} required/>
                <label>Password:</label>
                <input type="password" placeholder="Password" onChange={(event)=>{setPText(event.target.value)}} required/>
                
                <button type="submit" id="submitlog" onClick={Login}>Login</button>
                <button type="submit" id="submitreg" onClick={Register}>Register</button>
      </div>
    )
}

export default LogReg;

LogReg.propTypes = {
    setLoggedIn: PropTypes.func.isRequired
}