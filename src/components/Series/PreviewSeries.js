import React, { useState, useEffect } from 'react';

import firebase from 'firebase';
import 'firebase/firestore';

import {
    Container,
    Button, Paper, Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Popup from '../Popup';
import EditSeries from './EditSeries'

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

            <Typography variant="h2" gutterBottom>
                Preview Series {
                    props.currentSeries.title
                }
            </Typography>
            {
                props.editing ?
                    <Container className={classes.btnActionWrapper}>
                        <Button className={classes.button} onClick={editPostHandle} variant="contained" startIcon={<EditIcon />}>Edit</Button>
                        <Button className={classes.button} onClick={removeSeriesHandle} variant="contained" color="secondary" startIcon={<DeleteIcon />}>Delete</Button>
                    </Container>
                    : ''

            }
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