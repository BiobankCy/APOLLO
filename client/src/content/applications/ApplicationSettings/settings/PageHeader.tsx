import { Typography } from "@mui/material";
import { useAuth } from "src/contexts/UserContext";
import React from "react";
function PageHeader() {
  //const user = {
  //  name: 'George Avraam',
  //  avatar: '/static/images/avatars/1.jpg'
  //};
  const userContext = useAuth();

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        Application Settings
      </Typography>
      <Typography variant="subtitle2">
        {userContext?.currentUser?.fullname}, as a{" "}
        {userContext?.currentUser?.role.roleName}, you have access to the
        application settings panel.
      </Typography>
    </>
  );
}

export default PageHeader;
