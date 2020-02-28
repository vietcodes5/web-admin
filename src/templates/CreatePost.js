import React, { useState } from 'react'
import { Markdown } from 'react-showdown'
import firebase from 'firebase/app'

import {
  Container,
  Grid,
  TextField,
  TextareaAutosize,
  Button,
  Input,
  FilledInput,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
  let classes = useStyles()
  let storage = firebase.storage()
  let storageRef = storage.ref()
  let createPostHandler = e => {
    e.preventDefault()
    let file = e.target.imageInput.files[0]
    let fileName = `${new Date().toISOString()}_${file.name}`
    let data = {
      title: e.target.postTitle.value,
      markdown: e.target.markInput.value,
      createdAt: new Date().toISOString(),
      photo: fileName,
      author: firebase.auth().currentUser.email,
    }
    firebase
      .firestore()
      .collection('posts')
      .add(data)
      .then(storageRef.child(fileName).put(file))
      .then(() => console.log('Done'))
      .catch(err => console.log(err))
  }
  return (
    <Container>
      <Grid container>
        <Grid container xs direction='column' className={classes.create}>
          <form onSubmit={createPostHandler}>
            <TextField name='postTitle' label='Tile Post' />
            <FilledInput
              type='file'
              label='Standard'
              name='imageInput'
            ></FilledInput>
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
    </Container>
  )
}
