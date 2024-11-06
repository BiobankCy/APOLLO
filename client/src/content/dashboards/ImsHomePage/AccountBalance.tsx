import {
  Button,
  Card,
  Box,
  Grid,
  Typography,
  useTheme,
  styled,
  Avatar,
  CardContent,
} from "@mui/material";
import React from "react";
import "apexcharts/dist/apexcharts.css";

import TrendingUp from "@mui/icons-material/TrendingUp";

import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import {
  PorderAnalysisByCategoryForChart,
  StatisticsDTO,
} from "../../../models/mymodels";
import { useNavigate } from "react-router-dom";
 

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`,
);

interface Subcategory {
  categoryid: number;
  subcategoryid: number;
  categoryname: string;
  subcategoryname: string;
  subcategorytotalqty_thismonth: number;
  subcategorytotalqty_previousmonth: number;
}

interface CategoryData {
  [key: string]: Subcategory[];
}
// const generateChartConfig = (categoryData: Subcategory[]) => {
//     const subcategoryNames: string[] = categoryData.map((subcategory) => subcategory.subcategoryname);
//     const thisMonthData: number[] = categoryData.map((subcategory) => subcategory.subcategorytotalqty_thismonth);
//     const previousMonthData: number[] = categoryData.map((subcategory) => subcategory.subcategorytotalqty_previousmonth);

//     return {
//         series: [
//             {
//                 name: 'This Month',
//                 data: thisMonthData,
//             },
//             {
//                 name: 'Previous Month',
//                 data: previousMonthData,
//             },
//         ],
//         options: {
//             chart: {
//                 type: 'bar',
//             },
//             xaxis: {
//                 categories: subcategoryNames,
//             },
//         } as ApexOptions, // Explicitly type the options prop
//     };
// };

const grouthedata = (ungroupeddata: PorderAnalysisByCategoryForChart[]) => {
  // Group by categoryname and calculate averages
  const groupedData: { [key: string]: PorderAnalysisByCategoryForChart[] } =
    ungroupeddata.reduce(
      (result, item) => {
        const key = item.categoryname;
        if (!result[key]) {
          result[key] = [];
        }
        result[key].push(item);
        return result;
      },
      {} as { [key: string]: PorderAnalysisByCategoryForChart[] },
    );

  return groupedData;
};

function AccountBalance(those: StatisticsDTO | null) {
  const theme = useTheme();
  const navigate = useNavigate();

  const groupedData = grouthedata(those?.pordersanalysisforpiechart ?? []);

  const generateChartConfig = (categoryData: Subcategory[]) => {
    const subcategoryNames: string[] = categoryData.map(
      (subcategory) => subcategory.subcategoryname,
    );
    const thisMonthData: number[] = categoryData.map(
      (subcategory) => subcategory.subcategorytotalqty_thismonth,
    );
    const previousMonthData: number[] = categoryData.map(
      (subcategory) => subcategory.subcategorytotalqty_previousmonth,
    );

    return {
      series: [
        {
          name: "This Month",
          data: thisMonthData,
        },
        {
          name: "Previous Month",
          data: previousMonthData,
        },
      ],
      options: {
        chart: {
          type: "bar",
        },
        xaxis: {
          categories: subcategoryNames,
          title: { text: "Quantity" },
        },
        colors: ["#5569ff", "#198754"],
        yaxis: {
          /*  title: { text: 'Subcategory' }*/
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "Quantity: " + val + "";
            },
          },
        },
        stroke: {
          show: false,
          width: 1,
          colors: ["transparent"],
        },
        plotOptions: {
          bar: {
            horizontal: true,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
      } as ApexOptions, // Explicitly type the options prop
    };
  };

  return (
    <>
      <Card>
        <CardContent>
          <Grid spacing={0} container>
            {/*Pending Lines*/}
            <Grid item xs={12} md={6}>
              <Box p={4}>
                <Typography
                  sx={{
                    pb: 3,
                  }}
                  variant="h4"
                >
                  Requests Pending Decision
                </Typography>
                <Box>
                  <Typography variant="h3" gutterBottom>
                    Total {those?.total_pendingreqlinescount}
                  </Typography>

                  {/*<Typography*/}
                  {/*    variant="h4"*/}
                  {/*    fontWeight="normal"*/}
                  {/*    color="text.secondary"*/}
                  {/*>*/}
                  {/*    {those?.total_today_pendingreqlinescount} new requests today!*/}
                  {/*</Typography>*/}

                  <Box
                    display="flex"
                    sx={{
                      py: 4,
                    }}
                    alignItems="center"
                  >
                    {/*<AvatarSuccess*/}
                    {/*  sx={{*/}
                    {/*    mr: 2*/}
                    {/*  }}*/}
                    {/*  variant="rounded"*/}
                    {/*>*/}
                    {/*  <TrendingUp fontSize="large" />*/}
                    {/*</AvatarSuccess>*/}
                    {/*<Box>*/}
                    {/*  <Typography variant="h4">+ 55</Typography>*/}
                    {/*  <Typography variant="subtitle2" noWrap>*/}
                    {/*    this month*/}
                    {/*  </Typography>*/}
                    {/*</Box>*/}
                  </Box>
                </Box>
                <Grid container spacing={3}>
                  <Grid sm item>
                    <Button
                      onClick={() =>
                        navigate("/management/requests-lines", {
                          replace: false,
                        })
                      }
                      fullWidth
                      variant="outlined"
                    >
                      Make a Decision{" "}
                    </Button>
                  </Grid>
                  <Grid sm item>
                    <Button
                      onClick={() =>
                        navigate("/management/products", { replace: false })
                      }
                      fullWidth
                      variant="contained"
                    >
                      Add New Request
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/*Request Lines*/}
            <Grid item xs={12} md={6}>
              <Box p={4}>
                <Typography
                  sx={{
                    pb: 3,
                  }}
                  variant="h4"
                >
                  Decided Requests (Year To Date)
                </Typography>
                <Box>
                  <Typography variant="h3" gutterBottom>
                    Total {those?.total_ytd_reqlinescount}
                  </Typography>

                  <Box
                    display="flex"
                    sx={{
                      py: 4,
                    }}
                    alignItems="center"
                  >
                    <AvatarSuccess
                      sx={{
                        mr: 2,
                      }}
                      variant="rounded"
                    >
                      <TrendingUp fontSize="large" />
                    </AvatarSuccess>
                    <Box>
                      {those?.reqanalysisytdbydecision &&
                        those.reqanalysisytdbydecision.length > 0 &&
                        those?.reqanalysisytdbydecision.map((line, index) => (
                          <Typography
                            key={`${line.decision}-${index}`}
                            variant="h4"
                          >
                            {line.decision}: {line.count}
                          </Typography>
                        ))}

                      {/*{those?.reqanalysisytdbydecision && those.reqanalysisytdbydecision.length > 0 && (those.reqanalysisytdbydecision.map((line,index) => {*/}

                      {/*    return (*/}
                      {/*        <Typography*/}
                      {/*            key={`${line.decision}-${index}`}*/}
                      {/*            variant="h4"*/}
                      {/*            //fontWeight="normal"*/}
                      {/*           // color="text.secondary"*/}
                      {/*        >*/}
                      {/*            {line.decision}: {line.count}*/}
                      {/*        </Typography>*/}
                      {/*    );*/}
                      {/*}*/}
                      {/*))*/}
                      {/*}*/}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/*      {renderPieCharts(those?.pordersanalysisforpiechart ?? [], theme)}*/}

            <Grid container spacing={4} p={4}>
              {Object.keys(groupedData).map((category) => (
                <Grid item xs={12} sm={6} lg={4} key={category}>
                  <div>
                    <Typography
                      sx={{
                        pb: 1,
                      }}
                      variant="h4"
                    >
                      Ordered {category}
                    </Typography>
                    <Chart
                      options={
                        generateChartConfig(groupedData[category]).options
                      }
                      series={generateChartConfig(groupedData[category]).series}
                      type="bar"
                      height={300}
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default AccountBalance;

//                        <Grid
//    sx={{
//        position: 'relative'
//    }}
//    display="flex"
//    alignItems="center"
//    item
//    xs={12}
//    md={6}
//>

//    <Box
//        component="span"
//        sx={{
//            display: { xs: 'none', md: 'inline-block' }
//        }}
//    >

//        <Divider absolute orientation="vertical" />

//    </Box>
//    <Box py={4} pr={4} flex={1}>
//        <Typography
//            sx={{
//                pb: 3, pl: 4
//            }}
//            variant="h4"
//        >
//            AAAAAA!
//        </Typography>
//        <Grid container spacing={0}>

//            <Grid
//                xs={12}
//                sm={5}
//                item
//                display="flex"
//                justifyContent="center"
//                alignItems="center"
//            >

//                <Chart
//                    height={250}
//                    options={chartOptions2}
//                    series={chartSeries2}
//                    type="donut"
//                />
//            </Grid>

//            <Grid xs={12} sm={7} item display="flex" alignItems="center">
//                <List
//                    disablePadding
//                    sx={{
//                        width: '100%'
//                    }}
//                >
//                    <ListItem disableGutters>
//                        <ListItemAvatarWrapper>
//                            <img
//                                alt="Product 1"
//                                src="/static/images/placeholders/logo/icon-256x256.gif"
//                            />
//                        </ListItemAvatarWrapper>
//                        <ListItemText
//                            primary="Code1"
//                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
//                            secondary="Product Description 1"
//                            secondaryTypographyProps={{
//                                variant: 'subtitle2',
//                                noWrap: true
//                            }}
//                        />
//                        <Box>
//                            <Typography align="right" variant="h4" noWrap>
//                                20%
//                            </Typography>
//                            <Text color="success">+2.54%</Text>
//                        </Box>
//                    </ListItem>
//                    <ListItem disableGutters>
//                        <ListItemAvatarWrapper>
//                            <img
//                                alt="Product 2"
//                                src="/static/images/placeholders/logo/icon-256x256.gif"
//                            />
//                        </ListItemAvatarWrapper>
//                        <ListItemText
//                            primary="Code2"
//                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
//                            secondary="Product Description 2"
//                            secondaryTypographyProps={{
//                                variant: 'subtitle2',
//                                noWrap: true
//                            }}
//                        />
//                        <Box>
//                            <Typography align="right" variant="h4" noWrap>
//                                20%
//                            </Typography>
//                            <Text color="success">+2.54%</Text>
//                        </Box>
//                    </ListItem>
//                    <ListItem disableGutters>
//                        <ListItemAvatarWrapper>
//                            <img
//                                alt="Product 3"
//                                src="/static/images/placeholders/logo/icon-256x256.gif"
//                            />
//                        </ListItemAvatarWrapper>
//                        <ListItemText
//                            primary="Code3"
//                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
//                            secondary="Product Description 3"
//                            secondaryTypographyProps={{
//                                variant: 'subtitle2',
//                                noWrap: true
//                            }}
//                        />
//                        <Box>
//                            <Typography align="right" variant="h4" noWrap>
//                                20%
//                            </Typography>
//                            <Text color="success">+2.54%</Text>
//                        </Box>
//                    </ListItem>
//                </List>
//            </Grid>
//        </Grid>
//    </Box>
//</Grid>
//<Grid
//    sx={{
//        position: 'relative'
//    }}
//    display="flex"
//    alignItems="center"
//    item
//    xs={12}
//    md={6}
//>
//    <Box
//        component="span"
//        sx={{
//            display: { xs: 'none', md: 'inline-block' }
//        }}
//    >
//        <Divider absolute orientation="vertical" />
//    </Box>
//    <Box py={4} pr={4} flex={1}>
//        <Typography
//            sx={{
//                pb: 3, pl: 4
//            }}
//            variant="h4"
//        >
//            AAAAAA!
//        </Typography>
//        <Grid container spacing={0}>
//            <Grid
//                xs={12}
//                sm={5}
//                item
//                display="flex"
//                justifyContent="center"
//                alignItems="center"
//            >
//                <Chart
//                    height={250}
//                    options={chartOptions2}
//                    series={chartSeries2}
//                    type="donut"
//                />
//            </Grid>
//            <Grid xs={12} sm={7} item display="flex" alignItems="center">
//                <List
//                    disablePadding
//                    sx={{
//                        width: '100%'
//                    }}
//                >
//                    <ListItem disableGutters>
//                        <ListItemAvatarWrapper>
//                            <img
//                                alt="Product 1"
//                                src="/static/images/placeholders/logo/icon-256x256.gif"
//                            />
//                        </ListItemAvatarWrapper>
//                        <ListItemText
//                            primary="Code1"
//                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
//                            secondary="Product Description 1"
//                            secondaryTypographyProps={{
//                                variant: 'subtitle2',
//                                noWrap: true
//                            }}
//                        />
//                        <Box>
//                            <Typography align="right" variant="h4" noWrap>
//                                20%
//                            </Typography>
//                            <Text color="success">+2.54%</Text>
//                        </Box>
//                    </ListItem>
//                    <ListItem disableGutters>
//                        <ListItemAvatarWrapper>
//                            <img
//                                alt="Product 2"
//                                src="/static/images/placeholders/logo/icon-256x256.gif"
//                            />
//                        </ListItemAvatarWrapper>
//                        <ListItemText
//                            primary="Code2"
//                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
//                            secondary="Product Description 2"
//                            secondaryTypographyProps={{
//                                variant: 'subtitle2',
//                                noWrap: true
//                            }}
//                        />
//                        <Box>
//                            <Typography align="right" variant="h4" noWrap>
//                                20%
//                            </Typography>
//                            <Text color="success">+2.54%</Text>
//                        </Box>
//                    </ListItem>
//                    <ListItem disableGutters>
//                        <ListItemAvatarWrapper>
//                            <img
//                                alt="Product 3"
//                                src="/static/images/placeholders/logo/icon-256x256.gif"
//                            />
//                        </ListItemAvatarWrapper>
//                        <ListItemText
//                            primary="Code3"
//                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
//                            secondary="Product Description 3"
//                            secondaryTypographyProps={{
//                                variant: 'subtitle2',
//                                noWrap: true
//                            }}
//                        />
//                        <Box>
//                            <Typography align="right" variant="h4" noWrap>
//                                20%
//                            </Typography>
//                            <Text color="success">+2.54%</Text>
//                        </Box>
//                    </ListItem>
//                </List>
//            </Grid>
//        </Grid>
//    </Box>
//</Grid>
