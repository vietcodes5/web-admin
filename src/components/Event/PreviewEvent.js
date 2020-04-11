import React, { useState } from 'react'
import firebase from 'firebase'

import { Container, Button } from '@material-ui/core'
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import Popup from '../Popup'
import EditEvent from './EditEvent'

export default function PreviewEvent(props) {
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
        <Container>
            <Button startIcon={<EditIcon />} onClick={() => setOpenPopupEdit(true)} >Edit</Button>
            <Button startIcon={<DeleteOutlineIcon />} onClick={removeEvent} >Delete</Button>
            <h1>{event.title}</h1>
            <p>{event.content}</p>
            <Popup content="Bạn có chắc chắn muốn xoá Event này?" open={openPopup} updatePopup={setOpenPopup} btnConfirmAction={confirmRemoveEvent} btnConfirmContent="Đồng ý" />
            <Popup content={<EditEvent currentEvent={event} />} open={openPopupEdit} updatePopup={setOpenPopupEdit} fullWidth={true} maxWidth="xl" />
        </Container>
    )
} 