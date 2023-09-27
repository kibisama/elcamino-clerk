import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tabs, Tab } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import CustomTabPanel from '../../component/CustomTabPanel';
import PaperBillToolbar from './PaperBillToolbar';
import CustomNoRowsOverlay from '../../component/CustomNoRowsOverlay';

import { paperBillColumns } from '../../lib/constant';
import {
  setCurrentPlan,
  updateRowsArrays,
} from '../../reduxjs@toolkit/paperBillSlice';

//----------------------------Style----------------------------
import { blue, grey, green, orange } from '@mui/material/colors';
const style = {
  container: {},
  PlanTabs: { borderBottom: 1, borderColor: 'divider' },
  DataGrid: {
    minWidth: '86rem',
    '& .rowPlanPatientsWithIns': {
      bgcolor: green[200],
    },
    '& .rowFacilityStaff': {
      bgcolor: orange[200],
    },
    '& .rowLabelOnly': {
      bgcolor: grey[400],
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
    dataDisplay: { currentPlan, planPatientsWithIns, rowsArrays },
  } = useSelector((state) => state.paperBill);
  const dispatch = useDispatch();

  // rowsArrays가 없거나 데이터가 없을 경우 undefined 반환
  if (!rowsArrays || rowsArrays.length === 0) {
    return;
  }

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
      case planPatientsWithIns.findIndex(
        (patient) => patient.patientID === params.row.PatientID,
      ) && plans.includes(params.row.PlanName):
        return 'rowPlanPatientsWithIns';
      default:
        return '';
    }
  };

  // 데이터 수정시 콜백함수 호출
  const processRowUpdate = (updatedRow, originalRow) => {
    const payload = {
      actionType: 'rowUpdate',
      currentPlan,
      rowsArrays,
      updatedRow,
    };
    dispatch(updateRowsArrays(payload));
    return updatedRow;
  };

  return (
    <Box sx={style.container}>
      <Box sx={style.PlanTabs}>
        <Tabs value={currentPlan} onChange={handleTabChange}>
          {plans.map((plan, i) => (
            <Tab label={plan} value={i} key={i} />
          ))}
        </Tabs>
      </Box>
      {plans.map((plan, i) => {
        let rowHeight = 30;
        let density = 'compact';
        if (rowsArrays[i].length === 0) {
          rowHeight = 100;
          density = 'comfortable';
        }
        return (
          <CustomTabPanel value={currentPlan} index={i} key={i}>
            <Box sx={style.DataGrid}>
              <DataGrid
                autoHeight
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
                slots={{
                  toolbar: PaperBillToolbar,
                  noRowsOverlay: CustomNoRowsOverlay,
                }}
                slotProps={{ toolbar: { selectedRows: null } }}
                columnHeaderHeight={45}
                rowHeight={rowHeight}
                density={density}
                disableColumnMenu={true}
                loading={isLoading}
                processRowUpdate={processRowUpdate}
                getCellClassName={getCellClassName}
                getRowClassName={getRowClassName}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>
          </CustomTabPanel>
        );
      })}
    </Box>
  );
};

export default DataDisplay;
