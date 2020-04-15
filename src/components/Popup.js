import React from "react";

import {
  Button,
  DialogContent,
  Dialog,
  DialogActions,
} from "@material-ui/core";

export default function Popup(props) {
  // const [open , setOpen ] = useState(false)
  return (
    <Dialog open={props.open}
      onClose={() => { props.updatePopup(false) }}
      fullWidth={props.fullWidth}
      maxWidth={props.maxWidth}>
      <DialogContent>
        {props.content}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => props.updatePopup(false)} color="primary">
          Đóng
        </Button>
        {
          props.btnConfirmContent &&
          <Button variant="contained" color="primary" onClick={() => props.btnConfirmAction()}>
            {props.btnConfirmContent}
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}