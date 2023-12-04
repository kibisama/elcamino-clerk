import { Box, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import client from '../../lib/api/client';

//----------------------------Style----------------------------
const style = {
  descCell: {},
  descCellLabel: {},
  descCellValue: {},
  container: {
    borderRadius: '1rem',
    overflow: 'hidden',
    minWidth: '1000px',
    minHeight: '400px',
  },
  topLine: {
    backgroundColor: 'primary.dark',
    fontWeight: 'bold',
    px: '1rem',
    py: '0.5rem',
    color: 'white',
    fontSize: '1.1rem',
  },
};
//-------------------------------------------------------------

const DescCell = (props) => {
  const { label, value } = props;
  return (
    <Box sx={style.descCell}>
      <Box sx={style.descCellLabel}>{label}:</Box>
      <Box sx={style.descCellValue}>{value}</Box>
    </Box>
  );
};

const DrugDetails = (props) => {
  const { data } = props;

  if (!data) {
    return;
  }
  const imgURL = `${client.defaults.baseURL}/mongod/drugs/img/${data.cin}`;
  return (
    <Paper
      sx={style.container}
      elevation={3}
      children={
        <>
          <Grid container sx={style.topLine}>
            <Grid xs={11}>
              {data.labelName} [NDC : {data.ndc}]
            </Grid>
            <Grid xs={1}>minimize</Grid>
          </Grid>
          <Grid container>
            <Grid xs={3}>
              <img src={imgURL}></img>
            </Grid>
            <Grid xs={3}>
              <DescCell label="Generic Name" value={data.genericName} />
              <DescCell label="Strength" value={data.strength} />
              <DescCell label="Form" value={data.form} />
              <DescCell
                label="Size"
                value={`${data.packageQty} X ${data.packageSize} ${data.unit}`}
              />
              <DescCell label="Manufacturer" value={data.mfr} />
            </Grid>
            <Grid xs={3}></Grid>
            <Grid xs={3}></Grid>
          </Grid>
        </>
      }
    />
  );
};

export default DrugDetails;
