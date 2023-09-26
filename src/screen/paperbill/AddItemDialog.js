import { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import CancelIcon from '@mui/icons-material/Cancel';

//----------------------------Style----------------------------
const style = {
  container: {},
  title: {
    color: 'primary.dark',
    fontWeight: 600,
    pb: 0,
  },
  cancelButton: {
    dispaly: 'flex',
    justifyContent: 'end',
  },
  cancelIcon: {
    color: 'error.main',
  },
  descTextField: {
    mt: 0,
  },
};
//-------------------------------------------------------------

const AddItemDialog = ({ ...props }) => {
  const { open, handleClose, handleOK } = props;
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <Dialog open={open} onClose={handleClose}>
      <Grid container>
        <Grid xs={11}>
          <DialogTitle sx={style.title}>Add an item</DialogTitle>
        </Grid>
        <Grid
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-end"
          xs={1}
        >
          <IconButton onClick={handleClose}>
            <CancelIcon sx={style.cancelIcon} />
          </IconButton>
        </Grid>
      </Grid>
      <DialogContent>
        <TextField
          sx={style.descTextField}
          autoFocus
          margin="dense"
          id="description"
          label="Description"
          fullWidth
          variant="standard"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <TextField
          margin="dense"
          id="amount"
          label="Amount"
          fullWidth
          variant="standard"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            handleOK(description, amount);
            handleClose();
            setDescription('');
            setAmount('');
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;
