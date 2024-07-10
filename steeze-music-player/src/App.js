import { Routes, Route, useNavigate } from 'react-router-dom';
import { Login, Home } from './components';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from './config/firebase.config'

const App = () => {

  const firebaseAuth = getAuth(app);
  const navigate = useNavigate()
  const [auth, setAuth] = useState(false || window.localStorage.getItem('auth') === "true")

  
useEffect(() => {
  firebaseAuth.onAuthStateChanged((userCred) => {
    if (userCred) {
      userCred.getIdToken().then((token) => {
      })
    } else {
      setAuth(false)
      window.localStorage.setItem('auth', 'false');
      navigate('/login')
    }
  })
})

  return (
    <div className='w-screen h-screen bg-blue-400 flex justify-center items-center'>
      <Routes>
         <Route path='/login'element={<Login setAuth={setAuth} />} />
        <Route path='/*' element={<Home />} />
      </Routes>
    </div>
  )
}

// function App() {
//   return (
//     <div className="container">
//       <h1>Steeze Music Player</h1>
//       <PlayLists />
//       <Songs />
//     </div>
//   );
// }

export default App;
