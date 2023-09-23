import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

//----------------------------Style----------------------------
const style = {
  container: {},
};
//-------------------------------------------------------------

const InvoicePrintPreview = ({ ...props }) => {
  const { sx } = props;
  const planId = useParams().planId;

  //   if (!content) {
  //     return;
  //   }
  return <></>;
};

export default InvoicePrintPreview;
