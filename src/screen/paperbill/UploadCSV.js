import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';

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
};
//-------------------------------------------------------------

const UploadCSV = () => {
  const {
    isLoading,
    uploadCSV: { isLoaded, data, index, errorMsg },
  } = useSelector((state) => state.paperBill);
  const { configs } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  // 페이지 언마운트 시에 CSV파일 업로드 상태 초기화
  useEffect(() => () => dispatch(unloadCSV()), [dispatch]);

  const onClickRunButton = () => {
    const payload = { data, index, configs };
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
      <Box sx={style.button}>
        <Button
          variant="contained"
          disabled={!isLoaded}
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
