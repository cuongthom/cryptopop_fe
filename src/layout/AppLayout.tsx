import {Route, Routes} from "react-router-dom";
import appRoutes from "../routes";
import WalletButton from "../components/WalletButton";
import Footer from "../components/footer/Footer";
import React from 'react'

const AppLayout = () => {
  return (
    <div>
      <WalletButton/>
      <Routes>
        {Object.values(appRoutes).map(({path, component}: any) => (
          <Route key={path} path={path} element={component}/>
        ))}
      </Routes>
      <Footer/>
    </div>
  );
};

export default AppLayout;
