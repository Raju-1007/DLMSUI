// Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import BackButton from "./components/BackButton";

const Layout = () => {
     const location = useLocation();

   const hideBackButtonPaths = [
    "/",
    "/register",
    "/departmentLogin",
  ];

 const showBackButton = !hideBackButtonPaths.some(path =>
  location.pathname === path
);

  console.log(showBackButton,"showBackButton");
  return (
    <div>
      {showBackButton ? <BackButton /> : null}
      <Outlet />
    </div>
  );
};

export default Layout;