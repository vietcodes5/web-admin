import React from 'react';

import { 
  AppBar, 
  Toolbar, 
  Typography, 
} from '@material-ui/core';

import firebase from 'firebase';
import 'firebase/auth';

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h2" style={{ flexGrow: 1 }}>
          Admin Vietcode
        </Typography>

        <Typography variant="body1">
          Signed in as { firebase.auth().currentUser.email }
        </Typography>
      </Toolbar>
    </AppBar >
  )
}
