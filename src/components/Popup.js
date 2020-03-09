import React from "react";
import {Link} from 'react-router-dom'


import {
  Button,
  DialogContent,
  Dialog,
  DialogActions,
  DialogContentText
} from "@material-ui/core";

export default function Popup (props) {
  return (
    <Dialog open={props.show}>
      <DialogContent>
        <DialogContentText>{props.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Link to={props.direction}>
          <Button onClick={() => props.updatePopup(false)} color="primary">
              Đóng
          </Button>
        </Link>
        {
          props.btnConfirm &&
          <Button onClick={() => props.btnConfirmAction()}>
            {props.btnConfirm}
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}
