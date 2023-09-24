import { createSlice } from '@reduxjs/toolkit';
import Fuse from 'fuse.js';

import { addZero, createDateInfo, requiredFields } from '../lib/constant';
import { paperBillColumns } from '../lib/constant';
import preset from './../lib/preset.json';

const paperBillSlice = createSlice({
  name: 'paperBill',
  initialState: {
    isLoading: false,
    error: null,
    settings: preset,
    uploadCSV: {
      isLoaded: false,
      isProcessed: false,
      data: null,
      index: null,
      plans: null,
      result: {
        categorizedArrays: null,
        candidate: null,
        pool: null,
        fileOnly: null,
        billedCompletely: null,
      },
      errorMsg: null,
    },
    dataDisplay: {
      invoiceDate: null,
      invoiceDueDate: null,
      lastRxDate: null,
      invoiceNumArrays: null,
      currentPlan: 0,
      rowsArrays: null,
      savedState: {
        count: 0,
        initialState: null,
      },
    },
  },
  reducers: {
    loadCSV: (state, action) => {
      // CSVReader 컴포넌트에 파일이 첨부 되었을 시 실행 됩니다.
      // PapaParse 처리 이후 데이터 배열 끝에 추가된 공백 데이터를 trim합니다.
      if (action.payload[0].includes('')) {
        action.payload.forEach((row, i) => {
          row.splice(action.payload[0].indexOf(''), 1);
        });
      }
      // csv 파일 헤더에 requiredFields 항목이 모두 포함 되는지 검사하고 index 정보를 배열로 저장합니다.
      const _index = requiredFields.map((field) =>
        action.payload[0].indexOf(field),
      );
      if (_index.includes(-1)) {
        state.uploadCSV.errorMsg = 'CSV file must include all required fields.';
        return;
      }
      state.uploadCSV.index = _index;

      // csv 파일 헤더를 제외한 배열 데이터를 보관합니다.
      action.payload.shift();
      state.uploadCSV.data = action.payload;

      state.uploadCSV.isLoaded = true;
    },
    unloadCSV: (state, action) => {
      // csv 파일 업로드 상태와 에러메시지를 초기화 합니다.
      state.uploadCSV.isLoaded = false;
      state.uploadCSV.errorMsg = null;
    },
    processCSV: (state, action) => {
      state.isLoading = true;

      // UploadCSV 컴포넌트에서 Run 버튼 클릭시 실행됩니다.
      // 이전 상태변경에 직접 접근이 불가능 하므로 payload로는 configs와 함께 data와 index가 다시 전달 됩니다.
      // configs가 없다면 preset을 이용합니다.
      const { data, index, configs } = action.payload;
      const settings = configs ?? preset;
      state.settings = settings;

      //   index[i]
      //   0: RxNumber 1: RxDate 2: PatientName 3: DoctorName 4: DrugName 5: RxQty 6: PatPAy 7: PlanName 8: DrugNDC
      //   9: PatientStreet 10: patientPhone 11: RxStatus 12: RxStatusFin 13: PatientID 14: RxNotes 15: PatNotes

      // 가장먼저 pool 배열을 선언하고 데이터 배열을 복사합니다.
      // 데이터를 일관성 있게 하기 위하여 DoctorName은 모두 대문자로 변환하고 일부 시간정보가 포함된 RxDate에서 시간을 제외합니다.
      // 또한 추적을 위해 고유 number i + 1을 배열의 끝에 추가합니다.
      const pool = [];
      for (let i = 0; i < data.length; i++) {
        pool[i] = JSON.parse(JSON.stringify(data[i]));
        if (String(pool[i][index[1]]).includes(' ')) {
          pool[i][index[1]] = String(pool[i][index[1]]).substring(
            0,
            String(pool[i][index[1]]).indexOf(' '),
          );
        }
        pool[i][index[3]] = String(pool[i][index[3]]).toUpperCase();
        pool[i][pool[i].length] = i + 1;
      }

      // 현재 날짜등을 기록한 객체를 만들어 상태에 저장합니다.
      const now = Date.now();
      const today = new Date(now);
      const dueDate = new Date(now + 2629800000);
      const invoiceDate = createDateInfo(today);
      const invoiceDueDate = createDateInfo(dueDate);
      const rxDates = new Set();
      pool.forEach((rx) => {
        rxDates.add(new Date(rx[index[1]]).valueOf());
      });
      const lastRxDate = createDateInfo(new Date(Math.max(...rxDates)));
      state.dataDisplay.invoiceDate = invoiceDate;
      state.dataDisplay.invoiceDueDate = invoiceDueDate;
      state.dataDisplay.lastRxDate = lastRxDate;

      // 각 invoice 넘버를 생성해 배열로 저장합니다.
      const invoiceNumArrays = [];
      settings.plans.forEach((plan) => {
        invoiceNumArrays.push(
          plan.billingInfo.invoiceCode +
            addZero(lastRxDate.month) +
            addZero(lastRxDate.date) +
            Number(lastRxDate.year).toString(),
        );
      });
      state.dataDisplay.invoiceNumArrays = invoiceNumArrays;

      // filterAndPull 함수를 정의합니다. pool내 Rx들 중 비교값과 같은 Rx를 찾아 pool에서 제거하고 다른 배열 뒤에 추가합니다.
      // 인수로 순서대로 비교값(비교함수), 인덱스, 결과(배열)을 담을 배열을 전달 합니다. 결과를 담은 배열을 반환합니다.
      const filterAndPull = (arg, i, array = []) => {
        let filtered;
        if (typeof arg === 'function') {
          filtered = pool.filter(arg);
        } else {
          filtered = pool.filter((rx) => rx[index[i]] === arg);
        }
        array = [...array, ...filtered];
        filtered.forEach((rx) => {
          pool.splice(
            pool.findIndex((_rx) => _rx[_rx.length - 1] === rx[rx.length - 1]),
            1,
          );
        });
        return array;
      };
      // 먼저 pool에서 FileOnly Rx들을 제외하고 fileOnly 배열에 보관합니다.
      const fileOnlyTypes = ['FILEONLY', 'DC-FILEONLY', 'FO-TRANSFERRED'];
      const fileOnly = filterAndPull((rx) =>
        fileOnlyTypes.includes(rx[index[11]]),
      );
      state.uploadCSV.result.fileOnly = fileOnly;
      // Pool 내 보험처리가 완료되고 환자부담금이 0인 (RxStatusFin가 BILLED 이면서 PatPAy가 0)인 Rx들을 제외하고 다른 배열에 보관합니다.
      const billedCompletely = filterAndPull(
        (rx) => rx[index[12]] === 'BILLED' && rx[index[6]] === '0',
      );
      state.uploadCSV.result.billedCompletely = billedCompletely;
      // settings 정보를 참고하여 plan 이름들을 담은 배열을 생성합니다.
      const plans = [];
      settings.plans.forEach((plan) => {
        plans.push(plan.planName);
      });
      // settings.plans.planName에 따른 분류를 하고 pool에서 제외하고 categorizedArrays 배열에 plan 별로 보관합니다.
      const categorizedArrays = [];
      plans.forEach((plan, i) => {
        categorizedArrays[i] = filterAndPull(plan, 7);
      });

      // pool 에서 candidate에 추가할 rx들을 여러 알고리즘을 통해 추려냅니다. 알고리즘에 필요한 정보들을 Set로 작성합니다.
      const planDoctors = new Set();
      const planAddress = new Set();
      const fusePlanAddress = new Set();
      const planPhones = new Set();
      const planPatients = new Set();
      settings.plans.forEach((plan) => {
        plan.doctor.forEach((doctor) => {
          if (doctor !== '') {
            planDoctors.add(doctor.toUpperCase());
          }
        });
        plan.patientAddress.forEach((patientAddress) => {
          if (patientAddress !== '') {
            planAddress.add(patientAddress);
          }
        });
        plan.patientPhone.forEach((patientPhone) => {
          if (patientPhone !== '') {
            planPhones.add(patientPhone);
          }
        });
      });
      // plan 에 포함된 환자의 patientID는 pool에서 다시한번 검색합니다.
      for (let i = 0; i < plans.length; i++) {
        for (let j = 0; j < categorizedArrays[i].length; j++) {
          planPatients.add(categorizedArrays[i][j][index[13]]);
        }
      }
      // fuzzy 알고리즘을 통해 facility 주소와 비슷한 주소의 rx를 검색합니다.
      const fuseOptions = {
        includeScore: true,
      };
      const _fusePlanAddress = [];
      pool.forEach((rx) => {
        _fusePlanAddress.push(rx[index[9]]);
      });
      const fuse = new Fuse(_fusePlanAddress, fuseOptions);
      planAddress.forEach((address) => {
        const results = fuse.search(address);
        results.forEach((result) => {
          if (result.score < 0.5) {
            fusePlanAddress.add(result.item);
          }
        });
      });
      // candidate 배열을 생성하고 각각의 알고리즘 결과물을 filterAndPull 함수로 처리합니다.
      let candidate = [];
      planPatients.forEach((patientID) => {
        candidate = filterAndPull(patientID, 13, candidate);
      });
      planDoctors.forEach((doctorName) => {
        candidate = filterAndPull(doctorName, 3, candidate);
      });
      planPhones.forEach((patientPhone) => {
        candidate = filterAndPull(patientPhone, 10, candidate);
      });
      fusePlanAddress.forEach((address) => {
        candidate = filterAndPull(address, 9, candidate);
      });

      // TODO: PatNotes를 추적합니다.
      state.uploadCSV.result.candidate = candidate;

      // plans 배열 맨 끝에 candidate를 추가하고 state에 저장합니다.
      plans[plans.length] = 'CANDIDATE';
      state.uploadCSV.plans = plans;
      categorizedArrays[categorizedArrays.length] = candidate;
      state.uploadCSV.result.categorizedArrays = categorizedArrays;

      // DataGrid에서 사용할 객체들의 배열인 Row를 생성합니다.
      const fields = [];
      paperBillColumns.forEach((col) => fields.push(col.field));

      let rows = [];
      for (let i = 0; i < categorizedArrays.length; i++) {
        rows[i] = [];
        categorizedArrays[i].forEach((rx, j) => {
          const row = {
            id: rx[rx.length - 1],
          };
          requiredFields.forEach((field, k) => {
            Object.assign(row, { [field]: rx[index[k]] });
          });
          rows[i][j] = row;
        });
      }
      state.dataDisplay.rowsArrays = rows;

      state.isLoading = false;
      state.uploadCSV.isProcessed = true;
    },
    setCurrentPlan: (state, action) => {
      // DataDisplay에서 현재 화면(plan) 상태를 저장합니다.
      state.dataDisplay.currentPlan = action.payload;
    },
    syncState: (state, action) => {},
    updateRowsArrays: (state, action) => {
      state.isLoading = true;
      switch (action.payload.actionType) {
        case 'transfer':
          const { currentPlan, transferTo, rowsArrays, selectedRows } =
            action.payload;
          const copy = JSON.parse(JSON.stringify(rowsArrays));
          selectedRows.forEach((selectedRow) => {
            const indexToBeTransferred = copy[currentPlan].findIndex(
              (rx) => rx.id === selectedRow.id,
            );
            const rxToBeTransferred = copy[currentPlan][indexToBeTransferred];
            copy[currentPlan].splice(indexToBeTransferred, 1);
            copy[transferTo].unshift(rxToBeTransferred);
          });
          const compare = (key) => (a, b) =>
            a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
          copy[transferTo].sort(compare('id'));
          state.dataDisplay.rowsArrays = copy;
          break;
        default:
      }

      state.isLoading = false;
    },
  },
});

export default paperBillSlice.reducer;
export const {
  loadCSV,
  unloadCSV,
  processCSV,
  setCurrentPlan,
  updateRowsArrays,
} = paperBillSlice.actions;
