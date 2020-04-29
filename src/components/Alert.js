import React from 'react';
import AlertChild from '@material-ui/lab/Alert';
import {
    Snackbar
} from '@material-ui/core';

export default function Alert(props) {
    return (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={true}>
            <AlertChild variant="filled" severity={props.status} >
                {props.content}
            </AlertChild>
        </Snackbar>
    )
}