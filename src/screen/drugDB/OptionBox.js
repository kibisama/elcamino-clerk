import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { grey } from '@mui/material/colors';

import { hyphenateNDC } from '../../lib/constant';

//----------------------------Style----------------------------
const style = {
  container: {
    width: '100%',
  },
  labelName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
  },
  mfr: {
    fontSize: '0.9rem',
    color: grey[600],
    display: 'flex',
    justifyContent: 'flex-end',
  },
  size: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '0.9rem',
    color: grey[600],
  },
  packageSize: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};
//-------------------------------------------------------------

const OptionBox = (props, option) => {
  return (
    <Box {...props} component="li" key={option._id}>
      <Grid sx={style.container} container>
        <Grid sx={style.labelName} xs={9}>
          {option.labelName}
        </Grid>
        <Grid sx={style.mfr} xs={3}>
          {option.mfr.split(' ')[0]}
        </Grid>
        <Grid xs={10}>{hyphenateNDC(option.ndc)}</Grid>
        <Grid sx={style.size} xs={1}>
          PkgSize:
        </Grid>
        <Grid sx={style.packageSize} xs={1}>
          {option.packageSize}
        </Grid>
      </Grid>
    </Box>
  );
};

export default OptionBox;
