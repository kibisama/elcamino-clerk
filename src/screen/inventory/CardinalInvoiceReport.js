import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import CardinalInvoiceReportTable from './CardinalInvoiceReportTable';

const CardinalInvoiceReport = (props) => {
  const { data } = props;
  if (!data) {
    return;
  }

  return (
    <Box>
      {data.map((v, i) => (
        <CardinalInvoiceReportTable key={i} data={v} />
      ))}
    </Box>
  );
};

export default CardinalInvoiceReport;
