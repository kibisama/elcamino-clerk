import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

//----------------------------Style----------------------------
const style = {
  container: {
    pt: '1rem',
  },
  totalCountBox: {
    display: 'flex',
    border: '1px solid',
    p: '0.2rem',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  totalCountNum: {
    borderTop: '1px solid',
    borderRight: '1px solid',
    borderBottom: '1px solid',
    fontWeight: 'regular',
    fontSize: '0.8rem',
    p: '0.2rem',
    display: 'flex',
    justifyContent: 'flex-end',
    minWidth: 60,
  },
  subTotalBox: {
    border: '1px solid',
    minWidth: 100,
    fontWeight: 'regular',
    fontSize: '0.8rem',
    p: '0.2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  subTotalNum: {
    borderTop: '1px solid',
    borderRight: '1px solid',
    borderBottom: '1px solid',
    fontWeight: 'regular',
    fontSize: '0.8rem',
    p: '0.2rem',
    display: 'flex',
    justifyContent: 'flex-end',
    minWidth: 100,
  },
  grandTotalBox: {
    borderRight: '1px solid',
    borderLeft: '1px solid',
    borderBottom: '1px solid',
    minWidth: 100,
    fontWeight: 'bold',
    fontSize: '0.8rem',
    p: '0.2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  grandTotalNum: {
    borderRight: '1px solid',
    borderBottom: '1px solid',
    minWidth: 100,
    fontWeight: 'bold',
    fontSize: '0.8rem',
    p: '0.2rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  lastPage: {
    display: 'flex',
    flexDirection: 'column',
  },
  grandTotal: {
    display: 'flex',
  },
};
//-------------------------------------------------------------

const ListFooter = ({ ...props }) => {
  const { dueDate, subTotals, grandTotal, page, totalCount } = props;
  const isLastPage = Boolean(page.max === page.current);
  return (
    <Typography component="span">
      <Grid sx={style.container} container>
        {isLastPage ? (
          <>
            <Grid xs={4} display="flex" alignItems="flex-end">
              <Box component="div" sx={style.totalCountBox}>
                TOTAL PRESCRIPTIONS
              </Box>
              <Box sx={style.totalCountNum}>{totalCount}</Box>
            </Grid>
            <Grid xs={4} />
            <Grid xs={4} display="flex" justifyContent="flex-end">
              <Box style={style.lastPage}>
                <Box sx={{ display: 'flex' }}>
                  <Box component="div" sx={style.subTotalBox}>
                    SUB TOTAL
                  </Box>
                  <Box sx={style.subTotalNum}>
                    {subTotals[page.current - 1]}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box component="div" sx={style.grandTotalBox}>
                    GRAND TOTAL
                  </Box>
                  <Box sx={style.grandTotalNum}>{grandTotal}</Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box component="div" sx={style.grandTotalBox}>
                    TOTAL DUE BY
                  </Box>
                  <Box sx={style.grandTotalNum}>
                    {dueDate.month}/{dueDate.date}/{dueDate.year}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </>
        ) : (
          <>
            <Grid xs={8} />
            <Grid xs={4} display="flex" justifyContent="flex-end">
              <Box component="div" sx={style.subTotalBox}>
                SUB TOTAL
              </Box>
              <Box sx={style.subTotalNum}>{subTotals[page.current - 1]}</Box>
            </Grid>
          </>
        )}
      </Grid>
    </Typography>
  );
};

export default ListFooter;
