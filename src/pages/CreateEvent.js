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
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import Popup from '../components/Popup';
import InputFile from '../components/InputFile';

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
  let storageRef = storage.ref()
  let getTypeOfFile = (string) => {
    let a = string.split('.')
    return a[a.length - 1]
  }

  let createPostHandler = e => {
    e.preventDefault()
    let files = e.target.imageInput.files
    let fileSquare = e.target.imageSquare.files[0]
    let fileRect = e.target.imageRect.files[0]
    let fileNames = []
    let nameSquare = `${uuidv4()}.${getTypeOfFile(fileSquare.name)}`
    let nameRect = `${uuidv4()}.${getTypeOfFile(fileRect.name)}`
    for (const file of files) {
      let type = getTypeOfFile(file.name)
      fileNames.push(`${uuidv4()}.${type}`);
    }
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
        storageRef.child(`/events/${nameSquare}`).put(fileSquare)
        storageRef.child(`/events/${nameRect}`).put(fileRect)
        for (let i = 0; i < files.length; i++) {
          storageRef.child(`/events/${fileNames[i]}`).put(files[i])
        }
      })
      .then(() => setDialog(true))
      .catch(err => console.log(err))
  }


  return (
    <Container>
      <Grid container>
        <Grid container xs direction='column' className={classes.create}>
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
        <Grid xs>
          Review
          <Markdown markup={markInput} />
        </Grid>
      </Grid>
      <Popup show={dialog} content="Event mới của bạn đã được tao" updatePopup={setDialog} direction="/events" />
    </Container>
  )
}
