import React, { useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {publicRouter} from './routes/index'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import './assets/css/fontawesome.css'
import Toast from './components/toast/Toast'


function App() {
  return (
      <AuthProvider>
        <Router>
          <div className="App">
          <Routes>
          {publicRouter.map((route,index)=>{
            const Page = route.component;
            const isAdminRoute = route.path.startsWith('/admin');
            const isBlogApprovalRoute = route.path === '/blog/approval';
            const isProtectedRoute = route.path === '/blog/create' || route.path === '/blog/my-blogs';
            
            if (isAdminRoute) {
              return (
                <Route 
                  key={index} 
                  path={route.path} 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Page/>
                    </ProtectedRoute>
                  }
                />
              );
            }
            
            if (isBlogApprovalRoute) {
              return (
                <Route 
                  key={index} 
                  path={route.path} 
                  element={
                    <ProtectedRoute requirePermission="canApprovePosts">
                      <Page/>
                    </ProtectedRoute>
                  }
                />
              );
            }
            
            if (isProtectedRoute) {
              return (
                <Route 
                  key={index} 
                  path={route.path} 
                  element={
                    <ProtectedRoute>
                      <Page/>
                    </ProtectedRoute>
                  }
                />
              );
            }
            
            return <Route key={index} path={route.path} element={<Page/>}/>
          })}
          </Routes>
          <Toast />
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;
