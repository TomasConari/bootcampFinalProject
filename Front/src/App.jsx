import { useState, useEffect } from 'react';
import './App.css';
import { Dashboard } from './components/Dashboard';

const App = () => {

  //Variables

  const host = "http://192.168.20.30:8000";

  //States

  const [error, setError] = useState("");
  const [Auth, setAuth] = useState(false);
  const [user, setUser] = useState({
    username: '',
    password: ''
  });
  const [signUser, setSignUser] = useState({
    name: '',
    lastname: '',
    username: '',
    password: ''
  });
  const [header, setHeader] = useState({
    'Content-type': 'application/json',
    'auth-token': ''
  });

  //Functions

  const setUserAndPassword = (type, event) => {
    const word = event.target.value;
    setUser((prevUser) => ({
      ...prevUser,
      [type]: word
    }));
  };

  const setSignUp = (type, event) => {
    const word = event.target.value;
    setSignUser((prevUser) => ({
      ...prevUser,
      [type]: word
    }));
  };

  const login = async () => {
    try{
      const response = await fetch(`${host}/user/login`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(user)
      });
      if(response.status === 200){
        const responseJson = await response.json();
        setHeader((prevHeader) => ({
          ...prevHeader,
          'auth-token': responseJson.token
        }));
        setAuth(true);
        localStorage.setItem('auth-token', responseJson.token);
      }else if(response.status === 401){
        setError("Incorrect username or password");
        setTimeout(() => setError(""), 4000);
      }else{
        setError("An error occurred");
        setTimeout(() => setError(""), 4000);
      };
    }catch(error){
      setError("An error occurred");
      setTimeout(() => setError(""), 4000);
    };
  };
  
  const signUp = async () => {
    if(!signUser.name || !signUser.lastname || !signUser.username || !signUser.password){
      setError("Please fill in all fields");
      setTimeout(() => setError(""), 4000);
      return;
    };
    if(signUser.password.length < 6){
      setError("Password should be at least 6 characters long");
      setTimeout(() => setError(""), 4000);
      return;
    };
    try{
      const response = await fetch(`${host}/user/create`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(signUser)
      });
      try{
        if(response.status === 201){
          setSignUser({
            name: '',
            lastname: '',
            username: '',
            password: ''
          });
          setError(`User created, please Log In`);
          setTimeout(() => setError(""), 5000);
        };
      }catch(error){
        setError("User Created, message error");
        setTimeout(() => setError(""), 4000);
      };
    }catch(error){
      setError("An error occurred");
      setTimeout(() => setError(""), 4000);
    };
  };
  console.log(signUser)

  const logout = () => {
    localStorage.removeItem('auth-token');
    setHeader((prevHeader) => ({
      ...prevHeader,
      'auth-token': ''
    }));
    setAuth(false);
  };

  //Keep Login on re-render

  useEffect(() => {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      setHeader((prevHeader) => ({
        ...prevHeader,
        'auth-token': authToken
      }));
      setAuth(true);
    }
  }, []);

  //return

  if(!Auth){
    return(
      <div>
        <div>
          <input type="text" placeholder="Username" onChange={(event) => setUserAndPassword('username', event)} />
          <input type="password" placeholder="Password" onChange={(event) => setUserAndPassword('password', event)} />
          <button onClick={login}>Login</button>
        </div>
        <div>
          <input type="text" value={signUser.name} placeholder="Name" onChange={(event) => setSignUp('name', event)} />
          <input type="text" value={signUser.lastname}placeholder="Lastname" onChange={(event) => setSignUp('lastname', event)} />
          <input type="text" value={signUser.username} placeholder="Username" onChange={(event) => setSignUp('username', event)} />
          <input type="password" value={signUser.password} placeholder="Password" onChange={(event) => setSignUp('password', event)} />
          <button onClick={signUp}>SignUp</button>
        </div>
        {error && <p>{error}</p>}
      </div>
    );
  }else{
    return(
      <div>
        <button onClick={logout}>Logout</button>
        <Dashboard host={host} header={header} />
      </div>
    );
  };
};

export default App;
