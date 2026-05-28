
import QueryProvider from "./context/QueryProvider";
import { ToastProvider } from "./components/ui/Toast";
import AdmissionEnquiriesPage from "./pages/AdmissionEnquiriesPage";

const App = () => (
  <ToastProvider>
    <QueryProvider>
      <AdmissionEnquiriesPage />
    </QueryProvider>
  </ToastProvider>
);

export default App;