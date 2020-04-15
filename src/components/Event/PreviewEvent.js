import React, { useState } from 'react'
import firebase from 'firebase'

import { Button, Typography, Paper, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import Popup from '../Popup'
import EditEvent from './EditEvent'
import Markdown from '../Markdown'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '16px',
        height: 'calc( 85vh - 48px)',
        overflow: 'scroll',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    actions: {
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'flex-end',
        '& > *': {
            marginLeft: '8px',
        }
    }
}))

export default function PreviewEvent(props) {
    const classes = useStyles()
    const event = props.event
    const [openPopup, setOpenPopup] = useState(false);
    const [openPopupEdit, setOpenPopupEdit] = useState(false);
    const db = firebase.firestore();
    const storage = firebase.storage();
    const removeEvent = () => {
        setOpenPopup(true);
    }
    const confirmRemoveEvent = async () => {
        Object.values(event.main_photos).forEach(photoName => {
            storage.ref().child(`/events/${photoName}`).delete();
        });
        event.photos.forEach(photoName => {
            storage.ref().child(`/events/${photoName}`).delete();
        });
        db.collection('events').doc(event.id).delete();
        setOpenPopup(false);
    }
    return (
        <Paper className={classes.paper}>
            <div className={classes.header}>
                <Typography variant="h1">{event.title}</Typography>

                <div className={classes.actions}>
                    <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => setOpenPopupEdit(true)} >Edit</Button>
                    <Button variant="outlined" startIcon={<DeleteOutlineIcon />} onClick={removeEvent} >Delete</Button>
                </div>
            </div>
            <Divider />
            <Markdown>{event.content}</Markdown>
            <Popup content="Bạn có chắc chắn muốn xoá Event này?" open={openPopup} updatePopup={setOpenPopup} btnConfirmAction={confirmRemoveEvent} btnConfirmContent="Đồng ý" />
            <Popup content={<EditEvent currentEvent={event} />} open={openPopupEdit} updatePopup={setOpenPopupEdit} fullWidth={true} maxWidth="xl" />
        </Paper>
    )
} 