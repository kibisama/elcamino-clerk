import { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Button } from '@mui/material';
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

const TestPage = () => {
  const dispatch = useDispatch();
  const now = dayjs();
  const [forceUpdate, setForceUpdate] = useState(false);
  const [datePicked, setDatepicked] = useState(now);
  const { cardinalInvoiceData } = useSelector((state) => state.inventory);

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={datePicked}
          onChange={setDatepicked}
          maxDate={now}
          minDate={now.subtract(1, 'y')}
        />
      </LocalizationProvider>
      <Button
        onClick={() => {
          dispatch(
            asyncCheckCardinalInvoice({
              date: `${addZero(datePicked.$M + 1)}/${addZero(datePicked.$D)}/${
                datePicked.$y
              }`,
              forceUpdate: false,
            }),
          );
        }}
      >
        Check Invoice
      </Button>
      <Button
        onClick={() => {
          dispatch(asyncReloadCardinal());
        }}
      >
        TEST BUTTON
      </Button>
      <CardinalInvoiceReport data={cardinalInvoiceData} />
    </Box>
  );
};

export default TestPage;
