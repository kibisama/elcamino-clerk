import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { printPaperBillColumns } from '../../lib/constant';
import ListHeader from './ListHeader';

//----------------------------Style----------------------------
const style = {
  container: {
    width: '1054px',
    height: '816px',
    flexGrow: 1,
    '@media print': {
      '@page': {
        size: 'letter landscape',
      },
    },
    '& .MuiDataGrid-root': {
      border: 'none',
    },
  },
  dataGrid: {
    my: '1rem',
    fontSize: '0.7rem',
    '& .MuiDataGrid-columnHeaders': {
      border: '2px solid',
      borderRadius: '0px',
    },
    '& .printHeader': {
      borderRight: '2px solid',
    },
  },
};
//-------------------------------------------------------------

const ListPrintPreview = ({ ...props }) => {
  const { sx } = props;
  const planId = useParams().planId;

  const content = useSelector((state) => state.print.paperBill);

  if (!content) {
    return;
  }

  // 25 row 마다 새로운 페이지 생성
  const copy = JSON.parse(JSON.stringify(content.rowsArrays[planId])); // 상태원본은 직접 변경이 불가능 하므로 복사한다.
  const totalPages = Math.ceil(copy.length / 25);
  const rows = new Array(totalPages);
  for (let i = 0; i < rows.length; i++) {
    rows[i] = copy.splice(0, 25);
  }

  return rows.map((row, i) => (
    <Box key={i} sx={{ ...style.container, ...sx }}>
      <ListHeader
        date={content.invoiceDate}
        page={{ max: totalPages, current: i + 1 }}
        planIndex={planId}
      />
      <DataGrid
        sx={style.dataGrid}
        rows={rows[i]}
        columns={printPaperBillColumns}
        columnHeaderHeight={45}
        rowHeight={30}
        density="compact"
        disableColumnMenu={true}
        hideFooter={true}
      />
    </Box>
  ));
};

export default ListPrintPreview;
