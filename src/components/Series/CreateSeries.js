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

import PreviewSeries from './PreviewSeries'
import Alert from '../Alert';
import Popup from '../Popup';

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
  const [newSeries, updateNewSeries] = useState(defaultValues);
  const classes = useStyles();

  const [alertComponent, setAlertComponent] = useState(null);
  const [dialog, setDialog] = useState(false);

  let setAlert = (status, content, time) => {
    setAlertComponent(<Alert status={status} content={content} time={time} />)
    setTimeout(() => setAlertComponent(null), time)
  }

  function handleImageChange(e) {
    e.persist();

    updateNewSeries(prevState => ({
      ...prevState,
      cover_image: {
        ...prevState.cover_image,
        [e.target.name]: e.target.files[0]
      }
    }));
  }

  function handleInputChange(e) {
    e.persist();

    updateNewSeries(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!newSeries.title) {
      setAlert('warning', 'Bạn chưa có title cho Series', 3000)
      return;
    } else if (!newSeries.description) {
      setAlert('warning', 'Bạn chưa có mô tả cho Series', 3000)
      return;
    } else if (!newSeries.cover_image.rect || !newSeries.cover_image.square) {
      setAlert('warning', 'Bạn chưa có ảnh cho Series', 3000)
      return;
    }
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
            setDialog(true);
          })
          .catch(error => {
            console.log(error);
          });
      });
  }

  return (
    <Container>
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
              justifyContent: 'space-between'
            }}>
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
                  name="rect" />
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
                  name="square" />
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
          <PreviewSeries
            editing={false}
            currentSeries={newSeries}
            squareImg={newSeries.cover_image.square}
            rectImg={newSeries.cover_image.rect}
          />
        </Grid>
      </Grid>
      {alertComponent}
      <Popup content="Bạn đã tạo thành công series" open={dialog} updatePopup={setDialog} />
    </Container>
  );


}


