import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  Box,
  styled,
 
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import { getStatistics } from "src/services/user.service";
import { StatisticsDTO, ccyFormat } from "src/models/mymodels";

 
 

export const ChartsDashboard = () => {
    const [statistics, setStatistics] = useState<StatisticsDTO | null>(null);
    const TypoGreen = styled(Typography)(
      ({ theme }) => `

      color: rgba(0, 143, 251, 0.85);

`
    );
    const Test1TableHead = styled(TableCell)(
      ({ theme }) => `
        background-color: rgba(0, 143, 251, 0.85);
        color: ${theme.palette.info.contrastText};
    `
    );

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.focus,
      },
      // hide last border
      "&:last-child td, &:last-child th": {
        border: 0,
      },
    }));

    useEffect(() => {
      getStatistics().then(
        (response) => {
          setStatistics(response.data);
          //console.log(response.data);
        },
        (error) => {


          setStatistics(null);
        }
      );
    }, []);

    // Extract the necessary data from those.stockList
    // Group the stockList by pcategory and calculate the totalValue for each category
    const groupedStockValuebyCategory = statistics?.stockList?.reduce(
      (accumulator, item) => {
        const existingCategory = accumulator.find(
          (group) => group.pcategory === item.pcategory
        );
        if (existingCategory) {
          existingCategory.totalValue += item.totalValue;
        } else {
          accumulator.push({
            pcategory: item.pcategory,
            totalValue: item.totalValue,
          });
        }
        return accumulator;
      },
      [] as { pcategory: string; totalValue: number; }[]
    ) || [];

    // Extract the necessary data from the groupedStockList
    let series = groupedStockValuebyCategory.map((item) => item.totalValue);
    let labels = groupedStockValuebyCategory.map((item) => item.pcategory);

    // Define the inventoryValueData
    const inventoryValueByCatyegoryData = {
      series,
      options: {
        chart: {
          type: "pie" as "pie",
        },
        labels,
      },
    };

    // Group the stockList by pcategory and calculate the totalValue for each category
    const groupedStockQtyListbyCategory = statistics?.stockList?.reduce(
      (accumulator, item) => {
        const existingCategory = accumulator.find(
          (group) => group.pcategory === item.pcategory
        );
        if (existingCategory) {
          existingCategory.totalQty += item.totalQty;
        } else {
          accumulator.push({
            pcategory: item.pcategory,
            totalQty: item.totalQty,
          });
        }
        return accumulator;
      },
      [] as { pcategory: string; totalQty: number; }[]
    ) || [];

    // Extract the necessary data from the groupedStockQtyListbyCategory
    series = groupedStockQtyListbyCategory.map((item) => item.totalQty);
    labels = groupedStockQtyListbyCategory.map((item) => item.pcategory);

    // Define the inventoryValueData
    const inventoryQtyByCategoryData = {
      series,
      options: {
        chart: {
          type: "pie" as "pie",
        },
        labels,
      },
    };

    //const groupedStockValueListbySupplier = those?.stockList?.reduce((accumulator, item) => {
    //    const existingSupplier = accumulator.find((group) => group.pdefaultSupplier === item.pdefaultSupplier);
    //    if (existingSupplier) {
    //        existingSupplier.totalValue += item.totalValue;
    //    } else {
    //        accumulator.push({ pdefaultSupplier: item.pdefaultSupplier, totalValue: item.totalValue });
    //    }
    //    return accumulator;
    //}, [] as { pdefaultSupplier: string; totalValue: number }[]) || [];
    const groupedStockValueListbySupplier = statistics?.stockList?.reduce(
      (accumulator, item) => {
        if (item.totalValue !== 0) {
          const roundedTotalValue = Math.round(item.totalValue); // Round the totalValue
          const existingSupplier = accumulator.find(
            (group) => group.pdefaultSupplier === item.pdefaultSupplier
          );
          if (existingSupplier) {
            existingSupplier.totalValue += roundedTotalValue;
          } else {
            accumulator.push({
              pdefaultSupplier: item.pdefaultSupplier,
              totalValue: roundedTotalValue,
            });
          }
        }
        return accumulator;
      },
      [] as { pdefaultSupplier: string; totalValue: number; }[]
    ) || [];

    // Extract the necessary data from the groupedStockQtyListbyCategory
    series = groupedStockValueListbySupplier.map((item) => item.totalValue);
    labels = groupedStockValueListbySupplier.map(
      (item) => item.pdefaultSupplier
    );

    // Define the inventoryValueData
    const inventoryValueBySupplier = {
      series,
      options: {
        chart: {
          type: "pie" as "pie",
        },
        labels,
      },
    };

    const groupedStockValueListbyItem = statistics?.stockList?.reduce(
      (accumulator, item) => {
        if (item.totalValue !== 0) {
          const roundedTotalValue = Math.round(item.totalValue); // Round the totalValue
          const existingSupplier = accumulator.find(
            (group) => group.pid ===
              item.pid.toString() + "/" + item.pcode + "/" + item.pname
          );
          if (existingSupplier) {
            existingSupplier.totalValue += roundedTotalValue;
          } else {
            accumulator.push({
              pid: item.pid.toString() + "/" + item.pcode + "/" + item.pname,
              totalValue: roundedTotalValue,
            });
          }
        }
        return accumulator;
      },
      [] as { pid: string; totalValue: number; }[]
    ) || [];

    // Sort the array by totalValue in descending order
    groupedStockValueListbyItem.sort((a, b) => b.totalValue - a.totalValue);

    // Take the top 5 items
    const top5Items = groupedStockValueListbyItem.slice(0, 5);

    // Calculate the total value of all items not in the top 5
    const totalValueOfAllOthers = groupedStockValueListbyItem
      .slice(5) // Skip the top 5 items
      .reduce((total, item) => total + item.totalValue, 0);

    // Add 'All Others' entry with the total value of all others
    const result = [
      ...top5Items,
      { pid: "All Others", totalValue: totalValueOfAllOthers },
    ];

    // Now 'result' contains the top 5 items and 'All Others' entry
    // Extract the necessary data from the groupedStockQtyListbyCategory
    series = result.map((item) => item.totalValue);
    labels = result.map((item) => item.pid);

    // Define the inventoryValueData
    const inventoryValueByItem = {
     
      options: {
        chart: {
          id: "basic-bar",
        },
        xaxis: {
          categories: labels,
          reversed: true,
        },
      },
      series: [
        {
          name: "series-1",
          data: series,
        },
      ],
    };

   
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* First Row - Charts */}
          <Grid pb={4} container spacing={2}>
            <Grid item xs={12}>
              <Typography align="center" variant="h2" noWrap>
                Warehouse Split
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography align="center" variant="h4" noWrap>
                Inventory Value By Category
              </Typography>
              <Chart
                options={inventoryValueByCatyegoryData.options}
                series={inventoryValueByCatyegoryData.series}
                type="pie"
                width="100%"
                height="200px" />
            </Grid>
            <Grid item xs={4}>
              <Typography align="center" variant="h4" noWrap>
                Inventory Quantity By Category
              </Typography>
              <Chart
                options={inventoryQtyByCategoryData.options}
                series={inventoryQtyByCategoryData.series}
                type="pie"
                width="100%"
                height="200px" />
            </Grid>
            <Grid item xs={4}>
              <Typography align="center" variant="h4" noWrap>
                Inventory Value By Supplier
              </Typography>
              <Chart
                options={inventoryValueBySupplier.options}
                series={inventoryValueBySupplier.series}
                type="pie"
                width="100%"
                height="200px" />
            </Grid>
            <Grid item xs={6}>
              <Typography align="center" variant="h4" noWrap>
                Inventory Value By Item (top 5)
              </Typography>
              {/*    <Chart options={inventoryValueByItem.options} width="100%" height="600px" />*/}
              <Chart
                options={inventoryValueByItem.options}
                series={inventoryValueByItem.series}
                type="bar"
                width="100%"
                height="250px" />

              {/*   <Chart options={restockingCostData.options} series={restockingCostData.series} type="bar" width="100%" />*/}
            </Grid>

            <Grid item xs={6}>
              <Typography align="center" variant="h4" noWrap>
                Inventory Value By Item
              </Typography>
              <div
                style={{
                  maxHeight: "250px",
                  overflowY: "auto",
                  marginTop: "6px",
                }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <Test1TableHead>Item Code</Test1TableHead>
                      <Test1TableHead>Item Name</Test1TableHead>
                      <Test1TableHead align="right">
                        Inventory Value
                      </Test1TableHead>
                      <Test1TableHead align="right">
                        Inventory Qty
                      </Test1TableHead>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statistics?.stockList
                      ?.slice() // Create a shallow copy of the array to avoid modifying the original array
                      .sort((a, b) => b.totalValue - a.totalValue) // Sort by totalValue in descending order
                      .map((item, index) => (
                        <StyledTableRow key={index}>
                          <TableCell>{item.pcode}</TableCell>
                          <TableCell>{item.pname}</TableCell>
                          <TableCell align="right">
                            {ccyFormat(item.totalValue)}
                          </TableCell>
                          <TableCell align="right">{item.totalQty}</TableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </Grid>
          </Grid>

          {/* Second Row - Text Components */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography align="center" variant="h4" noWrap>
                Inventory Value
              </Typography>

              <TypoGreen align="center" variant="h2">
                €{statistics?.inventory_stock_value ?? 0}
              </TypoGreen>
            </Grid>

            <Grid item xs={4}>
              <Typography align="center" variant="h4">
                Inventory Quantity
              </Typography>
              <TypoGreen align="center" variant="h2">
                {statistics?.inventory_stock_qty ?? 0}
              </TypoGreen>
            </Grid>

            <Grid item xs={4}>
              <Typography align="center" variant="h4">
                Inventory Items
              </Typography>
              <TypoGreen align="center" variant="h2">
                {" "}
                {statistics?.stockList
                  ? new Set(statistics.stockList.map((item) => item.pid)).size
                  : 0}
              </TypoGreen>
            </Grid>
          </Grid>
        </CardContent>
        
      </Card>
    );
  };