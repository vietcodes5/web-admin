import React, { useState, useEffect } from 'react';

import firebase from 'firebase';
import 'firebase/firestore';

import {
    Container,
    Button, Paper, Typography, Divider
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Popup from '../Popup';
import EditSeries from './EditSeries'

const useStyles = makeStyles(theme => ({
    root: {

    },
    paper: {
        padding: '16px',
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
    },
    previewRectImg: {
        display: 'block',
        maxWidth: '100%',
        maxHeight: '400px',
        margin: '0 auto',
    },
    previewSquareImg: {
        display: 'block',
        width: '60%',
        margin: '10px auto',
    },
    button: {
        maxHeight: '40px'
    }
}))

export default function PreviewPost(props) {
    const classes = useStyles();
    let currentSeries = props.currentSeries;
    const storage = firebase.storage();
    const [openPopup, setOpenPopup] = useState(false)
    const [openPopupEdit, setPopupEdit] = useState(false)

    const [squareImgSrc, setSquareImgSrc] = useState()
    const [rectImgSrc, setRectImgSrc] = useState()
    useEffect(() => {
        if (props.editing) {
            let promises = Object.values(currentSeries.cover_image).map((imageName) => {
                console.log(imageName);
                return storage
                    .ref(`blog/${imageName}`)
                    .getDownloadURL()
            }
            )
            Promise.all(promises).then(url => {
                console.log('url', url);
                setSquareImgSrc(url[0])
                setRectImgSrc(url[1])

            })
        } else {
            // setSquareImgSrc(URL.createObjectURL(props.squareImg))
            // setRectImgSrc(URL.createObjectURL(props.rectImg))
        }
    })

    const removeSeriesHandle = () => {
        setOpenPopup(true)
    }
    const confirmRemoveSeriesHandle = async () => {
        try {
            Object.values(currentSeries.cover_image).forEach(photoName => {
                storage.ref().child(`/blog/${photoName}`).delete();
            })
            const seriesRef = firebase.firestore().collection('series').doc(currentSeries.id)
            let docSeries = await seriesRef.get()
            let dataSeries = docSeries.data()
            dataSeries.posts.forEach(postRef => postRef.delete())
            await seriesRef
                .delete()
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

            <div className={classes.header} >
                <Typography variant="h2" gutterBottom>
                    {props.currentSeries.title}
                </Typography>
                {
                    props.editing ?
                        <div className={classes.actionsWrapper}>
                            <Button className={classes.button} onClick={editPostHandle} variant="contained" color="primary" startIcon={<EditIcon />}>Edit</Button>
                            <Button className={classes.button} onClick={removeSeriesHandle} variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>
                        </div>
                        : ''
                }
            </div>
            <Divider />

            <Container>
                <img
                    className={classes.previewSquareImg}
                    src={squareImgSrc}
                    alt="Square"
                />
            </Container>
            <Container>
                <img
                    className={classes.previewRectImg}
                    src={rectImgSrc}
                    alt="Rectangle"
                />
            </Container>
            <Popup open={openPopup} updatePopup={setOpenPopup} content="Xoá Series này đồng nghĩa với việc xoá hết các Posts trong Series?" btnConfirmAction={confirmRemoveSeriesHandle} btnConfirmContent="Đồng ý" />
            <Popup open={openPopupEdit} updatePopup={setPopupEdit} content={<EditSeries currentSeries={props.currentSeries} />} />
        </Paper>
    )
}