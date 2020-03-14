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
import Popup from "../Popup";

import Markdown from "../Markdown";

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
    border: '1px solid #999',
    borderRadius: '5px',
    minHeight: '70vh',
  }
});

export default function CreatPost() {
  const [markInput, changeMark] = useState("");
  const [dialog, setDialog] = useState(false);
  const [series, setSeries] = useState([]);

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
    let files = e.target.imageInput.files;
    let serieName = e.target.series.value;
    if (!serieName) return;
    series.forEach(serie => {
      if (serie.title === serieName) {
        idSerie = serie.id;
      }
    });

    let fileNames = [];
    for (const file of files) {
      fileNames.push(uuidv4());
    }
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
    <Container my={3}>
      <Typography variant="h4" gutterBottom>
        Create a new post
      </Typography>
      <Divider />

      <Grid container spacing={3}>
        <Grid item xs={5} className={classes.create}>
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

            <label htmlFor="images" className={classes.fileInputLabel}>
              Choose images...
            </label>
            <input id="images" type="file" name="imageInput" multiple />

                        <TextareaAutosize
              rows="20"
              rowsMax="25"
              placeholder="Blog content"
              onChange={e => changeMark(e.target.value)}
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
