import { useEffect, useState } from "react";
import React from "react";
import { Helmet } from "react-helmet-async";
import TopBarContent from "./Layout/TopBarContent";
import SidebarContent from "./Layout/SidebarContent";
import ReportingSection from "./Layout/ReportingSection";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import Scrollbar from "src/Components/Scrollbar";
import { Divider, useTheme } from "@mui/material";
import { ReportCategoryModel, ReportModel } from "./Reports/Models/AllInterfaces";
import { getInitialReports } from "./Reports/Models/DefineReportsAndFiltersData";
import { ChartsDashboard } from "./Layout/DashboardWithCharts";

import {
  Box,
  styled,
  Drawer,
  IconButton,
} from "@mui/material";



const RootWrapper = styled(Box)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display: flex;
`,
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 450px;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`,
);

const ReportViewerStyledBox = styled(Box)(
  ({ theme }) => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
          background: ${theme.colors.alpha.white[100]};
`,
);

const TopBarStyledBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.white[100]};
        border-bottom: ${theme.colors.alpha.black[10]} solid 1px;
        padding: ${theme.spacing(2)};
        align-items: center;
`,
);

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  background: ${theme.colors.alpha.white[100]};
`,
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`,
);





export default function TheFileComp() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [initialReports, setInitialReports] = useState<ReportCategoryModel[]>([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  useEffect(() => {
    const fetchInitialReports = async () => {
      const reports = await getInitialReports();
      setInitialReports(reports);
    };

    fetchInitialReports();
  }, []);





  const [selectedReport, setSelectedReport] = useState<ReportModel | null>(null);

  const handleReportSelection = (report: ReportModel) => {
    setSelectedReport(report === selectedReport ? null : report);
  };

  const clearSelectedReport = () => {
    setSelectedReport(null);
  };



  return (
    <>
      <Helmet>
        <title>IMS - Reporting Tool</title>
      </Helmet>

      <RootWrapper className="Mui-FixedWrapper">
        {!selectedReport ? (
          <>
            <DrawerWrapperMobile sx={{ display: { sm: "inline-block", xs: "inline-block", md: "inline-block" }, }}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
            >
              <Scrollbar>
                <SidebarContent
                  reports={initialReports}
                  handleReportSelection={handleReportSelection} />
              </Scrollbar>
            </DrawerWrapperMobile>

            <Sidebar sx={{ display: { xs: "none", sm: "none", md: "inline-block" }, }} >
              <Scrollbar>
                <SidebarContent
                  reports={initialReports}
                  handleReportSelection={handleReportSelection} />
              </Scrollbar>
            </Sidebar>
          </>
        ) : null}
        <Scrollbar>


          <ReportViewerStyledBox>
            <TopBarStyledBox
              sx={{
                display: { sm: "flex", md: "inline-block" },
              }}
            >
              <IconButtonToggle
                sx={{
                  display: { sm: "flex", md: "none" },
                  mr: 2,
                }}
                color="primary"
                onClick={handleDrawerToggle}
                size="small"
              >
                <MenuTwoToneIcon />
              </IconButtonToggle>
              <TopBarContent />
            </TopBarStyledBox>

            <Box flex={1}>

              {selectedReport ? (
                <ReportingSection
                  clearSelectedReport={clearSelectedReport}
                  selectedReport={selectedReport ?? null}
                />
              ) : (
                <ChartsDashboard />
              )}


            </Box>

            <Divider />
            {/*   <BottomBarContent sendNowTheRequest={sendInventoryTransaction} myNotes={mynotes} setMynotes={setMynotes} selectedReasonId={selectedReasonId ?? 0} setselectedReasonId={setselectedReasonId }  counterOFcountList={countList.length} transReasonsList={availableReasons ?? []} />*/}
          </ReportViewerStyledBox>

        </Scrollbar>
      </RootWrapper>


    
    </>
  );
}



