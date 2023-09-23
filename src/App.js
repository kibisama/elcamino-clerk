import { Route, Routes } from 'react-router-dom';
import MainScreen from './screen/MainScreen';
import ListPrintPreview from './screen/paperbill/ListPrintPreview';
import InvoicePrintPreview from './screen/paperbill/InvoicePrintPreview';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainScreen />} />
      <Route path="/print/paperbill/:planId" element={<ListPrintPreview />} />
      <Route
        path="/print/paperbill/invoice/:planId"
        element={<InvoicePrintPreview />}
      />
    </Routes>
  );
};

export default App;
