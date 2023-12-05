import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
import client from '../../lib/api/client';

//----------------------------Style----------------------------
const style = {
  descCell: {},
  descCellLabel: {},
  descCellValue: {},
  accordion: {
    '.MuiAccordion-root': {
      borderRadius: '1rem',
    },
    '.MuiAccordionSummary-root': {
      borderTopLeftRadius: '1rem',
      borderTopRightRadius: '1rem',
    },
  },
  topLine: {
    backgroundColor: 'primary.dark',
    fontWeight: 'bold',
    px: '1.5rem',
    color: 'white',
  },
  topLineLabel: {
    fontWeight: 'bold',
    mr: '0.5rem',
  },
  expandMoreIcon: {
    color: 'white',
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
    <Accordion sx={style.accordion} defaultExpanded>
      <AccordionSummary
        sx={style.topLine}
        expandIcon={<ExpandMoreIcon sx={style.expandMoreIcon} />}
      >
        <Grid container>
          <Grid xs={12} sx={{ display: 'flex' }}>
            <Box sx={style.topLineLabel}>{data.labelName}</Box>
            [NDC : {data.ndc}]
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid xs={3}>
            <img src={imgURL}></img>
          </Grid>
          <Grid xs={3}>
            <DescCell label="Generic Name" value={data.genericName} />
            <DescCell label="Strength" value={data.strength} />
            <DescCell
              label="Size"
              value={`${data.packageQty} X ${data.packageSize} ${data.unit}`}
            />
            <DescCell label="Manufacturer" value={data.mfr} />
          </Grid>
          <Grid xs={3}></Grid>
          <Grid xs={3}></Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default DrugDetails;
