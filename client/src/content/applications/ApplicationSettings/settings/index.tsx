import { useState, ChangeEvent } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/Components/PageTitleWrapper";
import { Container, Tabs, Tab, Grid } from "@mui/material";
import Footer from "src/Components/Footer";
import { styled } from "@mui/material/styles";
import React from "react";
/*import ActivityTab from './ActivityTab';*/
import ViewSettingsTab from "./SettingsTab";
/*import NotificationsTab from './NotificationsTab';*/
//import SecurityTab from './SecurityTab';
import UsersTab from "./UsersTab";
import JobRolesTab from "./JobRolesTab";
const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`,
);

function ManagementUserSettings() {
  const [currentTab, setCurrentTab] = useState<string>("view_settings");

  const tabs = [
    /* { value: 'activity', label: 'Activity' },*/
    { value: "view_settings", label: "View Settings" },
    /* { value: 'notifications', label: 'Notifications' },*/
    /*   { value: 'security', label: 'Passwords/Security' },*/
    { value: "view_users", label: "View Users" },
    { value: "view_jobroles", label: "View Job Roles" },
  ];

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>IMS - Application Settings</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {/*    {currentTab === 'activity' && <ActivityTab />}*/}
            {/*  {currentTab === 'notifications' && <NotificationsTab />}*/}
            {/* {currentTab === 'security' && <SecurityTab />}*/}
            {currentTab === "view_settings" && <ViewSettingsTab />}
            {currentTab === "view_users" && <UsersTab />}
            {currentTab === "view_jobroles" && <JobRolesTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserSettings;
