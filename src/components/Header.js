import React from 'react';
import {Link} from 'react-router-dom'
import logo from '../img/LOGO.3fefe216.png'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button,
  IconButton,
  Avatar,
  Popover
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Description from '@material-ui/icons/Description';
import EventNoteIcon from '@material-ui/icons/EventNote';
import {makeStyles} from '@material-ui/core/styles'

import firebase from 'firebase';
import 'firebase/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    // border: "1px solid black",
    justifyContent: "space-between",
  },
  typography:{
    padding: theme.spacing(2),
  },
  logo: {
    width: "175px", 
    height: "auto",
    padding: theme.spacing(1),
  },
  button: {
    width: '150px',
    height: '65px',
    color: 'white',
    fontSize: '15px',
    fontWeight:'500',
    '&:hover': {
      backgroundColor: theme.palette.hover.main,
      boxShadow: theme.shadow.hover,
    },
    '&:focus': {
      backgroundColor: theme.palette.active.main,
    },
  },
  iconColor: {
    backgroundColor: theme.palette.hover.main,
    shadow: theme.shadow.dropdown
  }
}))


export default function Header() {
  let logout = () => {
        firebase.auth().signOut();
  };
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
   <div>
     <AppBar position="static" >
       <Toolbar className={classes.root}>
          <div style={{display:'flex', justifyContent:'flex-center'}}>
            <img 
                src={logo} 
                alt="VietCode"
                className={classes.logo}
              />
           <Link to='/blog'><Button className={classes.button}><Description/> BLOG</Button></Link>
           <Link to='/events'><Button className={classes.button}><EventNoteIcon/> EVENTS</Button></Link>
          </div>

          <IconButton
            color="inherit"
            aria-describedby={id}
            onClick={handleClick}
          >
            <Avatar alt={firebase.auth().currentUser.email} src="nothing" className={classes.iconColor} />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography className={classes.typography}>
              Signed in as { firebase.auth().currentUser.email }
              <br/>
              <Button color="inherit" onClick={logout} style={{float: 'right'}}><ExitToAppIcon/> LOG OUT</Button>
            </Typography>
          </Popover>
       </Toolbar>
     </AppBar>
   </div>
  );
}