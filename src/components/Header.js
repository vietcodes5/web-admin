import React from 'react';
import {Link} from 'react-router-dom'
import logo from '../img/LOGO.3fefe216.png'

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  Tabs, Tab
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles'

import firebase from 'firebase';
import 'firebase/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    width: "150px", 
    height: "auto",
    marginRight: theme.spacing(5),
  },
}))

export default function Header() {
  let logout = () => {
    firebase.auth().signOut();
  };
  const classes = useStyles();
  const [val, setVal] = React.useState(0);
  const handleChange = (e, newVal) => {
    setVal(newVal);
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <img 
            src={logo} 
            alt="VietCode"
            className={classes.logo}
          />
          <Tabs  
            // variant="fullWidth"
            // textColor="primary"
            value={val}
            indicatorColor="secondary"
            onChange={handleChange}
            aria-label="nav tabs"
            style={{ flexGrow: 1}}
            // className={classes.root}
          >
            <Tab to="/blog" label="BLOG" component={Link}/>
            <Tab to="/events" label="EVENTS" component={Link}/>
          </Tabs>
          {/* <Typography variant="h5" className={classes.link}>
            <Link to="/blog">BLOG</Link>
          </Typography>
          <Typography variant="h5" style={{flexGrow: 1}}>
            <Link to="/events">EVENTS</Link>
          </Typography> */}
          <div >
            <Typography variant="body1" >
              Signed in as { firebase.auth().currentUser.email }
            </Typography>
            <Button style={{float: "right",}} color="inherit" onClick={logout}>LOG OUT</Button>
          </div>
        </Toolbar>
      </AppBar >
    </div>
  )
}
