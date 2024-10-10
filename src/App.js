import React from 'react'
import { Routes, Route, HashRouter } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount'
import Error404 from './pages/Error404'

function App() {

  return (
    <HashRouter>
      <Routes>
          <Route exact path='/banking-frontend' element={<Home />} />
        <Route exact path='/banking-frontend/login' element={<Login />} />
        <Route exact path='/banking-frontend/register' element={<CreateAccount />} />
        <Route exact path='*' element={<Error404 />} />
      </Routes>
    </HashRouter>
  )
}

export default App
