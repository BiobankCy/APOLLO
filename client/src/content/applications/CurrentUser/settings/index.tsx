import { useState, ChangeEvent } from "react";
import React from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "./PageHeader";
import PageTitleWrapper from "src/Components/PageTitleWrapper";
import { Container, Tabs, Tab, Grid } from "@mui/material";
import Footer from "src/Components/Footer";
import { styled } from "@mui/material/styles";
import ViewSettingsTab from "./EditProfileTab";
import SecurityTab from "./SecurityTab";

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
    { value: "security", label: "Passwords/Security" },
  ];

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Helmet>
        <title>IMS - User Settings</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
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
            {currentTab === "view_settings" && <ViewSettingsTab />}
            {/*  {currentTab === 'notifications' && <NotificationsTab />}*/}
            {currentTab === "security" && <SecurityTab />}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserSettings;
