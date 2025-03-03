import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ConfirmSignup from './pages/ConfirmSignup';
import { Amplify } from 'aws-amplify';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import awsConfig from './aws-exports';

console.log("AWS Config:", awsConfig);
try {
  Amplify.configure(awsConfig);
}
catch (e) {
  console.error('Error:', e)
}


function App() {

  return (
    <BrowserRouter>
      {/*<Authenticator>*/}
      <Header />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm" element={<ConfirmSignup />} />
      </Routes>
      {/*</Authenticator>*/}
    </BrowserRouter>
  )
}

export default App; 
