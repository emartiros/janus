import './App.css';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Manager from './screens/Manager';
import Login from './screens/Login';

function App(props) {
  const {accessKey} = useContext(AuthContext)

  if (!accessKey) {
    return <Login />
  }

  return (
    <Manager />
  );
}

export default App;
