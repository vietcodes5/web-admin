import React, { useState } from 'react';

import firebase from 'firebase';
import 'firebase/firestore';

import {
    Button, Paper, Typography, Divider
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
    paper: {
        padding: '16px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    actionsWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '8px',
        '& > *': {
            marginRight: '8px'
        }
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
            //remove photos in post
            post.photos.forEach(photoName => {
                storageRef.child(`/blog/${photoName}`).delete();
            })
            //remove post
            const postRef = db.collection('posts').doc(post.id)
            await postRef
                .delete()
            //update posts in series
            let docSeries = await seriesRef.get()
            let dataSeries = docSeries.data()
            let newPosts = dataSeries.posts.filter(p => p.id !== post.id)
            await seriesRef.update({
                posts: newPosts
            })
            window.location.reload(false);
        } catch (err) {
            console.log(err);
        }
    }
    const editPostHandle = () => {
        setPopupEdit(true)
    }

    return (
        <Paper className={classes.paper}>
            <div className={classes.header}>
                <Typography>{post.title}</Typography>
                <div className={classes.actionsWrapper}>
                    <Button onClick={editPostHandle} variant="contained" color="primary" startIcon={<EditIcon />}>Edit</Button>
                    <Button onClick={removePostHandle} variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>
                </div>
            </div>
            <Divider />
            <MarkDown>{post.content}</MarkDown>
            <Popup open={openPopup} updatePopup={setOpenPopup} content="Bạn có chắc chắn muốn xoá Post này?" btnConfirmAction={confirmRemovePostHandle} btnConfirmContent="Đồng ý" />
            <Popup open={openPopupEdit} updatePopup={setPopupEdit} content={<EditPost currentSeries={props.currentSeries} post={post} series={props.series} />} fullWidth={true} maxWidth="xl" />
        </Paper>
    )
}