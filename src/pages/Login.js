import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [acNumber, setAcNumber] = useState('');
    const [password, setPassword] = useState('');
    const [disable, setDisable] = useState(false);
    const handleSubmit = (e) => {
        setDisable(true)
        e.preventDefault();
        try {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/login`, { acNumber:acNumber, password:password.trim() }, { headers: { "Content-Type": "application/json" } })
                .then( async res => {
                    // console.log(res);
                    if(res.status === 202){
                    const encNumber = await CryptoJS.AES.encrypt(res.data.acNumber.toString(),"1235").toString();
                    window.localStorage.setItem('accountToken',encNumber);
                    navigate(`./`)
                    }else{
                        setDisable(false)
                        alert("Something went wrong")
                    }
                })
                .catch(err => {
                    setDisable(false)
                    console.log(err)
                    if(err.status === 404){
                        alert("Invalid Credentials")
                    }else{
                        alert("Something went wrong")
                    }
                })
        } catch (error) {
            setDisable(false)
            console.log("Post Error: ", error);
        }
    }
    return (
        <div className='container display-flex'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className='form-container'>
                <label htmlFor="ac-number">Account Number</label>
                <input type="text" id='ac-number' value={acNumber} onChange={(e) => setAcNumber(e.target.value)} placeholder='Account number' autoComplete='off' required/>
                <label htmlFor="ac-holder-name">Account holder name</label>
                <input type="password" id='ac-holder-name' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' autoComplete='off' required/>
                <input type="submit" value="Submit" disabled = {disable} />
            </form>
            <button onClick={()=>navigate('/register')} className="btn">Register</button>
        </div>
    )
}

export default Login
