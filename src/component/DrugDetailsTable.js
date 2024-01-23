import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import client from '../lib/api/client';
import { grey } from '@mui/material/colors';

//----------------------------Style----------------------------
const style = {
  descCell: {
    mb: '0.125rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  descCellLabel: {
    fontSize: '0.8rem',
    color: grey[700],
  },
  descCellValue: {
    fontSize: '0.9rem',
    width: 240,
    textOverflow: 'ellipsis',
  },
  miniContainer: {
    py: '4px',
  },
  miniColOne: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  miniColTwo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    height: 210,
  },
  imageBox: {
    border: '1px solid grey',
    width: 160,
    height: 160,
  },
  miniColOneDesc: {
    display: 'flex',
    flexDirection: 'column',
    height: 50,
    width: 160,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
};
//-------------------------------------------------------------

const DescCell = (props) => {
  const { label, value } = props;
  return (
    <Box sx={style.descCell}>
      <Typography sx={style.descCellLabel}>{label}:</Typography>
      <Typography noWrap sx={style.descCellValue}>
        {value}
      </Typography>
    </Box>
  );
};

const DrugDetailsTable = (props) => {
  const { data, mini } = props;
  if (!data) {
    return;
  }
  console.log(data);
  const imgURL = `${client.defaults.baseURL}/mongod/drugs/img/${data.cin}`;
  if (mini) {
    return (
      <Grid sx={style.miniContainer} container>
        <Grid xs={5} sx={style.miniColOne}>
          <Box sx={style.imageBox}>
            <img src={imgURL} width={160} height={160}></img>
          </Box>
          <Box sx={style.miniColOneDesc}>
            <Typography sx={{ fontSize: '0.9rem' }}>{data.ndc}</Typography>
            <Typography sx={{ fontSize: '0.9rem' }}>{data.mfr}</Typography>
          </Box>
        </Grid>
        <Grid xs={7} sx={style.miniColTwo}>
          <DescCell label="Generic Name" value={data.genericName} />
          <DescCell label="Strength" value={data.strength} />
          <DescCell label="Form" value={data.form} />
          <DescCell
            label="Size"
            value={`${data.packageQty} X ${data.packageSize} ${data.unit}`}
          />
          <DescCell label="Storage" value={data.returnPackaging} />
        </Grid>
      </Grid>
    );
  }
};

export default DrugDetailsTable;
