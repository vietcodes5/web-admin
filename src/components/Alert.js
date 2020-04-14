import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import {
    Snackbar
} from '@material-ui/core';

export default function Alert(props) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        props.updateAlert(false);
    };
    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={props.showAlert} autoHideDuration={props.time} onClose={handleClose}>
            <MuiAlert variant="filled" severity={props.alertStatus} onClose={handleClose}>
                {props.alertContent}
            </MuiAlert>
        </Snackbar>
    )
}
Alert.defaultProps = {
    showAlert: false,
    time: 3000
}
