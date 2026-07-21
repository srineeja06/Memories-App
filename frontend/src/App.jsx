import React from 'react'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Home from './pages/Home/Home'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' exact element={<Home />} />
      <Route path='/login' exact element={<Login />} />
      <Route path='/signUp' exact element={<SignUp />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
