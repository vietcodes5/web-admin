import React, { useState } from 'react'
import { Markdown } from 'react-showdown'

import firebase from 'firebase/app'
import { v4 as uuidv4 } from 'uuid';

import {
  Container,
  Grid,
  TextField,
  TextareaAutosize,
  Button,
  Typography,
  Divider
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import Popup from '../Popup';
import InputFile from '../InputFile';

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
  },
})

export default function CreatPost() {
  const [markInput, changeMark] = useState('Review HTML')
  const [dialog, setDialog] = useState(false)
  let classes = useStyles()
  let storage = firebase.storage()


  let createPostHandler = e => {
    e.preventDefault()
    let files = e.target.imageInput.files
    let fileSquare = e.target.imageSquare.files[0]
    let fileRect = e.target.imageRect.files[0]
    let nameSquare = uuidv4();
    let nameRect = uuidv4();
    let fileNames = Object.keys(files).map(() => uuidv4());
    let data = {
      title: e.target.eventTitle.value,
      content: e.target.markInput.value,
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
    <Container>
      <Typography variant="h4" gutterBottom>
        Create a new post
      </Typography>
      <Divider />
      <Grid container>
        <Grid item className={classes.create}>
          <form onSubmit={createPostHandler}>
            <TextField name='eventTitle' label='Title Event' />
            <InputFile name='imageInput' multiple={true} label="Chọn ảnh cho event" />
            <InputFile name='imageSquare' multiple={false} label="Ảnh Square" />
            <InputFile name='imageRect' multiple={false} label="Ảnh Rect" />
            <TextareaAutosize
              name='markInput'
              rows='20'
              rowsMax='25'
              placeholder='MarkDown'
              onChange={e => changeMark(e.target.value)}
            />
            <Button type='submit'>Post</Button>
          </form>
        </Grid>
        <Grid item>
          Review
          <Markdown markup={markInput} />
        </Grid>
      </Grid>
      <Popup open={dialog} content="Event mới của bạn đã được tao" updatePopup={setDialog} />
    </Container>
  )
}
