import React, { useState, useEffect } from 'react'

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
import Markdown from "../Markdown";

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

export default function EditEvent(props) {
  const currentEvent = props.currentEvent
  const [dialog, setDialog] = useState(false)
  const [title, updateTitle] = useState();
  const [content, updateContent] = useState();
  let classes = useStyles()
  let storage = firebase.storage()

  useEffect(() => {
    updateTitle(currentEvent.title);
    updateContent(currentEvent.content);
  }, [currentEvent])

  let updatePostHandler = async e => {
    e.preventDefault()
    e.persist();
    let data = {
      title: title,
      content: content,
    }
    let eventRef = firebase
      .firestore()
      .collection('events').doc(currentEvent.id)

    eventRef.update(data)

    if (e.target.imageSquare.files[0]) {
      await storage.ref().child(`events/${currentEvent.main_photos.square}`).delete()
      await storage.ref().child(`events/${currentEvent.main_photos.square}`).put(e.target.imageSquare.files[0])
    } else if (e.target.imageRect.files[0]) {
      await storage.ref().child(`events/${currentEvent.main_photos.rect}`).delete()
      await storage.ref().child(`events/${currentEvent.main_photos.rect}`).put(e.target.imageRect.files[0])
    } else if (e.target.imagesInput.files[0]) {
      await currentEvent.photos.forEach(photoName => {
        storage.ref().child(`events/${photoName}`).delete()
      })
      let files = e.target.imagesInput.files
      let filesName = Object.keys(files).map(() => uuidv4())
      filesName.forEach((photoName, i) => {
        storage.ref().child(`events/${photoName}`).put(files[i])
      })
      eventRef.update({
        photos: filesName
      })
    }
  }


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create a new post
      </Typography>
      <Divider />
      <Grid container>
        <Grid item className={classes.create}>
          <form onSubmit={updatePostHandler}>
            <TextField name='eventTitle' value={title} label='Title Event' onChange={(e) => {
              e.persist();
              updateTitle(() => e.target.value)
            }} />
            <InputFile name='imagesInput' multiple={true} label="Chọn ảnh cho event" />
            <InputFile name='imageSquare' multiple={false} label="Ảnh Square" />
            <InputFile name='imageRect' multiple={false} label="Ảnh Rect" />
            <TextareaAutosize
              name='markInput'
              rows='20'
              rowsMax='25'
              placeholder='MarkDown'
              value={content}
              onChange={e => {
                e.persist();
                updateContent(() => e.target.value);
              }}
            />
            <Button type='submit'>Post</Button>
          </form>
        </Grid>
        <Grid item xs>
          Review
          <Markdown>
            {content}
          </Markdown>
        </Grid>
      </Grid>
      <Popup open={dialog} content="Event mới của bạn đã được tao" updatePopup={setDialog} />
    </Container>
  )
}
