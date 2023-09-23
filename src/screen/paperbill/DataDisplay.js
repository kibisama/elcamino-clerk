import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tabs, Tab } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import CustomTabPanel from '../../component/CustomTabPanel';
import PaperBillToolbar from './PaperBillToolbar';

import { paperBillColumns } from '../../lib/constant';
import { setCurrentPlan } from '../../reduxjs@toolkit/paperBillSlice';

//----------------------------Style----------------------------
const style = {
  container: {
    width: '100%',
  },
  PlanTabs: { borderBottom: 1, borderColor: 'divider' },
  DataGrid: {
    '& .rowLabelOnly': {
      bgcolor: 'text.disabled',
    },
    '& .rowFacilityStaff': {
      bgcolor: 'warning.light',
    },
    '& .cellPriceError': {
      color: 'error.main',
    },
  },
};
//-------------------------------------------------------------

const DataDisplay = () => {
  const {
    isLoading,
    settings,
    uploadCSV: { plans },
    dataDisplay: { currentPlan, rowsArrays },
  } = useSelector((state) => state.paperBill);
  const dispatch = useDispatch();

  // 현재 탭을 변경하면 redux상태를 변경하는 함수 정의
  const handleTabChange = (event, planIndex) => {
    dispatch(setCurrentPlan(planIndex));
  };

  ///////////////////////////////////////////////////////////
  // 조건에 따라 DataGrid Cell/Row 에 style을 적용하는 함수 정의
  const getCellClassName = (params) => {
    // constants
    const batchIndex = settings.price.batch.findIndex(
      (drug) => drug.drugNDC === params.row.DrugNDC,
    );
    const batchQty = settings.price.batch[batchIndex]?.qty;
    const batchQtyIndex = batchQty?.findIndex(
      (qty) => qty === params.row.RxQty,
    );
    const batchPrice = settings.price.batch[batchIndex]?.price[batchQtyIndex];
    const perPillIndex = settings.price.perPill.findIndex(
      (drug) => drug.drugNDC === params.row.DrugNDC,
    );
    const perPillPrice = Number(settings.price.perPill[perPillIndex]?.price);
    const rxQty = Number(params.row.RxQty);
    const minCharge = Number(settings.price.minCharge);
    const perPillPriceTotal = (
      perPillPrice * rxQty > minCharge ? perPillPrice * rxQty : minCharge
    ).toFixed();
    switch (params.field) {
      // 가격 비교후 에러 표시
      case 'PatPAy':
        if (params.row.RxStatusFin !== 'BILLED') {
          if (batchQtyIndex > -1 && batchPrice !== params.formattedValue) {
            return 'cellPriceError';
          }
          if (
            perPillIndex > -1 &&
            perPillPriceTotal !== params.formattedValue
          ) {
            return 'cellPriceError';
          }
        }
        break;
      default:
        return '';
    }
  };
  // 조건에 따라 DataGrid Row 에 style을 적용하는 함수 정의
  const getRowClassName = (params) => {
    // constants
    const staffID = new Set();
    settings.plans.forEach((plan) => {
      plan.staffID.forEach((id) => {
        if (id !== '') {
          staffID.add(id);
        }
      });
    });
    switch (true) {
      // RxNotes에 Label 단어를 포함 할 경우
      case params.row.RxStatus === 'DISCONTINUED' &&
        !!params.row.RxNotes.match(/label/gi):
        return 'rowLabelOnly';
      // facility staff 표시
      case staffID.has(params.row.PatientID):
        return 'rowFacilityStaff';
      default:
        return '';
    }
    // TODO: 해당 환자가 다른 보험으로 청구된 기록이 있는지 확인하여 표시.
  };
  ///////////////////////////////////////////////////////////

  // experimental

  if (!rowsArrays || rowsArrays.length === 0) {
    return;
  }
  return (
    <Box sx={style.container}>
      <Box sx={style.PlanTabs}>
        <Tabs value={currentPlan} onChange={handleTabChange}>
          {plans.map((plan, i) => (
            <Tab label={plan} value={i} key={i} />
          ))}
        </Tabs>
      </Box>
      {plans.map((plan, i) => (
        <CustomTabPanel value={currentPlan} index={i} key={i}>
          <Box sx={style.DataGrid}>
            <DataGrid
              rows={rowsArrays[i]}
              columns={paperBillColumns}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    DrugNDC: false,
                    PatientPhone: false,
                    PatientID: false,
                  },
                },
              }}
              slots={{ toolbar: PaperBillToolbar }}
              slotProps={{ toolbar: { selectedRows: null } }}
              columnHeaderHeight={45}
              rowHeight={30}
              density="compact"
              disableColumnMenu={true}
              loading={isLoading}
              getCellClassName={getCellClassName}
              getRowClassName={getRowClassName}
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default DataDisplay;
