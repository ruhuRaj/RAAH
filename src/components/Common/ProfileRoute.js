import React from "react";
import { useSelector } from "react-redux";
import MyProfile from "../../pages/CitizenDashboard/MyProfile";
import DMMyProfile from "../../pages/DMDashboard/MyProfile";
import NodalMyProfile from "../../pages/NodalDashboard/MyProfile";
import { ACCOUNT_TYPE } from "../../utils/constants";

function ProfileRoute() {
  const user = useSelector((state) => state.profile.user);

  console.log("ProfileRoute - User account type:", user?.accountType);
  console.log("ProfileRoute - ACCOUNT_TYPE.NODAL_OFFICER:", ACCOUNT_TYPE.NODAL_OFFICER);

  if (!user) return null;

  switch (user.accountType) {
    case ACCOUNT_TYPE.CITIZEN:
      return <MyProfile />;
    case ACCOUNT_TYPE.DISTRICT_MAGISTRATE:
      return <DMMyProfile />;
    case ACCOUNT_TYPE.NODAL_OFFICER:
      return <NodalMyProfile />;
    case 'Nodal Officers':
      return <NodalMyProfile />;
    default:
      console.log("ProfileRoute - Default case, returning Citizen profile");
      return <MyProfile />;
  }
}

export default ProfileRoute; 