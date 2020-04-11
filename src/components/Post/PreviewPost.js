import React, { useState } from 'react';

import firebase from 'firebase';
import 'firebase/firestore';

import {
    Container,
    Button, Paper
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EditPost from './EditPost';
import MarkDown from '../Markdown';
import Popup from '../Popup';

const useStyles = makeStyles(theme => ({
    root: {

    },
    button: {
        margin: '0px 10px'
    },
    paper: {
        padding: '24px'
    },
    btnActionWrapper: {
        display: 'flex',
        flexDirection: 'flex-end',
    }

}))

export default function PreviewPost(props) {
    const classes = useStyles()
    const [openPopup, setOpenPopup] = useState(false)
    const [openPopupEdit, setPopupEdit] = useState(false)
    const post = { ...props.post };
    let seriesRef = post.series;
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();

    const removePostHandle = () => {
        setOpenPopup(true)
    }
    const confirmRemovePostHandle = async () => {
        try {
            post.photos.forEach(photoName => {
                storageRef.child(`/blog/${photoName}`).delete();
            })
            const postRef = db.collection('posts').doc(post.id)
            await postRef
                .delete()
            let docSeries = await seriesRef.get()
            let dataSeries = docSeries.data()
            let newPosts = dataSeries.posts.filter(p => p.id !== post.id)
            await seriesRef.update({
                posts: newPosts
            })
            setOpenPopup(false)

        } catch (err) {
            console.log(err);
        }
    }
    const editPostHandle = () => {
        setPopupEdit(true)
    }

    return (
        <Paper className={classes.paper}>
            <Container className={classes.btnActionWrapper}>
                <Button className={classes.button} onClick={editPostHandle} variant="contained" startIcon={<EditIcon />}>Edit</Button>
                <Button className={classes.button} onClick={removePostHandle} variant="contained" color="secondary" startIcon={<DeleteIcon />}>Delete</Button>
            </Container>
            <h1>{post.title}</h1>
            <MarkDown>{post.content}</MarkDown>
            <Popup open={openPopup} updatePopup={setOpenPopup} content="Bạn có chắc chắn muốn xoá Post này?" btnConfirmAction={confirmRemovePostHandle} btnConfirmContent="Đồng ý" />
            <Popup open={openPopupEdit} updatePopup={setPopupEdit} content={<EditPost currentSeries={props.currentSeries} post={post} series={props.series} />} fullWidth={true} maxWidth="xl" />
        </Paper>
    )
}