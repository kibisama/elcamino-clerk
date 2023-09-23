import {
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Popper,
  Select,
} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';

//----------------------------Style----------------------------
const style = {
  container: {
    minWidth: 150,
    border: '1px solid gray',
    display: 'flex',
    flexDirection: 'column',
  },
  cancelButton: {
    dispaly: 'flex',
    justifyContent: 'end',
  },
  cancelIcon: {
    color: 'error.main',
  },
  selectButton: { m: 1 },
  formControl: { m: 1 },
};
//-------------------------------------------------------------

const PlanSelectPopper = ({ ...props }) => {
  const {
    anchorEl,
    currentPlan,
    onClickCancelButton,
    onClickTransfer,
    onSelectPlan,
    open,
    plans,
    selectedPlan,
  } = props;

  if (!plans || plans.length === 0) {
    return;
  }
  return (
    <Popper open={open} anchorEl={anchorEl}>
      <Card sx={style.container}>
        <Grid container sx={style.cancelButton}>
          <IconButton onClick={onClickCancelButton}>
            <CancelIcon sx={style.cancelIcon} />
          </IconButton>
        </Grid>
        <FormControl sx={style.formControl} size="small">
          <Select
            value={selectedPlan}
            onChange={(event) => {
              onSelectPlan(event.target.value);
            }}
            displayEmpty
          >
            <MenuItem disabled value="">
              <em>Select Plan</em>
            </MenuItem>
            {plans.map((plan, i) => {
              if (i === currentPlan) {
                return undefined;
              }
              return (
                <MenuItem key={i} value={i}>
                  {plan}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={style.selectButton}
          disabled={selectedPlan === ''}
          onClick={onClickTransfer}
        >
          Transfer
        </Button>
      </Card>
    </Popper>
  );
};

export default PlanSelectPopper;
