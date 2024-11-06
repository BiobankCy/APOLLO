import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Switch,
  Button,
} from "@mui/material";
import React from "react";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import Text from "src/Components/Text";
import Label from "src/Components/Label";
import { useAuth } from "src/contexts/UserContext";

function ViewSettingsTab() {
  const userContext = useAuth();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Settings
              </Typography>
              <Typography variant="subtitle2">
                View informations related to you.
              </Typography>
            </Box>
            {/*<Button variant="text" startIcon={<EditTwoToneIcon />}>*/}
            {/*  Edit*/}
            {/*</Button>*/}
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    Name:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b> {userContext?.currentUser?.fullname}</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    Email:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    {" "}
                    <b> {userContext?.currentUser?.email}</b>{" "}
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    Job Role:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: "auto", sm: 300 } }}>
                    <Text color="black">
                      {" "}
                      <b> {userContext?.currentUser?.jobRole.roleName}</b>{" "}
                    </Text>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    System Role:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: "auto", sm: 300 } }}>
                    <Text color="black">
                      {" "}
                      <b> {userContext?.currentUser?.role.roleName}</b>{" "}
                    </Text>
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Permissions
              </Typography>
              <Typography variant="subtitle2">
                Permissions related to you.
              </Typography>
            </Box>
            {/*<Button variant="text" startIcon={<EditTwoToneIcon />}>*/}
            {/*  Edit*/}
            {/*</Button>*/}
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {" "}
                    Request Approval:{" "}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Switch
                    color="success"
                    checked={userContext?.currentUser?.claimCanApproveRequest}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {" "}
                    Add Purchase Order:{" "}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Switch
                    color="success"
                    checked={userContext?.currentUser?.claimCanMakePo}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {" "}
                    Add Request:{" "}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Switch
                    color="success"
                    checked={userContext?.currentUser?.claimCanMakeRequest}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {" "}
                    Receive Items:{" "}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Switch
                    color="success"
                    checked={userContext?.currentUser?.claimCanReceiveItems}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {" "}
                    Transfer Inventory:{" "}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Switch
                    color="success"
                    checked={userContext?.currentUser?.claimCanTransferStock}
                  />
                </Grid>

                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {" "}
                    Inventory Adjustment:{" "}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Switch
                    color="success"
                    checked={
                      userContext?.currentUser?.claimCanMakeInventoryAdjustment
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {" "}
                    View Reports:{" "}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Switch
                    color="success"
                    checked={userContext?.currentUser?.claimCanViewReports}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {" "}
                    (CC) recipient to every purchase order email
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Switch
                    color="success"
                    checked={userContext?.currentUser?.cconpurchaseOrder}
                  />
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
     
    </Grid>
  );
}

export default ViewSettingsTab;
