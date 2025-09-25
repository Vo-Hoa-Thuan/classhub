import React, { useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {publicRouter} from './routes/index'
import { AuthProvider } from './hooks/useAuth'
import './assets/css/fontawesome.css'


function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
          <Routes>
          {publicRouter.map((route,index)=>{
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page/>}/>
          })}
          </Routes>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;
