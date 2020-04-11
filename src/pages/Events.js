import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "firebase/firestore";

import {
  Grid
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Popup from "../components/Popup";
import Sidebar from "../components/Sidebar"
import CreateEvent from "../components/Event/CreateEvent"
import PreviewEvent from '../components/Event/PreviewEvent'

let useStyles = makeStyles({
  root: {
    paddingTop: "24px"
  }
});

export default function Events() {
  let classes = useStyles();
  let db = firebase.firestore();
  let [events, setEvents] = useState([]);
  const [event, setEvent] = useState();
  const [openPopup, setOpenPopup] = useState(false)

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
  }, [db]);
  const showEvent = (item) => {
    setEvent(item)
  }
  const showAddEvent = () => {
    setOpenPopup(true)
  }
  return (
    <Grid container className={classes.root}>
      <Sidebar items={events} onClickItem={showEvent} onClickBtnAdd={showAddEvent} />
      {
        event ?
          <PreviewEvent event={event}></PreviewEvent>
          : ''
      }
      <Popup open={openPopup} fullWidth={true} maxWidth="xl" updatePopup={setOpenPopup} content={<CreateEvent />} />
    </Grid>
  );
}


