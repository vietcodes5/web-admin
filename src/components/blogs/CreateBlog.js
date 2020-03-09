import React, { useState, useEffect } from "react";
import { Markdown } from "react-showdown";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import {
  Container,
  Grid,
  TextField,
  TextareaAutosize,
  Button,
  FilledInput
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Popup from "../Popup";

let useStyles = makeStyles({
  create: {
    marginTop: "20px",
    "& form": {
      display: "flex",
      flexDirection: "column",
      "& *": {
        margin: "5px 5px"
      }
    }
  }
});

export default function CreatPost() {
  const [markInput, changeMark] = useState("Review HTML");
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
        console.log("a");

        let result = data.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          };
        });
        setSeries(result);
        console.log(result);
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
    console.log(idSerie);

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
        console.log(dataReturn);
        
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
      <Grid container>
        <Grid container xs direction="column" className={classes.create}>
          <form onSubmit={createPostHandler}>
            <TextField name="postTitle" label="Tile Post" />
            <TextField name="openingInput" label="Opening" />
            <input type="file" name="imageInput" multiple></input>

            <Autocomplete
              id="combo-box-demo"
              options={series}
              getOptionLabel={option => option.title}
              getOptionSelected={option => option.id}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  name="series"
                  label="Series"
                  variant="outlined"
                />
              )}
            />

            <TextareaAutosize
              name="markInput"
              rows="20"
              rowsMax="25"
              placeholder="MarkDown"
              onChange={e => changeMark(e.target.value)}
            />
            <Button type="submit">Post</Button>
          </form>
        </Grid>
        <Grid xs>
          <Markdown markup={markInput} />
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
