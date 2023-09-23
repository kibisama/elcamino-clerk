import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

//----------------------------Style----------------------------
const style = {};
//-------------------------------------------------------------

const ListFooter = ({ ...props }) => {
  const { date, page } = props;
  const { storeInfo } = useSelector((state) => state.paperBill.settings);
  return <Typography></Typography>;
};

export default ListFooter;
