import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from '@mui/material';

import CSVReader from '../../component/CSVReader';

import {
  loadCSV,
  unloadCSV,
  processCSV,
} from '../../reduxjs@toolkit/paperBillSlice';

//----------------------------Style----------------------------
const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  CSVReader: { width: 400, height: 300, m: 1, p: 1 },
  button: { display: 'flex', justifyContent: 'center', my: 1 },
  errorMsg: {
    display: 'flex',
    justifyContent: 'center',
    my: 0.5,
    color: 'red',
  },
  selectBillingPeriod: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    py: '1rem',
    px: '6rem',
  },
};
//-------------------------------------------------------------

const UploadCSV = () => {
  const {
    isLoading,
    uploadCSV: { billingPeriod, isLoaded, data, index, errorMsg },
  } = useSelector((state) => state.paperBill);
  const { configs } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState('');
  const handleSelect = (value) => {
    setSelectedBillingPeriod(value);
  };

  // 페이지 언마운트 시에 CSV파일 업로드 상태 초기화
  useEffect(() => () => dispatch(unloadCSV()), [dispatch]);
  useEffect(() => {
    if (billingPeriod && billingPeriod.lenght !== 0) {
      setSelectedBillingPeriod(0);
    }
  }, [billingPeriod]);

  const onClickRunButton = () => {
    const payload = {
      billingPeriod: billingPeriod[selectedBillingPeriod],
      data,
      index,
      configs,
    };
    dispatch(processCSV(payload));
  };

  return (
    <Box sx={style.container}>
      <Box sx={style.CSVReader}>
        <CSVReader
          onUploadAccepted={(arg) => {
            dispatch(loadCSV(arg));
          }}
          onClickRemoveButton={() => {
            dispatch(unloadCSV());
          }}
        />
      </Box>
      <Box sx={style.selectBillingPeriod}>
        <FormControl size="small">
          <Select
            disabled={!billingPeriod}
            onChange={(event) => {
              handleSelect(event.target.value);
            }}
            value={selectedBillingPeriod}
          >
            {billingPeriod &&
              billingPeriod.map((value, i) => (
                <MenuItem key={i} value={i}>
                  {value.monthName} {value.year}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormHelperText>Select billing period</FormHelperText>
      </Box>
      <Box sx={style.button}>
        <Button
          variant="contained"
          disabled={!isLoaded || selectedBillingPeriod === ''}
          onClick={onClickRunButton}
        >
          Run
        </Button>
      </Box>
      <Box sx={style.errorMsg}>{errorMsg}</Box>
    </Box>
  );
};

export default UploadCSV;
