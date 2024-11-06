import * as React from "react";
import { Typography, Avatar, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "src/contexts/UserContext";

function PageHeader() {
  const user1 = {
    name: "George Avraam",
    avatar: "/static/images/avatars/blank-avatar-small.jpg",
  };
  const theme = useTheme();
  const userContext = useAuth();

  //   const user = React.useContext(UserContext) as IUser | null;

  return (
    <Grid container alignItems="center" justifyContent="flex-start">
      <Grid item>
        <Avatar
          sx={{
            mr: 2,
            width: theme.spacing(6),
            height: theme.spacing(6),
          }}
          variant="rounded"
          alt={user1.name}
          src={user1.avatar}
        />
      </Grid>
      <Grid item>
        {userContext?.currentUser && (
          <>
            <Typography variant="h3" component="h3" gutterBottom>
              Welcome {userContext?.currentUser?.firstName}
            </Typography>
            <Typography variant="subtitle2">
             
            </Typography>
          </>
        )}
        {!userContext && (
          <>
            <Typography variant="h3" component="h3" gutterBottom>
              Welcome
            </Typography>
            <Typography variant="subtitle2">
          
            </Typography>
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default PageHeader;
