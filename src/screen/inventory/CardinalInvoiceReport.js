import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardinalInvoiceReportTable from './CardinalInvoiceReportTable';
import { useCallback } from 'react';

//----------------------------Style----------------------------
const style = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  accordion: {
    '.MuiButtonBase-root': {
      mt: '0.5rem',
    },
    // '.MuiAccordion-root': {},
    '.MuiAccordionSummary-root': {
      borderTopLeftRadius: '25px',
      borderTopRightRadius: '25px',
    },
    '.MuiAccordionDetails-root': {
      borderBottomLeftRadius: '25px',
      borderBottomRightRadius: '25px',
      borderLeft: '1px solid grey',
      borderRight: '1px solid grey',
      borderBottom: '1px solid grey',
    },
    '&:before': {
      display: 'none',
    },
  },
  accordionSum: {
    backgroundColor: 'primary.dark',
    fontWeight: 'bold',
    color: 'white',
    wordSpacing: '0.125rem',
    letterSpacing: '0.025rem',
  },
  expandMoreIcon: {
    color: 'white',
  },
};
//-------------------------------------------------------------

const CardinalInvoiceReport = (props) => {
  const { data } = props;
  const renameInvoiceType = useCallback((invoiceType) => {
    switch (invoiceType) {
      case 'Rx':
        return 'Rx';
      case 'CONTROL':
        return 'CIII - CV';
      case 'C2':
        return 'CII';
      case 'OTC':
        return 'OTC & OTHER';
      default:
    }
  }, []);
  if (!data) {
    return;
  }
  return (
    <Box sx={style.container}>
      {data.map((v, i, a) => (
        <Accordion
          key={v._id}
          sx={
            i === a.length - 1
              ? {
                  ...style.accordion,
                  mb: '12rem',
                  '.MuiAccordionDetails-root': {
                    ...style.accordion['.MuiAccordionDetails-root'],
                    mb: '12rem',
                  },
                }
              : style.accordion
          }
          elevation={0}
          square
          disableGutters
          defaultExpanded
        >
          <AccordionSummary
            sx={
              v.invoiceType === 'C2'
                ? { ...style.accordionSum, backgroundColor: 'secondary.dark' }
                : style.accordionSum
            }
            expandIcon={<ExpandMoreIcon sx={style.expandMoreIcon} />}
          >
            <Grid sx={{ width: '100%', pl: '0.5rem' }} container>
              <Grid xs={3}>INVOICE#: {v.invoiceNumber}</Grid>
              <Grid xs={3}>SHIP DATE: {v.invoiceDate}</Grid>
              <Grid xs={3}>{renameInvoiceType(v.invoiceType)}</Grid>
              <Grid xs={3}>
                {v.csoNumber ? 'CSO#: ' : null}
                {v.csoNumber}
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <CardinalInvoiceReportTable key={i} data={v} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CardinalInvoiceReport;
