export const requiredFields = [
  'RxNumber',
  'RxDate',
  'PatientName',
  'DoctorName',
  'DrugName',
  'RxQty',
  'PatPAy',
  'PlanName',
  'DrugNDC',
  'PatientStreet',
  'patientPhone',
  'RxStatus',
  'RxStatusFin',
  'PatientID',
  'RxNotes',
  'PatNotes',
];

export const paperBillColumns = [
  {
    field: 'RxNumber',
    headerName: 'RxNumber',
    hideable: false,
    width: 90,
  },
  {
    field: 'RxDate',
    headerName: 'RxDate',
    hideable: false,
    width: 92,
  },
  {
    field: 'PatientName',
    headerName: 'PatientName',
    hideable: false,
    width: 100,
  },
  {
    field: 'PatientID',
    headerName: 'PatientID',
    width: 100,
  },
  {
    field: 'DoctorName',
    headerName: 'DoctorName',
    hideable: false,
    width: 100,
  },
  {
    field: 'DrugName',
    headerName: 'DrugName',
    hideable: false,
    width: 100,
  },
  {
    field: 'DrugNDC',
    headerName: 'DrugNDC',
    width: 109,
  },
  {
    field: 'RxQty',
    headerName: 'RxQty',
    hideable: false,
    width: 60,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'PatPAy',
    headerName: 'PatPAy',
    hideable: false,
    width: 81,
    type: 'number',
    editable: true,
    headerAlign: 'right',
    align: 'right',
  },

  {
    field: 'PlanName',
    headerName: 'PlanName',
    width: 70,
  },
  {
    field: 'PatientStreet',
    headerName: 'PatientStreet',
    width: 103,
  },
  {
    field: 'patientPhone',
    headerName: 'patientPhone',
    width: 123,
  },
  {
    field: 'RxStatus',
    headerName: 'RxStatus',
    width: 78,
  },
  {
    field: 'RxStatusFin',
    headerName: 'RxStatusFin',
    width: 116,
  },
  {
    field: 'RxNotes',
    headerName: 'RxNotes',
    width: 100,
  },
  {
    field: 'PatNotes',
    headerName: 'PatNotes',
    width: 100,
  },
];

export const printPaperBillColumns = [
  {
    field: 'RxNumber',
    headerName: 'Rx Number',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 90,
  },
  {
    field: 'RxDate',
    headerName: 'Rx Date',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 92,
  },
  {
    field: 'PatientName',
    headerName: 'Patient Name',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 100,
    flex: 1,
  },
  {
    field: 'DoctorName',
    headerName: 'Prescriber',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 100,
    flex: 1,
  },
  {
    field: 'DrugName',
    headerName: 'Medication Name',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 100,
    flex: 1.25,
  },
  {
    field: 'RxQty',
    headerName: 'Rx Qty',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 60,
    headerAlign: 'right',
    align: 'right',
  },
  {
    field: 'PatPAy',
    headerName: 'Cost',
    hideable: false,
    sortable: false,
    width: 60,
    type: 'number',
    headerAlign: 'right',
    align: 'right',
  },
];

// functions
export const getMonthName = (month) => {
  switch (month) {
    case 0:
      month = 'Jan';
      break;
    case 1:
      month = 'Feb';
      break;
    case 2:
      month = 'Mar';
      break;
    case 3:
      month = 'Apr';
      break;
    case 4:
      month = 'May';
      break;
    case 5:
      month = 'Jun';
      break;
    case 6:
      month = 'Jul';
      break;
    case 7:
      month = 'Aug';
      break;
    case 8:
      month = 'Sep';
      break;
    case 9:
      month = 'Oct';
      break;
    case 10:
      month = 'Nov';
      break;
    case 11:
      month = 'Dec';
      break;
    default:
      month = 'Invalid month';
  }
  return month;
};
export const createDateInfo = (date) => {
  if (!(date instanceof Date)) {
    throw new Error('the argument must be instanceof Date');
  }
  return {
    month: date.getMonth() + 1,
    monthName: getMonthName(date.getMonth()),
    date: date.getDate(),
    year: date.getFullYear(),
  };
};

// 11자리 NDC 문자열에 하이픈 추가
export const hyphenateNDC = (ndc) => {
  if (typeof ndc !== 'string') {
    ndc = String(ndc);
  }
  if (!/^\d{11,11}$/.test(ndc)) {
    console.error('NDC must be 11-digit numbers');
  }
  return `${ndc.substring(0, 5)}-${ndc.substring(5, 9)}-${ndc.substring(
    9,
    11,
  )}`;
};
// 입력된 문자열이 NDC/UPC/CIN/검색어(term)인지 구분하고 해당 타입을 문자열로 반환
export const evaluateSearchingTerm = (term) => {};

// 한자리 수의 0이나 양의 정수일 경우 0을 추가한 문자열을 반환합니다.
export const addZero = (num) => {
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error('The argument must be a positive integer or zero.');
  }
  if (num > 9) {
    return Number(num).toString();
  }
  return '0' + Number(num).toString();
};

// 객체로 구성된 배열과 키값을 전달 받아 해당 키값의 값을 합산한 값을 반환합니다.
// TODO: 필요할 경우 함수 보완하기
export const sum = (array, key) => {
  if (!(array instanceof Array)) {
    throw new Error('The first argument must be an array.');
  }
  // for (let i = 0; i < array.length; i++) {
  //   if (Number.isNaN(Number(array[i]))) {
  //     throw new Error('The array must consist of numbers only.');
  //   }
  // }
  // for (let i = 0; i < array.length; i++) {
  //   if (typeof array[i] !== 'object' || array[i][key] === undefined) {
  //     throw new Error(
  //       'The array must consist of objects including the key value.',
  //     );
  //   }
  // }
  if (key) {
    return array.reduce((a, c) => a + Number(c[key]), 0);
  } else {
    return array.reduce((a, c) => a + Number(c), 0);
  }
};

/////////////////////////////////////////////////////////////////////////////
// SORT 함수
/////////////////////////////////////////////////////////////////////////////
// 객체를 요소로 갖는 배열을 정렬하는 sort 함수
export const compareKey = (key) => (a, b) =>
  a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
