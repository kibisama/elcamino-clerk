import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

//----------------------------Style----------------------------
const style = {
  container: {
    fontSize: '0.8rem',
  },
  label: {
    fontWeight: '600',
  },
};
//--------------------------------------------------------------

const PriceComparison = (props) => {
  const { data } = props;
  if (!data) {
    return;
  }
  const {
    lastOrderedBySF,
    styleLastOrderedBySF,
    minCardinalUnitCost,
    ppu,
    unit,
    dateLastUpdatedSmartSource,
    styleDateLastUpdatedSmartSource,
    smartSourceAltBACCost,
    smartSourceAltBPDCost,
    smartSourceCost,
    styleSmartSourceCost,
  } = data;

  return (
    <Grid sx={style.container} container>
      <Grid xs={2}>
        <Box sx={style.label}>Cardinal Lowest:</Box>
        <Box sx={style.label}>Smart Source Price:</Box>
        <Box sx={style.label}>Smart Source BAC:</Box>
        <Box sx={style.label}>Smart Source BPD:</Box>
      </Grid>
      <Grid xs={2}>
        <Box>{minCardinalUnitCost ? minCardinalUnitCost : 'N/A'}</Box>
        <Box sx={styleSmartSourceCost}>
          {smartSourceCost ? smartSourceCost : 'N/A'}
        </Box>
        <Box>{smartSourceAltBACCost ? smartSourceAltBACCost : 'N/A'}</Box>
        <Box>{smartSourceAltBPDCost ? smartSourceAltBPDCost : 'N/A'}</Box>
      </Grid>
      <Grid xs={2}>
        <Box sx={style.label}>Cardinal PPU:</Box>
        <Box sx={style.label}>Available:</Box>
      </Grid>
      <Grid xs={2}>
        <Box>{ppu ? `$${ppu} ${unit}` : 'N/A'}</Box>
      </Grid>
      <Grid xs={2}>
        <Box sx={style.label}>Last SFDC Order:</Box>
        <Box sx={style.label}>Last SS Update:</Box>
      </Grid>
      <Grid xs={2}>
        <Box sx={styleLastOrderedBySF}>
          {lastOrderedBySF ?? <Box sx={style.descRed}>N/A</Box>}
        </Box>
      </Grid>
    </Grid>
  );
};

export default PriceComparison;
