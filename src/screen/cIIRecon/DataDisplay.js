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
  return (
    <Box sx={style.container}>
      <Box sx={style.PlanTabs}>
        <Tabs value={1}>
          <Tab label={'test'} value={1} />
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
