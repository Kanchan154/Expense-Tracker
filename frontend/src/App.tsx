import { useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignupPage from './Pages/Signup';
import Loading from './Pages/Loading';
import { useUserStore } from './store/user.store';
import NotFoundScreen from './Pages/NotFoundScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, checkMe } = useUserStore()

  useEffect(() => {
    // Simulate loading time for the splash screen
    !user && checkMe();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to={"/login"} />} />
      <Route path="/login" element={user ? <Navigate to={"/"} /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to={"/"} /> : <SignupPage />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
};

export default App;
