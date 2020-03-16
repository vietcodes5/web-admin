import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/storage';

import {
  Button,
  Typography,
  Divider,
  Grid,
} from '@material-ui/core';

import Markdown from '../components/Markdown';

const useStyles = makeStyles(theme => ({
  cover_image: {
    maxWidth: '100%',
    maxHeight: '450px',
    display: 'block',
    margin: '20px auto',
  }  ,
}));

const defaultPost = {
  title: 'Loading...',
  content: 'Loading...',
  photos: [],
  opening: 'Loading...'
};

export default function Post(props) {
  const { id } = useParams();
  const [ photos, updatePhotos ] = useState([]);
  const [ post, loadPost ] = useState(defaultPost);
  const classes = useStyles();

  useEffect(() => {
    const db = firebase.firestore();
    const storage = firebase.storage();

    db.collection('posts')
      .doc(id)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return console.log('Cannot find post with id: ' + id);
        }

        const data = doc.data();
        const photos = data.photos;

        loadPost(data);

        // load photo URLs
        photos.forEach(photo => {
          storage
            .ref(`posts/${photo}`)
            .getDownloadURL()
            .then(url => updatePhotos((prevState) => [...prevState, url]));
        });
      });

  }, [ id ]);

  console.log(photos);

  return (
    <Grid container>
      <Grid item xs={12} md={8}>
        <Typography variant="h2" gutterBottom>
          { post.title }
        </Typography>
        <Divider />

        <img className={classes.cover_image} src={photos[0]} alt="Post cover" />

        <Typography variant="subtitle1" gutterBottom>
          { post.opening }
        </Typography>

        <Markdown>
          { post.content }
        </Markdown>

      </Grid>
      <Grid item xs={12} md={4}>
        <Button variant="outlined" color="primary">
          Edit
        </Button>
        <Button variant="outlined" color="secondary">
          Delete
        </Button>
      </Grid>
    </Grid>
  );
}
