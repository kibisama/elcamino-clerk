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
    headerName: 'Prescriber',
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
    headerName: 'Cost',
    hideable: false,
    width: 81,
    type: 'number',
    editable: true,
    headerAlign: 'right',
    align: 'right',
  },

  {
    field: 'PlanName',
    headerName: 'Plan',
    width: 70,
  },
  {
    field: 'PatientStreet',
    headerName: 'PatientStreet',
    width: 103,
  },
  {
    field: 'patientPhone',
    headerName: 'PatientPhone',
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
    headerName: 'RxNumber',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 90,
  },
  {
    field: 'RxDate',
    headerName: 'RxDate',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 92,
  },
  {
    field: 'PatientName',
    headerName: 'PatientName',
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
    headerName: 'DrugName',
    headerClassName: 'printHeader',
    hideable: false,
    sortable: false,
    width: 100,
    flex: 1.25,
  },
  {
    field: 'RxQty',
    headerName: 'RxQty',
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
    width: 81,
    type: 'number',
    headerAlign: 'right',
    align: 'right',
  },
];
