import React, { useState, useEffect } from 'react';

import {
  Container,
  Grid,
  Typography,
  Divider,
  Button,
  TextField
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import PreviewSeries from './PreviewSeries';
import Popup from '../Popup';
import Alert from '../Alert';

import firebase from 'firebase';
import 'firebase/storage';
import 'firebase/firestore';

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
  const classes = useStyles();
  const [series, updateSeries] = useState(defaultValues);
  const [newImages, updateNewImages] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const currentSeries = props.currentSeries
  const [alertComponent, setAlertComponent] = useState(null);

  const setAlert = (status, content, time = 3) => {
    setAlertComponent(<Alert status={status} content={content} />)
    setTimeout(() => setAlertComponent(null), time * 1000);
  }

  useEffect(() => {
    updateSeries(currentSeries)
    updateNewImages()
  }, [currentSeries])

  function handleImageChange(e) {
    e.persist();

    updateNewImages(prevState => ({
      ...prevState,
      [e.target.name]: e.target.files[0]
    }));
  }

  function handleInputChange(e) {
    e.persist();
    updateSeries(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const db = firebase.firestore();
    const storageRef = firebase.storage().ref();
    if (!series.title) {
      setAlert('warning', 'Bạn chưa có title cho Series', 3)
      return;
    } else if (!series.description) {
      setAlert('warning', 'Bạn chưa có mô tả cho Series', 3)
      return;
    } else if (!series.cover_image.rect || !series.cover_image.square) {
      setAlert('warning', 'Bạn chưa có ảnh cho Series', 3)
      return;
    }
    try {
      await db.collection('series').doc(currentSeries.id)
        .update(series)
        .catch(error => {
          console.log(error);
        });

      if (newImages && newImages.rect) {
        await storageRef.child(`/blog/${series.cover_image.rect}`).delete()
        await storageRef.child(`/blog/${series.cover_image.rect}`).put(newImages.rect)
      } else if (newImages && newImages.square) {
        await storageRef.child(`/blog/${series.cover_image.square}`).delete()
        await storageRef.child(`/blog/${series.cover_image.square}`).put(newImages.square)
      }
      setOpenPopup(true);
    } catch (err) {
      console.log(err);

    }

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
                value={series.title}
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
                value={series.description}
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
                Update
              </Button>
            </div>
          </form>
        </Grid>
        <Grid item xs={12} md={6}>
          <PreviewSeries
            editing={false}
            currentSeries={series}
          />
        </Grid>
      </Grid>
      <Popup content="Đã sửa thành công" open={openPopup} updatePopup={setOpenPopup} />
      {alertComponent}
    </Container>
  );


}
