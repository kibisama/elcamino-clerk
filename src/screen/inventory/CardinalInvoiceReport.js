import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import client from '../../lib/api/client';

const CardinalInvoiceReport = (props) => {
  const { data } = props;
  if (!data) {
    return;
  }
  const {
    cost,
    csoNumber,
    invoiceNumber,
    invoiceType,
    item,
    omitCode,
    orderQty,
    shipQty,
  } = data;
  console.log(data);

  return <Box />;
};

export default CardinalInvoiceReport;
