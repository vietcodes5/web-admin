import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
  Container,
  Divider,
  Grid,
  TextField,
  TextareaAutosize,
  Button,
  Typography,
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

import Popup from "../components/Popup";
import Markdown from "../components/Markdown";

let useStyles = makeStyles({
  create: {
    "& form": {
      display: "flex",
      flexDirection: "column",
      "& > *": {
        margin: "5px 5px"
      }
    }
  },
  fileInputLabel: {
    cursor: 'pointer',
    backgroundColor: '#0af',
    color: 'white',
    padding: '10px',
    width: '200px',
    textAlign: 'center',
    fontSize: '120%',
    borderRadius: '3px',

    '&:hover': {
      backgroundColor: '#08a',
    },

    '& + #images': {
      width: 0,
      height: 0,
      overflow: 'hidden',
      opacity: 0,
      position: 'absolute',
      zIndex: -1,
    },
  },
  previewContainer: {
    padding: '5px 10px',
    border: '1px solid #999',
    borderRadius: '5px',
    minHeight: '70vh',
  },
  contentInput: {
    padding: '5px 10px',
  }
});

export default function CreatPost() {
  const [ markInput, changeMark ] = useState("");
  const [ dialog, setDialog ] = useState(false);
  const [ series, setSeries ] = useState([]);
  const [ files, setFiles ] = useState([]);

  let classes = useStyles();
  let storage = firebase.storage();
  let storageRef = storage.ref();
  let idSerie = null;

  useEffect(() => {
    firebase
      .firestore()
      .collection("series")
      .get()
      .then(data => {
        let result = data.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          };
        });
        setSeries(result);
      });
  }, []);

  let createPostHandler = e => {
    e.preventDefault();
    let serieName = e.target.series.value;

    if (!serieName) return;
    series.forEach(serie => {
      if (serie.title === serieName) {
        idSerie = serie.id;
      }
    });

    // create random file names
    let fileNames = Object.keys(files).map(() => uuidv4());
    let data = {
      title: e.target.postTitle.value,
      opening: e.target.openingInput.value,
      content: e.target.markInput.value,
      createdAt: new Date().toISOString(),
      photos: fileNames,
      author: firebase.auth().currentUser.email
    };

    firebase
      .firestore()
      .collection("blogs")
      .add(data)
      .then((dataReturn) => {
        for (let i = 0; i < files.length; i++) {
          storageRef.child(`/blogs/${fileNames[i]}`).put(files[i]);
        }

        updateIdBlogToSeries(dataReturn);
        setDialog(true);
      })
      .catch(err => console.log(err));
  };
  let updateIdBlogToSeries = data => {
    firebase
      .firestore()
      .collection("series")
      .doc(idSerie)
      .update({
        blogs: firebase.firestore.FieldValue.arrayUnion(data)
      })
      .then(() => setDialog(true));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create a new post
      </Typography>
      <Divider />

      <Grid container spacing={3}>
        <Grid item xs={5} className={classes.create}>
          <Typography variant="body1">
            Note: for anyone not knowing Markdown: 
            <a href="http://markdownguide.org/cheat-sheet" target="_blank" rel="noopener noreferrer">
              Markdown Cheat Sheet
            </a>
          </Typography>
          <form onSubmit={createPostHandler}>
            <Autocomplete
              options={series}
              freeSolo
              getOptionLabel={option => option.title}
              getOptionSelected={option => option.id}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  name="series"
                  label="Series"
                  variant="outlined"
                  margin="normal"
                />
              )}
            />

            <TextField name="postTitle" label="Title" />
            <TextField name="openingInput" label="Opening" />

            
            <TextareaAutosize
              rows="20"
              rowsMax="25"
              placeholder="Blog content"
              className={classes.contentInput}
              onChange={e => changeMark(e.target.value)}
            />

            <label htmlFor="images" className={classes.fileInputLabel}>
              Choose images...
            </label>
            <input 
              id="images" 
              type="file" 
              name="imageInput" 
              onChange={e => setFiles(e.target.files)}
              multiple 
             />
            
            <Button type="submit">Post</Button>
          </form>
        </Grid>

        <Grid item xs={7}>
          <Typography variant="h5">
            Preview content
          </Typography>
          <div className={classes.previewContainer}>
            <Markdown>
             { markInput }
            </Markdown>
          </div>

          <Typography variant="body2">
            Chosen images: 
            <ul>
              { Object.keys(files).map(index => <li key={files[index].name}>{ files[index].name }</li> ) }
            </ul>
          </Typography>
        </Grid>
      </Grid>
      <Popup
        show={dialog}
        content="Blog mới Đã được tạo"
        updatePopup={setDialog}
        direction="/posts"
      />
    </Container>
  );
}
