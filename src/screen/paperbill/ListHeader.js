import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

//----------------------------Style----------------------------
const style = {
  container: {
    pb: '0.5rem',
  },
  storeInfo: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  pageNumber: {
    fontSize: '0.6rem',
    fontWeight: 'regular',
  },
  invoiceDateBox: {
    display: 'flex',
    border: '1px solid',
    p: '0.2rem',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  invoiceDateAndNum: {
    fontWeight: 'regular',
    pl: '0.5rem',
  },
};
//-------------------------------------------------------------

const ListHeader = ({ ...props }) => {
  const { date, page, planIndex } = props;
  const { storeInfo, plans } = useSelector((state) => state.paperBill.settings);
  const billingInfo = plans[planIndex].billingInfo;
  console.log(billingInfo);
  return (
    <Typography>
      <Grid sx={style.container} container>
        <Grid sx={style.storeInfo} xs={4}>
          <Box>{storeInfo.name}</Box>
          <Box>{storeInfo.address}</Box>
          <Box>{storeInfo.city}</Box>
          <Box>{storeInfo.phone}</Box>
        </Grid>
        <Grid display="flex" justifyContent="center" alignItems="end" xs={4}>
          <Box>
            {billingInfo.name} {billingInfo.department}
          </Box>
        </Grid>
        <Grid
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          xs={4}
        >
          <Box sx={style.pageNumber}>
            PAGE {page.current} OF {page.max}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Box component="div" sx={style.invoiceDateBox}>
              INVOICE DATE
              <Box sx={style.invoiceDateAndNum}>
                {date.month}/{date.date}/{date.year}
              </Box>
            </Box>
            <Box
              component="div"
              sx={{ ...style.invoiceDateBox, borderLeft: 'none' }}
            >
              INVOICE
              <Box sx={style.invoiceDateAndNum}>CRI999999</Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Typography>
  );
};

export default ListHeader;
