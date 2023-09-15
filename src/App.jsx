import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import './App.css'
import { Form, Button, } from 'react-bootstrap';

let auth = getAuth(app);

function App() {
  let [email, setEmail] = useState('');
  let [pass, setPass] = useState('');
  let [userName, setUserName] = useState('')
  let [error, setError] = useState('');
  let [user, setUser] = useState({});
  let [registered, setRegistered] = useState(false);
  let [validated, setValidated] = useState(false);

  let googleProvider = new GoogleAuthProvider();
  let githubProvider = new GithubAuthProvider();

  let googleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(res => {
        let user = res.user;
        setUser(user);
      })
      .catch(err => setError(err))
  }

  let githubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(res => {
        let user = res.user;
        setUser(user);
      })
      .catch(err => setError(err))
  }

  let emailBlur = event => {
    setEmail(event.target.value)
  }

  let passBlur = event => {
    setPass(event.target.value)
  }

  let userNameBlur = event => {
    setUserName(event.target.value);
  }

  let logIn = event => {
    setRegistered(event.target.checked)
  }

  let userInputName = () => {
    updateProfile(auth.currentUser, {
      displayName: userName
    })
      .then(() => console.log('Updating name'))
      .catch(error => setError(error))
  }

  let userVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(res => console.log("Email verification has been send"))
      .catch(err => setError(err))
  }
  let resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => console.log("password has been sent"))
      .catch(() => console.log('There happen an error'))
  }


  /*===============================
  ========== Form submit ==========
  ===============================*/
  let submitForm = (event) => {

    /*=============Form validation============*/
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    setValidated(true);

    /*======================
     =======Create user===========
     ====================================*/
    if (registered) {
      signInWithEmailAndPassword(auth, email, pass)
        .then((res) => {
          let user = res.user;
          console.log('Loging in user', user)
          setError('')
        })
        .catch(err => {
          setError("The email doesn't exist");
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, pass)
        .then(res => {
          let user = res.user;
          setEmail('')
          setPass('')
          setError('')
          userVerification()
          userInputName();
          console.log(user)
        })
        .catch(error => console.log('error'));
    }

    if (!/(?=.*[!@#$%^&*])/.test(pass)) {
      setError('Password should contain at least one special character')
      return;
    };
    event.preventDefault();
  };

  return (
    <div>
      <div className='sign-in-button'>
        <button className='bg-primary text-white' onClick={googleSignIn}>Google sign in</button>
        <button className='bg-primary text-white' onClick={githubSignIn}>Github sign in</button>
      </div>

      <Form className='shadow-lg p-3 p-5 bg-white rounded' noValidate validated={validated} onSubmit={submitForm}>
        <h2 className='text-primary'>Input your {registered ? 'log in' : 'registration'} details</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={emailBlur} type="email" placeholder="Enter email" required />
          <Form.Control.Feedback className="text-muted" type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        {!registered && <Form.Group className="mb-3" controlId="formUserName">
          <Form.Label>Your name</Form.Label>
          <Form.Control onBlur={userNameBlur} type="text" placeholder="Enter your name" required />
          <Form.Control.Feedback className="text-muted" type="invalid">
            Please provide your name.
          </Form.Control.Feedback>
        </Form.Group>}

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onBlur={passBlur} type="password" placeholder="Password" required />
          <Form.Control.Feedback className="text-muted" type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <small className='text-danger'>{error}</small>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={logIn} type="checkbox" label="Already have an account" />
        </Form.Group>

        {registered ? <Button onClick={resetPassword} variant='link'>Reset Password</Button> : ''}
        <br />
        <Button variant="primary" type="submit">
          {registered ? "Log in" : "Register"}
        </Button>
      </Form>
    </div>
  )
}

export default App
