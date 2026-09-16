
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from "./components/layout/Layout";
import LoginPage from './pages/LoginPage';
import RegisterPage from "./pages/RegisterPage";

function App() {
 

  return (
   <AuthProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/Login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>

      <Route element={<ProtectedRoute/>}>
        <Route element={<Layout/>}>

        </Route>
      </Route>
    </Routes>
    </BrowserRouter>
   </AuthProvider>
  )
}

export default App
