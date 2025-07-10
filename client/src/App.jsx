import React, { useEffect, useState } from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import AddCandidate from './pages/Add-Candidate';


function App() {
 
  return (
<Router>
<Routes>
<Route path="/" element={<Home />} />
<Route path='/admin'element={<Admin/>}/>
<Route path='/add-candidate'element={<AddCandidate/>}/>



</Routes>
   </Router>
     );
}

export default App;
