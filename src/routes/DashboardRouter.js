import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import CitizenDashboardLayout from "../pages/CitizenDashboard/DashboardLayout";
import DMDashboardLayout from "../pages/DMDashboard/DashboardLayout";
import NodalDashboardLayout from "../pages/NodalDashboard/DashboardLayout";
import MyProfile from "../pages/CitizenDashboard/MyProfile";
import DMMyProfile from "../pages/DMDashboard/MyProfile";
import NodalMyProfile from "../pages/NodalDashboard/MyProfile";
import { ACCOUNT_TYPE } from "../utils/constants";

function DashboardRouter() {
  const user = useSelector((state) => state.profile.user);

  if (!user) return <Navigate to="/login" />;

  if (user.accountType === ACCOUNT_TYPE.CITIZEN) {
    return (
      <CitizenDashboardLayout>
        <Outlet />
      </CitizenDashboardLayout>
    );
  }

  if (user.accountType === ACCOUNT_TYPE.DISTRICT_MAGISTRATE) {
    return (
      <DMDashboardLayout>
        <Outlet />
      </DMDashboardLayout>
    );
  }

  if (user.accountType === ACCOUNT_TYPE.NODAL_OFFICER || user.accountType === 'Nodal Officers') {
    console.log("DashboardRouter: Rendering NodalDashboardLayout for user:", user.accountType);
    return (
      <NodalDashboardLayout>
        <Outlet />
      </NodalDashboardLayout>
    );
  }

  return <Navigate to="/" />;
}

export default DashboardRouter;
