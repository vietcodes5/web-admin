import React from 'react'
import { TextField, Card, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'firebase/app'
const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url(https://picsum.photos/1920/1200)',
    backgroundSize: 'cover',
  },
  form:{
    'width': '30%',
  },
  card: {
    'boxShadow': '10px #33333',
    'display': 'flex',
    'flexDirection': 'column',
    'padding': '20px',
    'minWidth': '300px',
    '& *': {
      margin: '5px',
    },
    '& Button': {
      margin: 'auto',
      width: '40%',
    },
  },
})
function Login() {
    let formLoginSubmitHandler = (e)=>{
        e.preventDefault()
        let formLogin = document.getElementById("form-login")
        let userLogin = {
            emailInput: formLogin.emailInput.value,
            passwordInput : formLogin.passwordInput.value,
        }
        console.log(userLogin);
        firebase.auth().signInWithEmailAndPassword(userLogin.emailInput, userLogin.passwordInput)
        
    }
    
  
  let classes = useStyles()
  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={formLoginSubmitHandler} id='form-login'>
        <Card className={classes.card}>
          <TextField
            name='emailInput'
            label='Email'
            variant='outlined'
          ></TextField>
          <TextField
            name='passwordInput'
            label='Password'
            variant='outlined'
          ></TextField>
          <Button type="submit"
            variant='contained'
            color='primary'
          >
            Login
          </Button>
        </Card>
      </form>
    </div>
  )
}
export default Login
