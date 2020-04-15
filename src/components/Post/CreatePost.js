import React, { useState } from "react";
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
  Paper,
} from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";

import Popup from "../Popup";
import Markdown from "../Markdown";
import Alert from '../Alert';

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
    fontFamily: 'Roboto',
    fontSize: '14px',
  }
});

export default function CreatPost(props) {
  const [content, updateContent] = useState("");
  const [title, updateTitle] = useState("");
  const [opening, updateOpening] = useState("");
  const [dialog, setDialog] = useState(false);
  const [files, setFiles] = useState();

  const [alertComponent, setAlertComponent] = useState(null);

  const setAlert = (status, content, time = 3) => {
    setAlertComponent(<Alert status={status} content={content} />)
    setTimeout(() => setAlertComponent(null), time * 1000);
  }
  let classes = useStyles();
  let storage = firebase.storage();
  let storageRef = storage.ref();
  let seriesId = null
  let handleFormSubmit = e => {
    e.preventDefault();
    if (!title) {
      setAlert('warning', 'Bạn chưa nhập title');
      return;
    }
    else if (!opening) {
      setAlert('warning', 'Bạn chưa nhập opening')
      return;
    } else if (!content) {
      setAlert('warning', 'Bạn chưa nhập nội dung');
      return;
    } else if (!files) {
      setAlert('warning', 'Bạn chưa tải ảnh nào cho Post này');
      return;
    }

    props.series.forEach(s => {
      if (s.title === e.target.series.value) {
        seriesId = s.id;
      }
    });

    let seriesRef = firebase.firestore().collection('series').doc(seriesId)
    // create random file names
    let fileNames = Object.keys(files).map(() => uuidv4());
    let data = {
      title,
      opening,
      content,
      createdAt: new Date().toISOString(),
      photos: fileNames,
      author: firebase.auth().currentUser.email,
      series: seriesRef,
    };

    firebase
      .firestore()
      .collection("posts")
      .add(data)
      .then((dataReturn) => {
        for (let i = 0; i < files.length; i++) {
          storageRef.child(`/blog/${fileNames[i]}`).put(files[i]);
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
      .doc(seriesId)
      .update({
        posts: firebase.firestore.FieldValue.arrayUnion(data)
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
          <Paper>
            <Typography variant="body1">
              Note: for anyone not knowing Markdown:
              <a
                href="http://markdownguide.org/cheat-sheet"
                target="_blank" rel="noopener noreferrer">
                Markdown Cheat Sheet
              </a>
            </Typography>
            <form onSubmit={handleFormSubmit}>
              <Autocomplete
                options={props.series}
                freeSolo
                getOptionLabel={option => option.title}
                getOptionSelected={option => option.id}
                value={props.currentSeries}

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
              <TextField
                label="Title"
                value={title}
                onChange={(e) => {
                  e.persist();
                  updateTitle(() => e.target.value);
                }}
              />
              <TextField
                label="Opening"
                value={opening}
                onChange={(e) => {
                  e.persist();
                  updateOpening(() => e.target.value);
                }}
              />

              <TextareaAutosize
                rows="20"
                rowsMax="25"
                placeholder="Blog content"
                className={classes.contentInput}
                onChange={(e) => {
                  e.persist();
                  updateContent(() => e.target.value);
                }}
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

              <Button variant="contained" color="primary" type="submit">Post</Button>
            </form>

          </Paper>
        </Grid>

        <Grid item xs={7}>
          <Typography variant="h5">
            Preview content
          </Typography>
          <Paper className={classes.previewContainer}>
            <Markdown>
              {content}
            </Markdown>
          </Paper>

          {/* <Typography variant="body2">
            Chosen images: 
            <ul>
              { Object.keys(files).map(index => <li key={files[index].name}>{ files[index].name }</li> ) }
            </ul>
          </Typography> */}
        </Grid>
      </Grid>
      <Popup
        open={dialog}
        content="Blog mới Đã được tạo"
        updatePopup={setDialog}
        direction="/posts"
      />
      {alertComponent}
    </Container>
  );
}
