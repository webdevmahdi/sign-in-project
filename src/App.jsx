import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth'
import './App.css'
import { Form, Button, } from 'react-bootstrap';

let auth = getAuth(app);

function App() {
  let [email, setEmail] = useState('');
  let [pass, setPass] = useState('');
  let [userName, setUserName] = useState('')
  let [error, setError] = useState('');
  let [register, setRegister] = useState(false);
  let [validated, setValidated] = useState(false);


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
  setRegister(event.target.checked)
 }

 let userInputName = () => {
  updateProfile(auth.currentUser, {
    displayName: userName
  })
  .then(()=> console.log('Updating name'))
  .catch(error => setError(error))
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

    createUserWithEmailAndPassword(auth, email, pass)
    .then(res => {
      let user = res.user;
      userInputName();
      console.log(user)
    })
    .catch(error => setError(error));


    event.preventDefault();
  };

  console.log(email, pass, userName, register)
  return (
    <div>
      <Form className='shadow-lg p-3 p-5 bg-white rounded' noValidate validated={validated} onSubmit={submitForm}>
        <h2>Input your {register ? 'log in' : 'registration'} details</h2>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control onBlur={emailBlur} type="email" placeholder="Enter email" required />
          <Form.Control.Feedback className="text-muted" type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        { !register && <Form.Group className="mb-3" controlId="formUserName">
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

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check onChange={logIn} type="checkbox" label="Already have an account" />
        </Form.Group>

        <Button variant="primary" type="submit">
          {register ? "Log in" : "Register"}
        </Button>
      </Form>
    </div>
  )
}

export default App
