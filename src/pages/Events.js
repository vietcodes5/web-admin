import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";

import {
  Grid,
  Button,
  Container
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import Popup from "../components/Popup";
import Sidebar from "../components/Sidebar"

let useStyles = makeStyles({
  root: {
    paddingTop: "24px"
  }
});

export default function Events() {
  let classes = useStyles();
  let db = firebase.firestore();
  let [ events, setEvents ] = useState([]);
  const [event, setEvent] = useState();

  useEffect(() => {
    db.collection("events")
      .get()
      .then(data => {
        let result = data.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc.id
          };
        });
        setEvents(result);
      })
      .catch(err => console.log(err));
  }, [ db ]);
  const showEvent = (item) => {
    setEvent(item)
  }
  return (
    <Grid container className={classes.root}>
      <Sidebar items={events} onClickItem={showEvent}/>
      {
        event ?
        <PreviewEvent event={event}></PreviewEvent>
        : ''
      }
      <Popup/>
    </Grid>
  );
}
function PreviewEvent (props) {
  return (
    <Container>
      <Button startIcon={<EditIcon/>} >Edit</Button>
      <Button startIcon={<DeleteOutlineIcon/>} >Delete</Button>
      <h1>{props.event.title}</h1>
      <p>{props.event.content}</p>
    </Container>
  )
}

