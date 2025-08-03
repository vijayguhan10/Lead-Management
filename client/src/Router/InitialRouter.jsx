import React from 'react'
import { Routes,Route } from "react-router-dom";
import Auth from '../components/Auth/Auth';
const InitialRouter = () => {
  return (
    <div>
        <Routes>
            <Route path="/login" element={<Auth />} />
        </Routes>
    </div>
  )
}

export default InitialRouter