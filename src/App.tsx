import updater from "./updater";
import AppLayout from "./layout/AppLayout";
import axios from "axios";
import { useSigner } from "wagmi";

function App() {
 
  return <AppLayout />;
}

export default updater(App);
