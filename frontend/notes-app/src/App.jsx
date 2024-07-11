import React from 'react'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import MarkdownEditorPage from './pages/MarkdownEditor/MarkdownEditorPage'; // Import the new page component

import './App.css'

import {BrowserRouter as Router , Routes, Route} from 'react-router-dom'

const routes = (
  <Router basename={'/Notes3/'}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/edit/:noteId" element={<MarkdownEditorPage />} />
    </Routes>
  </Router>

)


const App = () => {
  return <div>{routes}</div>
    
}

export default App
