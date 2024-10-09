import axios from 'axios';
import CryptoJS from 'crypto-js'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


function CreateAccount() {
    const navigate = useNavigate();
    const [acHolderName, setUsername] = useState('');
    const [balance, setBalance] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disable, setDisable] = useState(false);

    const handleSubmit = (e) => {
        setDisable(true);
        e.preventDefault();
        try {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/create`, { acHolderName: acHolderName.trim(), balance: balance, email: email.trim(), password: password.trim() }, { headers: { "Content-Type": "application/json" } })
                .then(res => {
                    // console.log(res);
                    if (res.status === 201 || res.status === 202 || res.status === 203) {
                        const accNumber = res.data.acNumber;
                        const encNumber = CryptoJS.AES.encrypt(accNumber.toString(), "1235").toString();
                        window.localStorage.setItem('accountToken', encNumber);
                        navigate(`/banking-frontend/`)
                    } 
                    else {
                        setDisable(false)
                        alert("Something went wrong");
                    }
                })
                .catch(err => {
                    setDisable(false)
                    console.log(err)
                    if (err.status === 404) {
                        alert("Invalid Credentials inner catch")
                    } else if(err.status === 429) {
                        alert("Email Already exists")
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
            <h2>Create new Account</h2>
            <form onSubmit={handleSubmit} className='form-container'>
                <label htmlFor="ac-holder-name">Account holder name</label>
                <input type="text" id='ac-holder-name' value={acHolderName} onChange={(e) => setUsername(e.target.value)} autoComplete='off' required />
                <label htmlFor="ac-balance">Opening Balance</label>
                <input type="text" id='ac-balance' value={balance} onChange={(e) => setBalance(e.target.value)} autoComplete='off' required />
                <label htmlFor="ac-email">Email</label>
                <input type="email" id='ac-email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='off' required />
                <label htmlFor="ac-password">Password</label>
                <input type="text" id='ac-password' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete='off' required />
                <input type="submit" id='submit' value="Submit" disabled = {disable} />
            </form>
            <button className='btn' onClick={() => navigate('/login')}>Log In</button>
        </div>
    )
}

export default CreateAccount
