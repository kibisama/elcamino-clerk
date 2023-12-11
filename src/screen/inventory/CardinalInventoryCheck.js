import { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Button, CircularProgress, Switch, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncReloadCardinal,
  asyncCheckCardinalInvoice,
} from '../../reduxjs@toolkit/inventorySlice';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addZero } from '../../lib/constant';
import CardinalInvoiceReport from './CardinalInvoiceReport';
import SearchIcon from '@mui/icons-material/Search';

//----------------------------Style----------------------------
const style = {
  container: {
    p: '1rem',
  },
  controller: {
    py: '0.5rem',
    borderBottom: '1px solid',
    borderColor: 'divider',
    mb: '1rem',
    display: 'flex',
  },
  datePicker: {
    width: 180,
    mx: '0.5rem',
  },
  findInvoiceButton: {
    mx: '0.5rem',
    minWidth: 160,
    fontSize: '0.9rem',
  },
};
//-------------------------------------------------------------

const CardinalInventoryCheck = () => {
  const dispatch = useDispatch();
  const now = dayjs();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [datePicked, setDatepicked] = useState(now);
  const date = `${addZero(datePicked.$M + 1)}/${addZero(datePicked.$D)}/${
    datePicked.$y
  }`;
  const { cardinalInvoiceData, isPuppeteering } = useSelector(
    (state) => state.inventory,
  );
  console.log(cardinalInvoiceData);
  return (
    <Box sx={style.container}>
      <Box sx={style.controller}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={style.datePicker}
            value={datePicked}
            onChange={setDatepicked}
            maxDate={now}
            minDate={now.subtract(1, 'y')}
            formatDensity="spacious"
          />
        </LocalizationProvider>
        <Button
          sx={style.findInvoiceButton}
          disableElevation
          onClick={() => {
            dispatch(
              asyncCheckCardinalInvoice({
                date,
                forceUpdate,
              }),
            );
          }}
          variant="contained"
          disabled={
            isPuppeteering || date === cardinalInvoiceData[0].invoiceDate
          }
          startIcon={
            isPuppeteering ? (
              <CircularProgress color="inherit" />
            ) : (
              <SearchIcon />
            )
          }
        >
          {isPuppeteering ? null : <span>FIND INVOICE</span>}
        </Button>
        <Tooltip title="Force Update">
          <Switch
            checked={forceUpdate}
            defaultChecked={false}
            onChange={() => {
              setForceUpdate(!forceUpdate);
            }}
          />
        </Tooltip>
      </Box>
      <CardinalInvoiceReport data={cardinalInvoiceData} />
    </Box>
  );
};

export default CardinalInventoryCheck;
