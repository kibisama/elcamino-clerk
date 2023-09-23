import { useSelector } from 'react-redux';
import { Box } from '@mui/system';
import UploadCSV from './paperbill/UploadCSV';
import DataDisplay from './paperbill/DataDisplay';

const PaperBill = () => {
  const { isProcessed } = useSelector((state) => state.paperBill.uploadCSV);

  return <Box>{isProcessed ? <DataDisplay /> : <UploadCSV />}</Box>;
};

export default PaperBill;
