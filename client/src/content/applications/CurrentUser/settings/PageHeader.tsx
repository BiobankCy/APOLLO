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
        User Settings
      </Typography>
      <Typography variant="subtitle2">
        {userContext?.currentUser?.fullname}, here you can see your settings
        panel.
      </Typography>
    </>
  );
}

export default PageHeader;
