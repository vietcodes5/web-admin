import React from "react";


import {
  Button,
  DialogContent,
  Dialog,
  DialogActions,
} from "@material-ui/core";

export default function Popup (props) {
  // const [open , setOpen ] = useState(false)
  return (
    <Dialog open={props.open}
        fullWidth={props.fullWidth}
        maxWidth={props.maxWidth}>
      <DialogContent>
        {props.content}
      </DialogContent>
      <DialogActions>
          <Button onClick={() => props.updatePopup(false)} color="primary">
              Đóng
          </Button>
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