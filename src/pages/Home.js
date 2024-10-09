import axios from 'axios';
import CryptoJS from 'crypto-js'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();
  const [response, setResponse] = useState([]);
  const [secondAcNumber, setSecondAcNumber] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [disable, setDisable] = useState(false)


  useEffect(() => {
    if (window.localStorage.getItem('accountToken')) {
      let acNumber = window.localStorage.getItem('accountToken')
      const bytes = CryptoJS.AES.decrypt(acNumber, "1235")
      const AcNO = bytes.toString(CryptoJS.enc.Utf8)
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/${AcNO}`)
        .then(res => {
          setTimeout(() => {
            setResponse(res.data)
          }, 2100);
          // setResponse(res.data)
        })
    } else {
      window.location.pathname = "/login"
    }
  }, [])

  const handleTransfer = (e) => {
    setDisable(true)
    e.preventDefault();
    setSecondAcNumber('');
    setPassword('')
    setAmount('')
    try {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/transfer`, { loginDto: { acNumber: response.acNumber, password: password.trim() }, acNumber: secondAcNumber, amount: amount }, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          setDisable(false)
          // console.log(res)
          if (res.status === 202) {
            document.getElementById('transfer-dialog').style.display = 'none'
            document.getElementById('overlay').style.display = 'none'
            alert("Transferred Successfully.")
          } else {
            alert("Something went wrong.\nPlease try again")
          }
        })
        .catch(err => {
          setDisable(false)
          if (err.status === 404) {
            alert("Invalid credentials\nplease check account number and password")
          } else {
            alert("Something went wrong on our end.\nPlease try again")
          }
          console.log(err)
        })
    } catch (error) {
      setDisable(false)
      alert("Something went wrong.\nPlease try again")
      console.log(error)
    }

  }


  const changePass = (e) => {
    setDisable(true)
    e.preventDefault();
    setPassword('')
    setNewPassword('')
    try {
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/changepass`, { acNumber: response.acNumber, oldPassword: password.trim(), newPassword:newPassword.trim() }, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          setDisable(false)
          // console.log(res);
          if (res.status === 202) {
            document.getElementById('change-pass-dialog').style.display = 'none'
            document.getElementById('overlay').style.display = 'none'
            alert("Password Changed Successfully.")
          } else {
            alert("Something went wrong.\nPlease try again")
          }
        })
        .catch(err => {
          setDisable(false)
          if (err.status === 404) {
            alert("Invalid credentials\nplease check account number and password")
          } else {
            alert("Something went wrong on our end.\nPlease try again")
          }
          console.log(err)
        })
    } catch (error) {
      setDisable(false)
      alert("Something went wrong.\nPlease try again")
      console.log(error)
    }
  }

  const showTransferDialog = () => {
    document.getElementById('transfer-dialog').style.display = 'flex';
    document.getElementById('overlay').style.display = 'block'
  }
  const showChangePassDialog = () => {
    document.getElementById('change-pass-dialog').style.display = 'flex'
    document.getElementById('overlay').style.display = 'block'
  }
  const showDeleteDialog = () => {
    document.getElementById('delete-account-dialog').style.display = 'flex'
    document.getElementById('overlay').style.display = 'block'
  }


  const logout = (e) => {
    setDisable(true)
    e.preventDefault();
    const message = "Are you sure?";
    if (window.confirm(message) === true) {
      window.localStorage.removeItem('accountToken')
      setDisable(false)
      navigate('/banking-frontend/login');
    } else {

    }
  }


  const deleteAccount = (e) => {
    setDisable(true)
    e.preventDefault();
    if (window.confirm("Are you sure?\nThis action can not be undone.") === true) {
      try {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/accounts/delete`, { acNumber: response.acNumber, password:password.trim() }, { headers: { "Content-Type": "application/json" } })
          .then(res => {
            setDisable(false)
            console.log(res)
            if (res.status === 202) {
              document.getElementById('delete-account-dialog').style.display = 'none'
              document.getElementById('overlay').style.display = 'none'
              alert("Account Deleted Successfully.\nThank you for Banking with us.")
              window.localStorage.removeItem('accountToken');
              navigate("/banking-frontend/login")
            } else {
              alert("Something went wrong.\nPlease try again")
            }
          })
          .catch(err => {
            setDisable(false)
            setPassword('')
            if (err.status === 404) {
              alert("Invalid credentials\nplease check account number and password")
            } else {
              alert("Something went wrong on our end.\nPlease try again")
            }
            console.log(err)
          })
      } catch (error) {
        setDisable(false)
        alert("Something went wrong.\nPlease try again")
        console.log(error)
      }
    }
  }

  let showData;
  if (response.length < 1) {
    showData = <div><h1>Loading....</h1></div>
  } else {
    let username = response.acHolderName.split(' ')[0];
    showData = <div className='container display-flex' id='blurred '>
      <button className='btn'  disabled={disable} onClick={logout}>Logout</button>
      <h2>Welcome to Laxmi Chit Fund {username}</h2>
      <table className='info-holder'>
        <thead>
          <tr><th className='fs-22' colSpan={2}>Account Information</th></tr>
        </thead>
        <tbody>
          <tr><th>Account Number</th><td>{response.acNumber}</td></tr>
          <tr><th>Account Holder</th><td>{response.acHolderName}</td></tr>
          <tr><th>Account Balance</th><td>{response.balance}</td></tr>
          <tr><th>Email</th><td>{response.email}</td></tr>
        </tbody>
      </table>
      <div className="other-options">
        <button onClick={showTransferDialog}  disabled={disable}>Send to Account</button>
        <button onClick={showChangePassDialog} disabled={disable}>Change Password</button>
        <button onClick={showDeleteDialog} disabled={disable}>Delete</button>
      </div>
      <div className='dialog' id='transfer-dialog'>
        <form onSubmit={handleTransfer} className='form-container'>
          <h2>Transfer Money</h2>
          <input type="text" id='transfer-ac-number' value={response.acNumber} autoComplete='off' disabled />
          <input type="text" id='second-ac-number' value={secondAcNumber} placeholder='Receivers Account Number' onChange={(e) => setSecondAcNumber(e.target.value)} autoComplete='off' required />
          <input type="password" id='transfer-password' value={password} placeholder='Your Account Password' onChange={(e) => setPassword(e.target.value)} autoComplete='off' required />
          <input type="text" id='amount' value={amount} placeholder='Amount' pattern='[0-9]*' title='Enter only numbers' onChange={(e) => setAmount(e.target.value)} autoComplete='off' required />
          <div className="display-flex button-holder">
            <input type="submit" value="Submit" disabled={disable} />
            <input type="reset" value="Cancel" disabled={disable} onClick={() => { document.getElementById('transfer-dialog').style.display = 'none'; document.getElementById('overlay').style.display = 'none'; }} />
          </div>
        </form>
      </div>
      <div className='dialog' id='change-pass-dialog'>
        <form onSubmit={changePass} className='form-container'>
          <h2>Change Password</h2>
          <input type="text" id='ac-number' value={response.acNumber} disabled />
          <input type="password" id='old-password' value={password} placeholder='Old Password' onChange={(e) => setPassword(e.target.value)} autoComplete='off' required />
          <input type="password" id='new-password' value={newPassword} placeholder='New Password' onChange={(e) => setNewPassword(e.target.value)} autoComplete='off' required />
          <div className="display-flex button-holder">
            <input type="submit" value="Submit" disabled={disable} />
            <input type="reset" value="Cancel" disabled={disable} onClick={() => { document.getElementById('change-pass-dialog').style.display = 'none'; document.getElementById('overlay').style.display = 'none'; }} />
          </div>
        </form>
      </div>
      <div className='dialog' id='delete-account-dialog'>
        <form onSubmit={deleteAccount} className='form-container'>
          <h2>Delete Account</h2>
          <input type="text" id='delete-ac-number' value={response.acNumber} autoComplete='off' disabled />
          <input type="delete-password" id='password' value={password} placeholder='Your Account Password' onChange={(e) => setPassword(e.target.value)} autoComplete='off' required />
          <div className="display-flex button-holder">
            <input type="submit" value="Submit" disabled={disable} />
            <input type="reset" value="Cancel" disabled={disable} onClick={() => { document.getElementById('delete-account-dialog').style.display = 'none'; document.getElementById('overlay').style.display = 'none'; }} />
          </div>
        </form>
      </div>
    </div>
  }
  return (
    <>
      {showData}
      <div id="overlay"></div>
    </>
  )
}

export default Home
