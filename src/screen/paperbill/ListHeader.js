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
    minWidth: 120,
    border: '1px solid',
    p: '0.2rem',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  invoiceDateAndNum: {
    minWidth: 60,
    fontWeight: 'regular',
    pl: '0.5rem',
  },
  facilityName: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  listDate: {
    fontSize: '0.9rem',
  },
};
//-------------------------------------------------------------

const ListHeader = ({ ...props }) => {
  const { date, billingPeriod, invoiceNum, page, planIndex } = props;
  const { storeInfo, plans } = useSelector(
    (state) => state.print.paperBill.settings,
  );
  const billingInfo = plans[planIndex].billingInfo;
  return (
    <Typography component="span">
      <Grid sx={style.container} container>
        <Grid sx={style.storeInfo} xs={4}>
          <Box>{storeInfo.name}</Box>
          <Box>{storeInfo.address}</Box>
          <Box>{storeInfo.city}</Box>
          <Box>{storeInfo.phone}</Box>
        </Grid>
        <Grid
          display="flex"
          flexDirection="column"
          justifyContent="end"
          alignItems="center"
          xs={4}
        >
          <Box sx={style.facilityName}>
            {billingInfo.name} {billingInfo.department}
          </Box>
          <Box sx={style.listDate}>
            {billingPeriod.monthName} {billingPeriod.year} Rx List
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
              <Box sx={style.invoiceDateAndNum}>{invoiceNum}</Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Typography>
  );
};

export default ListHeader;
