import { Route, Routes } from 'react-router-dom';
import MainScreen from './screen/MainScreen';
import ListPrintPreview from './screen/paperbill/ListPrintPreview';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainScreen />} />
      <Route path="/print/paperbill/:planId" element={<ListPrintPreview />} />
    </Routes>
  );
};

export default App;
