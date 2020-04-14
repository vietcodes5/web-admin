import React, { useState } from 'react'

import firebase from 'firebase/app'
import { v4 as uuidv4 } from 'uuid';

import {
  Container,
  Grid,
  TextField,
  TextareaAutosize,
  Button,
  Typography,
  Divider,
  Paper
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import Popup from '../Popup';
import InputFile from '../InputFile';
import Alert from '../Alert'
import Markdown from '../Markdown'
let useStyles = makeStyles({
  create: {
    'marginTop': '20px',
    '& form': {
      'display': 'flex',
      'flexDirection': 'column',
      '& *': {
        margin: '5px 5px',
      },
    },
    preview: {
      height: '500px',
      width: '100px'
    }
  },
})

export default function CreatPost() {
  const [dialog, setDialog] = useState(false);
  const [title, updateTitle] = useState('');
  const [content, updateContent] = useState('');
  const [validateTile, updateValidateTitle] = useState();
  const [validateContent, updateValidateContent] = useState();

  const [alertStatus, setAlertStatus] = useState('');
  const [alertContent, setAlertContent] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  let classes = useStyles()
  let storage = firebase.storage()
  const setAlert = (status, content) => {
    setAlertStatus(status);
    setAlertContent(content);
    setShowAlert(true);
  }

  let createPostHandler = e => {
    e.preventDefault()
    let files = e.target.imageInput.files
    let fileSquare = e.target.imageSquare.files[0]
    let fileRect = e.target.imageRect.files[0]
    if (!title) {
      updateValidateTitle(true);
    }
    if (!content) {
      updateValidateContent(true);
    }
    if (!files || !fileSquare || !fileRect || !title || !content) {
      updateValidateTitle(true)
      setAlert('warning', "Bạn cần điền đầy đủ thông tin!!!")
      return;
    }
    let nameSquare = uuidv4();
    let nameRect = uuidv4();
    let fileNames = Object.keys(files).map(() => uuidv4());
    let data = {
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
      photos: fileNames,
      main_photos: {
        square: nameSquare,
        rect: nameRect
      },
    }
    firebase
      .firestore()
      .collection('events')
      .add(data)
      .then(() => {
        storage.ref().child(`/events/${nameSquare}`).put(fileSquare)
        storage.ref().child(`/events/${nameRect}`).put(fileRect)
        fileNames.forEach((name, i) => {
          storage.ref().child(`/events/${name}`).put(files[i])
        })
      })
      .then(() => setDialog(true))
      .catch(err => console.log(err))
  }


  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Create a new post
      </Typography>
      <Divider />
      <Grid container>
        <Grid item className={classes.create} xs={5}>
          <form noValidate onSubmit={createPostHandler}>
            <TextField name='title' label='Title Event' variant="outlined"
              error={validateTile}
              value={title}
              onChange={(e) => {
                e.persist()
                updateValidateTitle(false);
                updateTitle(e.target.value);
              }} />
            <InputFile name='imageInput' multiple={true} label="Chọn ảnh cho event" required />
            <InputFile name='imageSquare' multiple={false} label="Ảnh Square" />
            <InputFile name='imageRect' multiple={false} label="Ảnh Rect" />
            <TextareaAutosize
              name='markInput'
              rows='20'
              rowsMax='25'
              placeholder='MarkDown'
              onChange={(e) => {
                e.persist();
                updateContent(e.target.value);
              }}
            />
            <div>
              <Button variant="contained" type='submit'>Post</Button>
            </div>
          </form>
        </Grid>
        <Grid item xs={7}>

          Review
            <Divider />
          <div >
            <Paper className={classes.preview}>
              <Markdown>
                {content}
              </Markdown>
            </Paper>
          </div>
        </Grid>
      </Grid>
      <Popup open={dialog} content="Event mới của bạn đã được tao" updatePopup={setDialog} />
      <Alert showAlert={showAlert} updateAlert={setShowAlert} alertStatus={alertStatus} alertContent={alertContent} />
    </Container >
  )
}
