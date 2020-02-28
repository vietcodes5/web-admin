import React from 'react';

import {AppBar, Toolbar, Typography,IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'


export default function Header(){
    return(
            <AppBar position="static">
                <Toolbar>
                    <IconButton>
                        <MenuIcon/>
                    </IconButton>
                    <Typography>
                        Admin VietCode
                    </Typography>

                </Toolbar>
            </AppBar>
    )
}