import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

function PostDetailModal({ open }) {
  return (
    <Modal
      open={open}
      //   onClose={}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a Modal
        </Typography>
      </Box>
    </Modal>
  );
}

export default PostDetailModal;
