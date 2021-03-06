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
  Link
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
    padding: '5px 10px',
    border: '1px solid #999',
    borderRadius: '5px',
    minHeight: '70vh',
  },
  contentInput: {
    padding: '5px 10px',
    fontFamily: 'Roboto',
    fontSize: '14px',
  }, 
});

export default function CreatPost(props) {
  const [content, updateContent] = useState("");
  const [title, updateTitle] = useState("");
  const [opening, updateOpening] = useState("");
  const [dialog, setDialog] = useState(false);
  const [files, setFiles] = useState([]);

  let classes = useStyles();
  let db = firebase.firestore()
  let storage = firebase.storage();
  let storageRef = storage.ref();
  let seriesId = null
  useEffect(() => {
    updateTitle(props.post.title)
    updateContent(props.post.content)
    updateOpening(props.post.opening)
  }, [props.post])

  let UpdatePostHandler = async e => {
    e.preventDefault();

    props.series.forEach(s => {
      if (s.title === e.target.series.value) {
        seriesId = s.id
      }
    })
    let currentSeriesRef = db.collection('series').doc(seriesId)
    // create random file names
    let fileNames = []
    if (files.length > 0) {
      props.post.photos.forEach((photoName) => {
        let photoRef = storageRef.child(`blog/${photoName}`);
        photoRef.delete().then().catch()
      })
      fileNames = Object.keys(files).map(() => uuidv4());
    } else {
      fileNames = props.post.photos;
    }
    console.log(fileNames);
    let data = {
      title,
      opening,
      content,
      series: currentSeriesRef,
      photos: fileNames
    };

    firebase
      .firestore()
      .collection("posts")
      .doc(props.post.id)
      .update(data).then(
        () => {
          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              storageRef.child(`/blog/${fileNames[i]}`).put(files[i]);
            }
          }
          updateIdBlogToSeries(currentSeriesRef);
          setDialog(true)
        }
      ).catch((err) => console.log(err))
  };
  let updateIdBlogToSeries = async (currentSeriesRef) => {
    let preSeriesId = props.currentSeries.id
    if (preSeriesId === seriesId) {
      return;
    } else {
      try {
        let currentPostRef = db.collection('posts').doc(props.post.id)
        await currentSeriesRef.update({
          posts: firebase.firestore.FieldValue.arrayUnion(currentPostRef)
        })
        let preSeriesRef = db
          .collection("series")
          .doc(preSeriesId)
        let dataPreSeries = await preSeriesRef.get()
        let newPostRefs = dataPreSeries.data().posts.filter((post) => post.id !== props.post.id)
        preSeriesRef.update({
          posts: newPostRefs
        })
      }
      catch (err) {
        console.log(err);
      }
    }
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
            <Link
              href="http://markdownguide.org/cheat-sheet"
              target="_blank" rel="noopener noreferrer"
            >
              Markdown Cheat Sheet
            </Link>
          </Typography>
          <form id="formEdit" onSubmit={UpdatePostHandler}>
            <Autocomplete
              options={props.series}
              freeSolo
              getOptionLabel={option => option.title}
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
              name="title"
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
              value={content}
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

            <Button variant="contained" color="primary" type="submit">Update</Button>
          </form>
        </Grid>

        <Grid item xs={7}>
          <Typography variant="h5">
            Preview content
          </Typography>
          <div className={classes.previewContainer}>
            <Markdown>
              {content}
            </Markdown>
          </div>

          {/* <Typography variant="body2">
            Chosen images:
            <ul>
              {Object.keys(files).map(index => <li key={files[index].name}>{files[index].name}</li>)}
            </ul>
          </Typography> */}
        </Grid>
      </Grid>
      <Popup
        open={dialog}
        content="Blog đã được sửa"
        updatePopup={setDialog}
      />
    </Container>
  );
}
