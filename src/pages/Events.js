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
    <Grid container justify="center" spacing={3} className={classes.root}>
      <Grid item xs={4} md={3}>
        <Sidebar subheader="Events" items={events} onClickItem={showEvent} onClickBtnAdd={showAddEvent} />
      </Grid>
      <Grid item xs={8} md={9}>
        {
          event ?
            <PreviewEvent event={event}></PreviewEvent>
            : ''
        }
      </Grid>
      <Popup open={openPopup} fullWidth={true} maxWidth="xl" updatePopup={setOpenPopup} content={<CreateEvent />} />
    </Grid>
  );
}


