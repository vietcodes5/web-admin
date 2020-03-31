import React, { useState } from 'react';

import {
  Container,
  Grid,
  Typography,
  Divider,
  Button,
  TextField
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import firebase from 'firebase';
import 'firebase/storage';
import 'firebase/firestore';
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles(theme => ({
  form: {
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '2px',
    boxShadow: theme.shadow.dropdown,

    '& > div': {
      margin: '10px 0',
    }
  },
  fileInputLabel: {
    display: 'block',
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    padding: '10px',
    width: '200px',
    textAlign: 'center',
    fontSize: '120%',
    borderRadius: '3px',
    boxShadow: theme.shadow.dropdown,

    '&:hover': {
      backgroundColor: theme.palette.hover.main,
      boxShadow: theme.shadow.hover,
    },

    '& + input[type="file"]': {
      width: 0,
      height: 0,
      overflow: 'hidden',
      opacity: 0,
      position: 'absolute',
      zIndex: -1,
    },
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
}));

const defaultValues = {
  title: '',
  description: '',
  cover_image: {
    rect: null,
    square: null,
  }
}

export default function CreateSeries(props) {
  const [ newSeries, updateNewSeries ] = useState(defaultValues);
  const classes = useStyles();

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Create new Series
      </Typography>
      <Divider />

      <Grid container spacing={3} style={{ marginTop: '10px' }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h2" gutterBottom>
            Details
          </Typography>

          <form 
            className={classes.form} 
            onSubmit={handleFormSubmit}
          >
            <div>
              <TextField 
                fullWidth
                label="Series title"
                variant="outlined"
                value={newSeries.title}
                onChange={handleInputChange}
                name="title"
              />
            </div>

            <div>
              <TextField
                fullWidth
                multiline
                rows={5}
                label="Description"
                variant="outlined"
                value={newSeries.description}
                onChange={handleInputChange}
                name="description"
              />
            </div>

            <div style={{ 
              display: 'flex', 
              flexFlow: 'wrap row', 
              justifyContent: 'space-between' }}>
              <div style={{ display: 'inline-block', margin: '5px 0' }}>
                <label 
                  className={classes.fileInputLabel} 
                  htmlFor="rect_image">
                  Rectangle cover image
                </label>
                <input
                  id="rect_image"
                  onChange={handleImageChange}
                  type="file" 
                  name="rect" 
                  required />
              </div>

              <div style={{ display: 'inline-block', margin: '5px 0' }}>
                <label
                  className={classes.fileInputLabel} 
                  htmlFor="square_image">
                  Square cover image
                </label>
                <input
                  id="square_image"
                  onChange={handleImageChange}
                  type="file" 
                  name="square" 
                  required />
              </div>
            </div>

            <div>
              <Button type="submit" variant="contained">
                Create
              </Button>
            </div>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          <Preview 
            squareImg={newSeries.cover_image.square}
            rectImg={newSeries.cover_image.rect}
          />
        </Grid>
      </Grid>
    </>
  );

  function handleImageChange(e) {
    e.persist();

    updateNewSeries(prevState => ({
      ...prevState,
      cover_image: {
        ...prevState.cover_image,
        [ e.target.name ]: e.target.files[0]
      }
    }));
  }

  function handleInputChange(e) {
    e.persist();

    updateNewSeries(prevState => ({
      ...prevState,
      [ e.target.name ]: e.target.value
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();
    
    const promises = [
      storageRef.child(`/blog/${uuidv4()}`).put(newSeries.cover_image.rect),
      storageRef.child(`/blog/${uuidv4()}`).put(newSeries.cover_image.square),
    ];

    Promise
      .all(promises)
      .then((data) => {
        const rectImageName = data[0].metadata.name,
              squareImageName = data[1].metadata.name;

        const newSeriesData = {
          ...newSeries,
          cover_image: {
            rect: rectImageName,
            square: squareImageName,
          },
          posts: []
        };    

        db.collection('series')
          .add(newSeriesData)
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.log(error);
          });
      });
  }
}

function Preview(props) {
  const classes = useStyles();
  const squareImgSrc = props.squareImg == null ? "" : URL.createObjectURL(props.squareImg);
  const rectImgSrc = props.rectImg == null ? "" : URL.createObjectURL(props.rectImg);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Preview
      </Typography>
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
    </>
  );
}
