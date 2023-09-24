import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { printPaperBillColumns } from '../../lib/constant';
import ListHeader from './ListHeader';
import ListFooter from './ListFooter';
import { sum } from '../../lib/constant';

//----------------------------Style----------------------------
const style = {
  container: {
    width: '1054px',
    flexGrow: 1,
    '@media print': {
      p: 0,
      m: 0,
      overflow: 'hidden',
      height: '100vh',
      '@page': {
        size: 'letter landscape',
      },
    },
    '& .MuiDataGrid-root': {
      border: 'none',
    },
  },
  printMargin: {
    m: '1rem',
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
  const totalCount = copy.length;
  const totalPages = Math.ceil(copy.length / 25);
  const rows = new Array(totalPages);
  // 각 페이지의 subtotal 값 구하기
  const grandTotal = sum(copy, 'PatPAy').toFixed(2);
  const subTotals = [];
  for (let i = 0; i < rows.length; i++) {
    rows[i] = copy.splice(0, 25);
    subTotals[i] = sum(rows[i], 'PatPAy').toFixed(2);
  }

  return (
    <>
      {rows.map((row, i) => (
        <Box key={i} sx={{ ...style.container, ...sx }}>
          <Box sx={style.printMargin}>
            <ListHeader
              date={content.invoiceDate}
              lastRxDate={content.lastRxDate}
              invoiceNum={content.invoiceNumArrays[planId]}
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
            <ListFooter
              totalCount={totalCount}
              dueDate={content.invoiceDueDate}
              grandTotal={grandTotal}
              subTotals={subTotals}
              page={{ max: totalPages, current: i + 1 }}
            />
          </Box>
        </Box>
      ))}
    </>
  );
};

export default ListPrintPreview;
