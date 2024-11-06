import React, { useEffect, useState } from "react";
import {
  Button, CircularProgress,
  Stack, Drawer,
  ListItem,

  List,
  ListItemText,
  Card,
  CardActions,
  CardContent,
  Chip,
  Tooltip,
  IconButton,
  CardMedia,
  CardHeader,
  Avatar
} from "@mui/material";
import { ApiReportFilters, ProductModel, customDateFormat } from "../../../../models/mymodels";
import {
  getReportAnddownloadPDF,
  getReportFromAPI
} from "../../../../services/user.service";
import { AxiosResponse } from "axios";
import { ReportFilterModel, ReportForOrdersModelHead, ReportModel, isDateRangeType, reportComponents } from "../Reports/Models/AllInterfaces";
import { DrawFilter } from "../Reports/Filters/Functions/DrawFilter";
import { Refresh, FilterAltOff, MoreVert as MoreVertIcon, X } from "@mui/icons-material";
import { Item } from "./ReportingSection";

import * as XLSX from "xlsx";


export const ReportGenerator: React.FC<{ report: ReportModel; }> = ({ report }) => {

  const [choosenReport, setchoosenReport] = useState<ReportModel>(report);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  //const [data, setData] = useState<ProductModel[]>([]);
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const toggleFilterDrawer = () => {
    setFilterDrawerOpen(!isFilterDrawerOpen);
  };




  useEffect(() => {
    setchoosenReport(report);
  }, [report]);

  const updateFilters = (filterName: string, filterValue: any) => {
    setchoosenReport((prevReport) => {
      // Create a copy of the choosenReport state
      const updatedReport = { ...prevReport };

      // Find the filter object within the Filters array
      const filterIndex = updatedReport.filters.findIndex(
        (filter) => filter.name === filterName
      );

      if (filterIndex !== -1) {
        // Update the filter value
        updatedReport.filters[filterIndex].value = filterValue;
      }

      return updatedReport;
    });
  };

  const handleDeleteFilter = (filterName: string) => {
    setchoosenReport((prevReport) => {
      // Create a copy of the choosenReport state
      const updatedReport = { ...prevReport };

      // Find the filter object within the Filters array
      const filterIndex = updatedReport.filters.findIndex(
        (filter) => filter.name === filterName
      );

      if (filterIndex !== -1) {
        // Clear the filter value
        if (
          Array.isArray(updatedReport.filters[filterIndex].value) &&
          (updatedReport.filters[filterIndex].value as any[]).every((element) => typeof element === 'number')
        ) {
          updatedReport.filters[filterIndex].value = [] as number[];
        } else {
          updatedReport.filters[filterIndex].value = null;
        }





        // const filterType = updatedReport.filters[filterIndex].type;

        // if (filterType === 'daterange') {
        //   // Handle specific logic for "daterange" type, e.g., set both start and end date to null
        //   updatedReport.filters[filterIndex].value = {
        //     startDate: undefined,
        //     endDate: undefined,
        //   };
        // } else {

        //   updatedReport.filters[filterIndex].value = null;
        // }





      }

      return updatedReport;
    });
  };

  const clearAllFilters = () => {
    setchoosenReport((prevReport) => {
      // Create a copy of the choosenReport state
      const clearedReport = { ...prevReport };

      // Reset all filter values to an empty array if it's an array, otherwise set it to null
      clearedReport.filters.forEach((filter) => {
        filter.value = Array.isArray(filter.value) ? [] : null;
      });

      return clearedReport;
    });
  };

  const getValueToDisplayFromFilter = (filter: ReportFilterModel) => {
    const selectedValue = filter.value;

    if (!selectedValue) {
      return '';
    }

    if (isDateRangeType(selectedValue)) {
      let x: string = "";
      if (selectedValue.startDate && selectedValue.endDate) {
        x = 'From: ' + customDateFormat(selectedValue.startDate, "Datetime") + ' To: ' + customDateFormat(selectedValue.endDate, "Datetime");
      } else if (selectedValue.startDate) {
        x = 'From: ' + customDateFormat(selectedValue.startDate, "Datetime");
      } else if (selectedValue.endDate) {
        x = 'To: ' + customDateFormat(selectedValue.endDate, "Datetime");
      } else {
        // Handle the case where both startDate and endDate are undefined
        x = "No date range specified";
      }
      return x;
    }

    if (
      Array.isArray(selectedValue) &&
      selectedValue.length > 0 &&
      selectedValue.every((element) => typeof element === 'number')
    ) {
      if (filter.options && filter.options.length > 0) {
        // Map the array of selected values to their corresponding names
        const selectedNames = selectedValue.map((id) => {
          // Find the option based on the id
          const option = filter.options?.find(
            (option) => typeof option === 'object' && 'id' in option && option.id === id
          );

          // Check if the option is an object and has a 'name' property
          if (typeof option === 'object' && 'name' in option) {
            return option.name;
          } else if (typeof option === 'string') {
            return option; // Handle the case when the option is a string
          } else {
            return '';
          }
        });

        // Join the names into a single string
        const result = selectedNames.join(', ');

        return result;
      }
    }



    // If the value is not null or undefined and is a string
    if (typeof selectedValue === 'string') {
      // Check if options are available
      if (filter.options && filter.options.length > 0) {
        // Find the corresponding option based on the ID
        const option = filter.options?.find(
          (option) => typeof option === 'object' &&
            String(option.id) === selectedValue // Ensure proper string comparison
        );

        if (option && typeof option === 'object' && 'name' in option) {
          // Return the name property from the option
          return option.name;
        }

        if (option && typeof option === 'object' && 'locname' in option) {
          // Return the name property from the option
          return option.locname;
        }
        if (option && typeof option === 'object' && 'tendercode' in option) {
          // Return the name property from the option
          return option.tendercode;
        }
        if (option && typeof option === 'object' && 'fullname' in option) {
          // Return the name property from the option
          return option.fullname;
        }


      }


      // If options are not available or the corresponding option is not found, return the value (ID)
      return selectedValue;
    }

    return String(selectedValue);
  };

  const generateHTMLReport = async () => {
    setLoading(true);

    try {

      // const reportFilters: ApiReportFilters = {};

      // for (const filter of choosenReport.filters) {
      //   if (filter.value !== undefined &&
      //     filter.value !== null &&
      //     filter.value !== "") {
      //     if (!reportFilters[filter.apiparamname]) {
      //       reportFilters[filter.apiparamname] = [];
      //     }
      //     // console.log(filter.value,"test")
      //     reportFilters[filter.apiparamname]!.push(Number(filter.value));
      //   }
      // }
      // const reportFilters: ApiReportFilters = {};

      // for (const filter of choosenReport.filters) {
      //   if (filter.value !== undefined && filter.value !== null) {


      //     if (isDateRangeType(filter.value)) {
      //       // Directly assign startDate and endDate if they are valid
      //       reportFilters[filter.apiparamname] = [
      //         filter.value.startDate as Date,
      //         filter.value.endDate as Date
      //       ] as DateRangeType;
      //     } else if (filter.value !== "") {
      //       // For non-DateRangeType values that are not empty
      //       reportFilters[filter.apiparamname] = [Number(filter.value)];
      //     }
      //   }
      // }

      const reportFilters: ApiReportFilters = {};

      for (const filter of choosenReport.filters) {
        if (filter.value !== undefined && filter.value !== null) {
          if (typeof filter.value === 'string') {
            // Handle string type
            if (filter.value !== "") {
              reportFilters[filter.apiparamname] = [Number(filter.value)];
            }
          } else if (Array.isArray(filter.value) &&
            filter.value.length > 0 &&
            filter.value.every((element) => typeof element === 'number')
          ) {
            reportFilters[filter.apiparamname] = filter.value;
          }
          else if (isDateRangeType(filter.value)) {
            reportFilters[filter.apiparamname] = filter.value;
            // Directly assign startDate and endDate if they are valid
            // reportFilters[filter.apiparamname] = [
            //       filter.value.startDate as Date,
            //        filter.value.endDate as Date
            //       ] as DateRangeType;
          }
        }
      }


      // const reportFilters: ApiReportFilters = {};

      // for (const filter of choosenReport.filters) {
      //   if (filter.value !== undefined && filter.value !== null) {
      //     if (isDateRangeType(filter.value)) {
      //       // Check and set DateStart if it's a valid date
      //       if (filter.value.startDate !== undefined) {
      //         reportFilters['DateStart'] = filter.value.startDate;
      //       }
      //       // Check and set DateEnd if it's a valid date
      //       if (filter.value.endDate !== undefined) {
      //         reportFilters['DateEnd'] = filter.value.endDate;
      //       }
      //     } else if (filter.value !== "") {
      //       // For non-DateRangeType values that are not empty
      //       reportFilters[filter.apiparamname] = [Number(filter.value)];
      //     }
      //   }
      // }

      console.log(reportFilters);

      try {
        const response: AxiosResponse<any> = await getReportFromAPI(
          reportFilters,
          choosenReport.apiurl
        );
        setReportData(response.data);
        // Process the reportData as needed
      } catch (error: any) {
        // Add the ': any' type assertion here
        if (error.response) {
          // The request was made and the server responded with a non-2xx status code
          console.error("Request error:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.error("Request setup error:", error.message);
        }
      }

      // Make the API call using axios
      // const response = await getReportStock("",7,undefined);
      // Assuming the API response contains the data in an array format
      //   setData(response.data);
      // Show the report component
      setShowReport(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const generatePDFReport = async () => {
    try {
      const thereport = choosenReport;
      getReportAnddownloadPDF("data: data1", "report");
      //getReport("data: data1").then(
      //    (response) => {
      //        if (response.status === 200) {
      //            setReportData(response.data);
      //            downloadReport();
      //        } else {
      //            setReportData(null);
      //        }
      //    },
      //    (error) => {
      //        console.log(error, 'Error Loading Report');
      //        setReportData(null);
      //    }
      //);
      //{
      //    thereport.filters.map((filter, index) => {
      //        if (!filter.value) {
      //            return null; // Skip rendering if the filter value is null or empty
      //        }
      //        return (
      //            <li key={index}>
      //                {filter.name}: {filter.value}
      //            </li>
      //        );
      //    })
      //}
      // Make the API request to generate the report
      // const response = await getReport();
      // Retrieve the report data from the response
      //const report = response.data;
      // Set the report data to the component state
      // Automatically trigger the report download
    } catch (error) {
      // Handle any errors during the API request
      console.error("Error generating report:", error);
    }
  };

  let filteredReportData: Array<{ [key: string]: any }>;

  if (choosenReport.category === "Inventory") {
    filteredReportData = (reportData as ProductModel[])?.map(row => {
      const filteredRow = Object.fromEntries(
        Object.entries(row).filter(([key, value]) => value !== null && value !== undefined)
      );
      return filteredRow;
    });
  } else {
    filteredReportData = (reportData as ReportForOrdersModelHead)?.rows.map(row => {
      const filteredRow = Object.fromEntries(
        Object.entries(row).filter(([key, value]) => value !== null && value !== undefined)
      );
      return filteredRow;
    });
  }


  // // Filter out columns with all empty values
  // const filteredReportData = (reportData as ReportForOrdersModelHead)?.rows.map(row => {
  //   const filteredRow = Object.fromEntries(
  //     Object.entries(row).filter(([key, value]) => value !== null && value !== undefined)
  //   );
  //   return filteredRow;
  // });



  function fitToColumn(arrayOfArray: any[][]) {
    // get the maximum character of each column
    return arrayOfArray[0].map((_, i) => ({ wch: Math.max(...arrayOfArray.map(a2 => (a2[i] ? a2[i].toString().length : 0))) }));
  }

  const exportToExcel = () => {
    let transformedData: any[] = [];
    const columnsToInclude = choosenReport.columnsToInclude || []; // Get columns from ReportModel

    console.log("data_before_transf", filteredReportData);

    if (choosenReport.category === "Inventory" && choosenReport.componnentname === "ExpiredProducts") {
      // Transform data for Inventory -> ExpiredProducts case
      transformedData = filteredReportData.flatMap(row => {
        const { availableStockAnalysis, ...flatRow } = row;
        let result: any[] = [];

        if (Array.isArray(availableStockAnalysis)) {
          availableStockAnalysis.forEach(stockAnalysis => {
            const transformedRow = { ...flatRow, ...stockAnalysis };
            // Include only specified columns if columnsToInclude is set
            result.push(...filterDataByColumns([transformedRow], columnsToInclude));
          });
        } else {
          // Include only specified columns if columnsToInclude is set
          result.push(...filterDataByColumns([flatRow], columnsToInclude));
        }

        return result;
      })}
        else if (choosenReport.category === "Inventory" && choosenReport.shortname === "Level By Product/Location/Lot") {
      // Transform data for Inventory -> ExpiredProducts case
      transformedData = filteredReportData.flatMap(row => {
        const { availableStockAnalysis, ...flatRow } = row;
        let result: any[] = [];

        if (Array.isArray(availableStockAnalysis)) {
          availableStockAnalysis.forEach(stockAnalysis => {
            const transformedRow = { ...flatRow, ...stockAnalysis };
            // Include only specified columns if columnsToInclude is set
            result.push(...filterDataByColumns([transformedRow], columnsToInclude));
          });
        } else {
          // Include only specified columns if columnsToInclude is set
          result.push(...filterDataByColumns([flatRow], columnsToInclude));
        }

        return result;
      });
    }



    else {
      // Default transformation
      if (columnsToInclude.length > 0) {
        // Filter columns if columnsToInclude is set
        transformedData = filterDataByColumns(filteredReportData, columnsToInclude);
      } else {
        // No specific columns to include, keep all columns
        transformedData = filteredReportData.map(row => {
          return Object.fromEntries(
            Object.entries(row).filter(([key, value]) => value !== null && value !== undefined)
          );
        });
      }
    }

    console.log("data_after_transf", transformedData);

    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Convert JSON data to array of arrays
    const arrayOfArray: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Autofit columns
    worksheet['!cols'] = fitToColumn(arrayOfArray);

    // Calculate the range for the !autofilter based on the number of columns
    const lastColumnIndex = arrayOfArray[0].length - 1;
    const autofilterRange = `A1:${XLSX.utils.encode_col(lastColumnIndex)}1`;

    worksheet['!autofilter'] = { ref: autofilterRange }; // Autofilter Columns

    const workbook = XLSX.utils.book_new();
    const sanitizedSheetName = (choosenReport.category + '-' + choosenReport.shortname).slice(0, 30).replace(/[:\\\/?*\[\]]/g, ''); // Remove invalid characters
    XLSX.utils.book_append_sheet(workbook, worksheet, sanitizedSheetName);
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const now = new Date();
    const formattedDate = now.toLocaleString().replace(/[^0-9]/g, '');
    const fileName = `ims_exported_report_${formattedDate}.xlsx`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to filter data based on specified columns
  const filterDataByColumns = (data: any[], columns: string[]): any[] => {
    if (columns.length === 0) {
      // If columns is empty, return the data as is
      return data;
    }

    return data.map(row => {
      return Object.fromEntries(
        columns.map(col => [col, row[col] || '']) // Default to empty string if column is missing
      );
    });
  };


  // const exportToExcel = () => {

  //   if (choosenReport.category === "Inventory" &&  choosenReport.componnentname==="ExpiredProducts") {

  //   }else {

  //   }

  //   const worksheet = XLSX.utils.json_to_sheet(filteredReportData);

  //   // Assuming filteredReportData is an array of arrays
  //   const arrayOfArray: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //   worksheet['!cols'] = fitToColumn(arrayOfArray);  // Autofit columns

  //   // Calculate the range for the !autofilter based on the number of columns
  //   const lastColumnIndex = arrayOfArray[0].length - 1;
  //   const autofilterRange = `A1:${XLSX.utils.encode_col(lastColumnIndex)}1`;

  //   worksheet['!autofilter'] = { ref: autofilterRange }; // Autofilter Columns

  //   const workbook = XLSX.utils.book_new();
  //   const sanitizedSheetName = (choosenReport.category + '-' +choosenReport.shortname).slice(0, 30).replace(/[:\\\/?*\[\]]/g, ''); // Remove invalid characters
  //   XLSX.utils.book_append_sheet(workbook, worksheet, sanitizedSheetName);
  //   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  //   const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  //   const now = new Date();
  //   const formattedDate = now.toLocaleString().replace(/[^0-9]/g, '');
  //   const fileName = `ims_exported_report_${formattedDate}.xlsx`;
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = fileName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };



  const generateExcelReport = async () => {
    try {
      const thereport = choosenReport;
      getReportAnddownloadPDF("data: data1", "report");


      //getReport("data: data1").then(
      //    (response) => {
      //        if (response.status === 200) {
      //            setReportData(response.data);
      //            downloadReport();
      //        } else {
      //            setReportData(null);
      //        }
      //    },
      //    (error) => {
      //        console.log(error, 'Error Loading Report');
      //        setReportData(null);
      //    }
      //);
      //{
      //    thereport.filters.map((filter, index) => {
      //        if (!filter.value) {
      //            return null; // Skip rendering if the filter value is null or empty
      //        }
      //        return (
      //            <li key={index}>
      //                {filter.name}: {filter.value}
      //            </li>
      //        );
      //    })
      //}
      // Make the API request to generate the report
      // const response = await getReport();
      // Retrieve the report data from the response
      //const report = response.data;
      // Set the report data to the component state
      // Automatically trigger the report download
    } catch (error) {
      // Handle any errors during the API request
      console.error("Error generating report:", error);
    }





  };

  const downloadReport = () => {
    // Perform any necessary formatting or modifications to the report data before downloading
    // For example, you can convert the report data to a Blob or perform additional processing
    // Create a URL for the report data
    const reportUrl = URL.createObjectURL(
      new Blob([reportData], { type: "application/pdf" })
    );

    // Create a temporary link and trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = reportUrl;
    downloadLink.download = "report.pdf";
    downloadLink.click();
  };


  return (
    <>

      {/* Filter Drawer */}
      <Drawer anchor="right" open={isFilterDrawerOpen} onClose={toggleFilterDrawer}>
        <Card sx={{ minWidth: 345 }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: 'green' }} aria-label="recipe">
              F
            </Avatar>}
            action={<IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>}
            title="Filter Settings"
            subheader="Customize your report filters below" />
          <CardContent>

            {choosenReport.filters &&
              choosenReport.filters.some((filter) => filter.value) && (

                <Chip
                  onClick={clearAllFilters}
                  key={"indexclearallbtn"}
                  label={"Clear All"}
                  // onDelete={() => clearAllFilters}
                  variant="filled"
                  color="error"

                  size="medium"
                  icon={<FilterAltOff />}
                  sx={{ margin: 0.5 }} />

              )}

            <List>

              {choosenReport.filters.map((filter, index) => (
                <ListItem key={index}>
                  <ListItemText sx={{ pr: 2 }} primary={filter.name} secondary={"You can leave it empty"} />

                  <DrawFilter filter={filter} handleFilterChange={updateFilters} />
                </ListItem>
              ))}
            </List>
          </CardContent>

          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>


            {/* <Divider component="div" role="presentation">
             
            </Divider> */}

            <Button
              sx={{
                background: (theme) => theme.colors.secondary.dark,
                width: '95%',
              }}
              variant="contained"
              onClick={toggleFilterDrawer}
            >
              Close
            </Button>
          </CardActions>

        </Card>


      </Drawer>
      {/* First Stack for Report Filters */}
      <Stack
        direction={{ sm: "row" }}
        justifyContent="space-between"
        padding={2}
        alignItems="center"
        spacing={{ xs: 1, sm: 2, md: 2 }}
        sx={{ background: (theme) => theme.colors.primary.main }}
        flexWrap="wrap"
      >


        {choosenReport.filters.length > 0 && (
          <Button variant="contained"
            color="success"
            onClick={toggleFilterDrawer}>
            Show Filters
          </Button>


        )}






        {choosenReport.filters &&
          choosenReport.filters.some((filter) => {
            if (Array.isArray(filter.value)) {
              return filter.value.length > 0;
            } else {
              return filter.value !== null && filter.value !== undefined;
            }
          }) && (


            <Item>
              <label>Filters Applied</label>
              <div>
                {choosenReport.filters.map((filter, index) => {
                  // if (!filter.value) {
                  //   return null; // Skip rendering if the filter value is null or empty
                  // }

                  if (!filter.value || (Array.isArray(filter.value) && filter.value.length === 0)) {
                    return null; // Skip rendering if the filter value is null, undefined, or an empty array
                  }



                  return (
                    <Chip
                      key={index}
                      label={`${filter.name}: ${getValueToDisplayFromFilter(filter)}`}
                      onDelete={() => handleDeleteFilter(filter.name)}
                      variant="outlined"
                      color="primary"
                      size="small"
                      icon={<Refresh />}
                      sx={{ margin: 0.5 }} />
                  );
                })}
                <Chip
                  onClick={clearAllFilters}
                  key={"indexclearallbtn"}
                  label={"Clear All"}
                  // onDelete={() => clearAllFilters}
                  variant="filled"
                  color="error"
                  size="small"
                  icon={<FilterAltOff />}
                  sx={{ margin: 0.5 }} />


              </div>

            </Item>
          )}





        <Item>
          <label>Generate</label>
          <Tooltip title="Generate Screen Report">
            <IconButton onClick={generateHTMLReport}>
              {/* <ScreenReportIcon /> */}
              <CardMedia style={{ width: 32, height: 32 }} component='img' src={`${"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhLS0gTGljZW5zZTogQ0MwLiBNYWRlIGJ5IFNWRyBSZXBvOiBodHRwczovL3d3dy5zdmdyZXBvLmNvbS9zdmcvOTA3MzMvc2NyZWVuIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA0OTYuOCA0OTYuOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDk2LjggNDk2Ljg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBvbHlnb24gc3R5bGU9ImZpbGw6I0E1QkNDNDsiIHBvaW50cz0iMzAwLjgsNDQwLjQgMTk1LjIsNDQwLjQgMjEzLjYsMzQ0LjQgMjgyLjQsMzQ0LjQgIi8+Cjxwb2x5bGluZSBzdHlsZT0iZmlsbDojOERBQUIyOyIgcG9pbnRzPSIyMTYsMzQ0LjQgMjgyLjQsMzQ0LjQgMzAyLjQsNDQyLjggIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiNBRkM1Q0U7IiBkPSJNNDk2LDMzNy4yYzAsMTYuOC00LjgsMjMuMi0yMy4yLDIzLjJIMjMuMkM0LjgsMzYwLjQsMCwzNTQsMCwzMzcuMnYtMjY0YzAtMTYuOCwxMi44LTMyLjgsMzEuMi0zMi44CgloNDM0LjRjMTcuNiwwLDMxLjIsMTYsMzEuMiwzMi44djI2NEg0OTZ6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNFN0VFRjI7IiBkPSJNNDk2LDMyOC40YzAsMTYuOC00LjgsMjQtMjMuMiwyNEgyMy4yYy0xOC40LDAtMjMuMi04LTIzLjItMjR2LTI2NGMwLTE2LjgsMTIuOC0zMiwzMS4yLTMyaDQzNC40CgljMTcuNiwwLDMwLjQsMTUuMiwzMC40LDMyVjMyOC40eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojQzlEQUUyOyIgZD0iTTAsNjQuNGMwLTE2LjgsMTMuNi0zMiwzMS4yLTMyaDQzNC40YzE3LjYsMCwzMC40LDE1LjIsMzAuNCwzMnYyNjRjMCwxNi44LTQuOCwyNC0yMy4yLDI0SDIxNiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMDIzM0Y7IiBkPSJNNDY0LjgsMzIuNEgzMS4yQzEyLjgsMzIuNCwwLDQ3LjYsMCw2NC40djI0MGg0OTZ2LTI0MEM0OTYsNDcuNiw0ODMuMiwzMi40LDQ2NC44LDMyLjR6Ii8+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojMDAyMzNGOyIgcG9pbnRzPSIyNDgsMzI1LjIgMjU3LjYsMzM0LjggMjYzLjIsMzI5LjIgMjQ4LDMxNCAyMzIuOCwzMjkuMiAyMzguNCwzMzQuOCAJIi8+CjwvZz4KPHBhdGggc3R5bGU9ImZpbGw6Izk3RUQ2OTsiIGQ9Ik00ODAsMzA0LjRWNzUuNmMwLTEzLjYtMy4yLTI3LjItMTYuOC0yNy4ySDMyLjhDMTkuMiw0OC40LDE2LDYyLDE2LDc1LjZ2MjI4LjhINDgweiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojODdERDUwOyIgZD0iTTQ4MCwzMDQuNFY3NS42YzAtMTMuNi0zLjItMjcuMi0xNi44LTI3LjJIMzIuOGMtMTMuNiwwLTE2LDEzLjYtMTYsMjYuNCIvPgo8cmVjdCB4PSIxNiIgeT0iMjgwLjQiIHN0eWxlPSJmaWxsOiM4MEQzNTA7IiB3aWR0aD0iNDY0IiBoZWlnaHQ9IjI0Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNFN0VFRjI7IiBkPSJNMzU2LDQ1Mi40YzAsNS42LDAsMTItOC44LDEySDE0OS42Yy05LjYsMC04LjgtNi40LTguOC0xMmwwLDBjMC01LjYsOC0xMiwxNi44LTEyaDE4MS42CglDMzQ4LDQ0MC40LDM1Niw0NDYuOCwzNTYsNDUyLjRMMzU2LDQ1Mi40eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojQzlEQUUyOyIgZD0iTTM1Niw0NTMuMkwzNTYsNDUzLjJjMCw1LjYsMCwxMS4yLTguOCwxMS4ySDE0OS42Yy05LjYsMC04LjgtNS42LTguOC0xMS4ybDAsMCIvPgo8Zz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0U3RUVGMjsiIGN4PSIyMjMuMiIgY3k9IjM5Mi40IiByPSIzLjIiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0U3RUVGMjsiIGN4PSIyNDAiIGN5PSIzOTIuNCIgcj0iMy4yIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFN0VFRjI7IiBjeD0iMjU2IiBjeT0iMzkyLjQiIHI9IjMuMiIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTdFRUYyOyIgY3g9IjI3Mi44IiBjeT0iMzkyLjQiIHI9IjMuMiIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTdFRUYyOyIgY3g9IjIyMy4yIiBjeT0iNDA4LjQiIHI9IjMuMiIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTdFRUYyOyIgY3g9IjI0MCIgY3k9IjQwOC40IiByPSIzLjIiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0U3RUVGMjsiIGN4PSIyNTYiIGN5PSI0MDguNCIgcj0iMy4yIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFN0VFRjI7IiBjeD0iMjcyLjgiIGN5PSI0MDguNCIgcj0iMy4yIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFN0VFRjI7IiBjeD0iMjIzLjIiIGN5PSI0MjQuNCIgcj0iMy4yIi8+Cgk8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFN0VFRjI7IiBjeD0iMjQwIiBjeT0iNDI0LjQiIHI9IjMuMiIvPgoJPGNpcmNsZSBzdHlsZT0iZmlsbDojRTdFRUYyOyIgY3g9IjI1NiIgY3k9IjQyNC40IiByPSIzLjIiLz4KCTxjaXJjbGUgc3R5bGU9ImZpbGw6I0U3RUVGMjsiIGN4PSIyNzIuOCIgY3k9IjQyNC40IiByPSIzLjIiLz4KPC9nPgo8L3N2Zz4K"}`} />

            </IconButton>
          </Tooltip>

          {/* <Tooltip title="Generate PDF Report">
            <IconButton onClick={generatePDFReport}>
              <CardMedia style={{ width: 32, height: 32 }} component='img' src={`${"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhLS0gTGljZW5zZTogQ0MwLiBNYWRlIGJ5IFNWRyBSZXBvOiBodHRwczovL3d3dy5zdmdyZXBvLmNvbS9zdmcvMTAzMDM2L3BkZiAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgMzAzLjE4OCAzMDMuMTg4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMDMuMTg4IDMwMy4xODg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cG9seWdvbiBzdHlsZT0iZmlsbDojRThFOEU4OyIgcG9pbnRzPSIyMTkuODIxLDAgMzIuODQyLDAgMzIuODQyLDMwMy4xODggMjcwLjM0NiwzMDMuMTg4IDI3MC4zNDYsNTAuNTI1IAkiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGQjM0NDk7IiBkPSJNMjMwLjAxMywxNDkuOTM1Yy0zLjY0My02LjQ5My0xNi4yMzEtOC41MzMtMjIuMDA2LTkuNDUxYy00LjU1Mi0wLjcyNC05LjE5OS0wLjk0LTEzLjgwMy0wLjkzNgoJCWMtMy42MTUtMC4wMjQtNy4xNzcsMC4xNTQtMTAuNjkzLDAuMzU0Yy0xLjI5NiwwLjA4Ny0yLjU3OSwwLjE5OS0zLjg2MSwwLjMxYy0xLjMxNC0xLjM2LTIuNTg0LTIuNzY1LTMuODEzLTQuMjAyCgkJYy03LjgyLTkuMjU3LTE0LjEzNC0xOS43NTUtMTkuMjc5LTMwLjY2NGMxLjM2Ni01LjI3MSwyLjQ1OS0xMC43NzIsMy4xMTktMTYuNDg1YzEuMjA1LTEwLjQyNywxLjYxOS0yMi4zMS0yLjI4OC0zMi4yNTEKCQljLTEuMzQ5LTMuNDMxLTQuOTQ2LTcuNjA4LTkuMDk2LTUuNTI4Yy00Ljc3MSwyLjM5Mi02LjExMyw5LjE2OS02LjUwMiwxMy45NzNjLTAuMzEzLDMuODgzLTAuMDk0LDcuNzc2LDAuNTU4LDExLjU5NAoJCWMwLjY2NCwzLjg0NCwxLjczMyw3LjQ5NCwyLjg5NywxMS4xMzljMS4wODYsMy4zNDIsMi4yODMsNi42NTgsMy41ODgsOS45NDNjLTAuODI4LDIuNTg2LTEuNzA3LDUuMTI3LTIuNjMsNy42MDMKCQljLTIuMTUyLDUuNjQzLTQuNDc5LDExLjAwNC02LjcxNywxNi4xNjFjLTEuMTgsMi41NTctMi4zMzUsNS4wNi0zLjQ2NSw3LjUwN2MtMy41NzYsNy44NTUtNy40NTgsMTUuNTY2LTExLjgxNSwyMy4wMgoJCWMtMTAuMTYzLDMuNTg1LTE5LjI4Myw3Ljc0MS0yNi44NTcsMTIuNjI1Yy00LjA2MywyLjYyNS03LjY1Miw1LjQ3Ni0xMC42NDEsOC42MDNjLTIuODIyLDIuOTUyLTUuNjksNi43ODMtNS45NDEsMTEuMDI0CgkJYy0wLjE0MSwyLjM5NCwwLjgwNyw0LjcxNywyLjc2OCw2LjEzN2MyLjY5NywyLjAxNSw2LjI3MSwxLjg4MSw5LjQsMS4yMjVjMTAuMjUtMi4xNSwxOC4xMjEtMTAuOTYxLDI0LjgyNC0xOC4zODcKCQljNC42MTctNS4xMTUsOS44NzItMTEuNjEsMTUuMzY5LTE5LjQ2NWMwLjAxMi0wLjAxOCwwLjAyNC0wLjAzNiwwLjAzNy0wLjA1NGM5LjQyOC0yLjkyMywxOS42ODktNS4zOTEsMzAuNTc5LTcuMjA1CgkJYzQuOTc1LTAuODI1LDEwLjA4Mi0xLjUsMTUuMjkxLTEuOTc0YzMuNjYzLDMuNDMxLDcuNjIxLDYuNTU1LDExLjkzOSw5LjE2NGMzLjM2MywyLjA2OSw2Ljk0LDMuODE2LDEwLjY4NCw1LjExOQoJCWMzLjc4NiwxLjIzNyw3LjU5NSwyLjI0NywxMS41MjgsMi44ODZjMS45ODYsMC4yODQsNC4wMTcsMC40MTMsNi4wOTIsMC4zMzVjNC42MzEtMC4xNzUsMTEuMjc4LTEuOTUxLDExLjcxNC03LjU3CgkJQzIzMS4xMjcsMTUyLjc2NSwyMzAuNzU2LDE1MS4yNTcsMjMwLjAxMywxNDkuOTM1eiBNMTE5LjE0NCwxNjAuMjQ1Yy0yLjE2OSwzLjM2LTQuMjYxLDYuMzgyLTYuMjMyLDkuMDQxCgkJYy00LjgyNyw2LjU2OC0xMC4zNCwxNC4zNjktMTguMzIyLDE3LjI4NmMtMS41MTYsMC41NTQtMy41MTIsMS4xMjYtNS42MTYsMS4wMDJjLTEuODc0LTAuMTEtMy43MjItMC45MzctMy42MzctMy4wNjUKCQljMC4wNDItMS4xMTQsMC41ODctMi41MzUsMS40MjMtMy45MzFjMC45MTUtMS41MzEsMi4wNDgtMi45MzUsMy4yNzUtNC4yMjZjMi42MjktMi43NjIsNS45NTMtNS40MzksOS43NzctNy45MTgKCQljNS44NjUtMy44MDUsMTIuODY3LTcuMjMsMjAuNjcyLTEwLjI4NkMxMjAuMDM1LDE1OC44NTgsMTE5LjU4NywxNTkuNTY0LDExOS4xNDQsMTYwLjI0NXogTTE0Ni4zNjYsNzUuOTg1CgkJYy0wLjYwMi0zLjUxNC0wLjY5My03LjA3Ny0wLjMyMy0xMC41MDNjMC4xODQtMS43MTMsMC41MzMtMy4zODUsMS4wMzgtNC45NTJjMC40MjgtMS4zMywxLjM1Mi00LjU3NiwyLjgyNi00Ljk5MwoJCWMyLjQzLTAuNjg4LDMuMTc3LDQuNTI5LDMuNDUyLDYuMDA1YzEuNTY2LDguMzk2LDAuMTg2LDE3LjczMy0xLjY5MywyNS45NjljLTAuMjk5LDEuMzEtMC42MzIsMi41OTktMC45NzMsMy44ODMKCQljLTAuNTgyLTEuNjAxLTEuMTM3LTMuMjA3LTEuNjQ4LTQuODIxQzE0Ny45NDUsODMuMDQ4LDE0Ni45MzksNzkuNDgyLDE0Ni4zNjYsNzUuOTg1eiBNMTYzLjA0OSwxNDIuMjY1CgkJYy05LjEzLDEuNDgtMTcuODE1LDMuNDE5LTI1Ljk3OSw1LjcwOGMwLjk4My0wLjI3NSw1LjQ3NS04Ljc4OCw2LjQ3Ny0xMC41NTVjNC43MjEtOC4zMTUsOC41ODMtMTcuMDQyLDExLjM1OC0yNi4xOTcKCQljNC45LDkuNjkxLDEwLjg0NywxOC45NjIsMTguMTUzLDI3LjIxNGMwLjY3MywwLjc0OSwxLjM1NywxLjQ4OSwyLjA1MywyLjIyQzE3MS4wMTcsMTQxLjA5NiwxNjYuOTg4LDE0MS42MzMsMTYzLjA0OSwxNDIuMjY1egoJCSBNMjI0Ljc5MywxNTMuOTU5Yy0wLjMzNCwxLjgwNS00LjE4OSwyLjgzNy01Ljk4OCwzLjEyMWMtNS4zMTYsMC44MzYtMTAuOTQsMC4xNjctMTYuMDI4LTEuNTQyCgkJYy0zLjQ5MS0xLjE3Mi02Ljg1OC0yLjc2OC0xMC4wNTctNC42ODhjLTMuMTgtMS45MjEtNi4xNTUtNC4xODEtOC45MzYtNi42NzNjMy40MjktMC4yMDYsNi45LTAuMzQxLDEwLjM4OC0wLjI3NQoJCWMzLjQ4OCwwLjAzNSw3LjAwMywwLjIxMSwxMC40NzUsMC42NjRjNi41MTEsMC43MjYsMTMuODA3LDIuOTYxLDE4LjkzMiw3LjE4NkMyMjQuNTg4LDE1Mi41ODUsMjI0LjkxLDE1My4zMjEsMjI0Ljc5MywxNTMuOTU5eiIvPgoJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0ZCMzQ0OTsiIHBvaW50cz0iMjI3LjY0LDI1LjI2MyAzMi44NDIsMjUuMjYzIDMyLjg0MiwwIDIxOS44MjEsMCAJIi8+Cgk8Zz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojQTRBOUFEOyIgZD0iTTEyNi44NDEsMjQxLjE1MmMwLDUuMzYxLTEuNTgsOS41MDEtNC43NDIsMTIuNDIxYy0zLjE2MiwyLjkyMS03LjY1Miw0LjM4MS0xMy40NzIsNC4zODFoLTMuNjQzCgkJCXYxNS45MTdIOTIuMDIydi00Ny45NzloMTYuNjA2YzYuMDYsMCwxMC42MTEsMS4zMjQsMTMuNjUyLDMuOTcxQzEyNS4zMjEsMjMyLjUxLDEyNi44NDEsMjM2LjI3MywxMjYuODQxLDI0MS4xNTJ6CgkJCSBNMTA0Ljk4NSwyNDcuMzg3aDIuMzYzYzEuOTQ3LDAsMy40OTUtMC41NDYsNC42NDQtMS42NDFjMS4xNDktMS4wOTQsMS43MjMtMi42MDQsMS43MjMtNC41MjljMC0zLjIzOC0xLjc5NC00Ljg1Ny01LjM4Mi00Ljg1NwoJCQloLTMuMzQ4QzEwNC45ODUsMjM2LjM2LDEwNC45ODUsMjQ3LjM4NywxMDQuOTg1LDI0Ny4zODd6Ii8+CgkJPHBhdGggc3R5bGU9ImZpbGw6I0E0QTlBRDsiIGQ9Ik0xNzUuMjE1LDI0OC44NjRjMCw4LjAwNy0yLjIwNSwxNC4xNzctNi42MTMsMTguNTA5cy0xMC42MDYsNi40OTgtMTguNTkxLDYuNDk4aC0xNS41MjN2LTQ3Ljk3OQoJCQloMTYuNjA2YzcuNzAxLDAsMTMuNjQ2LDEuOTY5LDE3LjgzNiw1LjkwN0MxNzMuMTE5LDIzNS43MzcsMTc1LjIxNSwyNDEuNDI2LDE3NS4yMTUsMjQ4Ljg2NHogTTE2MS43NiwyNDkuMzI0CgkJCWMwLTQuMzk4LTAuODctNy42NTctMi42MDktOS43OGMtMS43MzktMi4xMjItNC4zODEtMy4xODMtNy45MjYtMy4xODNoLTMuNzczdjI2Ljg3N2gyLjg4OGMzLjkzOSwwLDYuODI2LTEuMTQzLDguNjY0LTMuNDMKCQkJQzE2MC44NDEsMjU3LjUyMywxNjEuNzYsMjU0LjAyOCwxNjEuNzYsMjQ5LjMyNHoiLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojQTRBOUFEOyIgZD0iTTE5Ni41NzksMjczLjg3MWgtMTIuNzY2di00Ny45NzloMjguMzU1djEwLjQwM2gtMTUuNTg5djkuMTU2aDE0LjM3NHYxMC40MDNoLTE0LjM3NAoJCQlMMTk2LjU3OSwyNzMuODcxTDE5Ni41NzksMjczLjg3MXoiLz4KCTwvZz4KCTxwb2x5Z29uIHN0eWxlPSJmaWxsOiNEMUQzRDM7IiBwb2ludHM9IjIxOS44MjEsNTAuNTI1IDI3MC4zNDYsNTAuNTI1IDIxOS44MjEsMCAJIi8+CjwvZz4KPC9zdmc+Cg=="}`} />

            </IconButton>
          </Tooltip> */}



          {reportData && (
            <Tooltip title="Generate Excel Report">

              <IconButton hidden={reportData === null} disabled={reportData === null} onClick={exportToExcel}>
                <CardMedia style={{ width: 32, height: 32 }} component='img' src={`data:image/svg+xml;base64, ${"PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDMyIDMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjQuNDk0IiB5MT0iLTIwOTIuMDg2IiB4Mj0iMTMuODMyIiB5Mj0iLTIwNzUuOTE0IiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDAgMjEwMCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxODg4NGYiLz48c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjMTE3ZTQzIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMGI2NjMxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTE5LjU4MSAxNS4zNSA4LjUxMiAxMy40djE0LjQwOUExLjE5MiAxLjE5MiAwIDAgMCA5LjcwNSAyOWgxOS4xQTEuMTkyIDEuMTkyIDAgMCAwIDMwIDI3LjgwOVYyMi41WiIgc3R5bGU9ImZpbGw6IzE4NWMzNyIvPjxwYXRoIGQ9Ik0xOS41ODEgM0g5LjcwNWExLjE5MiAxLjE5MiAwIDAgMC0xLjE5MyAxLjE5MVY5LjVMMTkuNTgxIDE2bDUuODYxIDEuOTVMMzAgMTZWOS41WiIgc3R5bGU9ImZpbGw6IzIxYTM2NiIvPjxwYXRoIGQ9Ik04LjUxMiA5LjVoMTEuMDY5VjE2SDguNTEyWiIgc3R5bGU9ImZpbGw6IzEwN2M0MSIvPjxwYXRoIGQ9Ik0xNi40MzQgOC4ySDguNTEydjE2LjI1aDcuOTIyYTEuMiAxLjIgMCAwIDAgMS4xOTQtMS4xOTFWOS4zOTFBMS4yIDEuMiAwIDAgMCAxNi40MzQgOC4yWiIgc3R5bGU9Im9wYWNpdHk6LjEwMDAwMDAwMTQ5MDExNjEyO2lzb2xhdGlvbjppc29sYXRlIi8+PHBhdGggZD0iTTE1Ljc4MyA4Ljg1SDguNTEyVjI1LjFoNy4yNzFhMS4yIDEuMiAwIDAgMCAxLjE5NC0xLjE5MVYxMC4wNDFhMS4yIDEuMiAwIDAgMC0xLjE5NC0xLjE5MVoiIHN0eWxlPSJvcGFjaXR5Oi4yMDAwMDAwMDI5ODAyMzIyNDtpc29sYXRpb246aXNvbGF0ZSIvPjxwYXRoIGQ9Ik0xNS43ODMgOC44NUg4LjUxMlYyMy44aDcuMjcxYTEuMiAxLjIgMCAwIDAgMS4xOTQtMS4xOTFWMTAuMDQxYTEuMiAxLjIgMCAwIDAtMS4xOTQtMS4xOTFaIiBzdHlsZT0ib3BhY2l0eTouMjAwMDAwMDAyOTgwMjMyMjQ7aXNvbGF0aW9uOmlzb2xhdGUiLz48cGF0aCBkPSJNMTUuMTMyIDguODVoLTYuNjJWMjMuOGg2LjYyYTEuMiAxLjIgMCAwIDAgMS4xOTQtMS4xOTFWMTAuMDQxYTEuMiAxLjIgMCAwIDAtMS4xOTQtMS4xOTFaIiBzdHlsZT0ib3BhY2l0eTouMjAwMDAwMDAyOTgwMjMyMjQ7aXNvbGF0aW9uOmlzb2xhdGUiLz48cGF0aCBkPSJNMy4xOTQgOC44NWgxMS45MzhhMS4xOTMgMS4xOTMgMCAwIDEgMS4xOTQgMS4xOTF2MTEuOTE4YTEuMTkzIDEuMTkzIDAgMCAxLTEuMTk0IDEuMTkxSDMuMTk0QTEuMTkyIDEuMTkyIDAgMCAxIDIgMjEuOTU5VjEwLjA0MUExLjE5MiAxLjE5MiAwIDAgMSAzLjE5NCA4Ljg1WiIgc3R5bGU9ImZpbGw6dXJsKCNhKSIvPjxwYXRoIGQ9Im01LjcgMTkuODczIDIuNTExLTMuODg0LTIuMy0zLjg2MmgxLjg0N0w5LjAxMyAxNC42Yy4xMTYuMjM0LjIuNDA4LjIzOC41MjRoLjAxN2MuMDgyLS4xODguMTY5LS4zNjkuMjYtLjU0NmwxLjM0Mi0yLjQ0N2gxLjdsLTIuMzU5IDMuODQgMi40MTkgMy45MDVoLTEuODA5bC0xLjQ1LTIuNzExQTIuMzU1IDIuMzU1IDAgMCAxIDkuMiAxNi44aC0uMDI0YTEuNjg4IDEuNjg4IDAgMCAxLS4xNjguMzUxbC0xLjQ5MyAyLjcyMloiIHN0eWxlPSJmaWxsOiNmZmYiLz48cGF0aCBkPSJNMjguODA2IDNoLTkuMjI1djYuNUgzMFY0LjE5MUExLjE5MiAxLjE5MiAwIDAgMCAyOC44MDYgM1oiIHN0eWxlPSJmaWxsOiMzM2M0ODEiLz48cGF0aCBkPSJNMTkuNTgxIDE2SDMwdjYuNUgxOS41ODFaIiBzdHlsZT0iZmlsbDojMTA3YzQxIi8+PC9zdmc+"}`} />

              </IconButton>

            </Tooltip>
          )}
        </Item>



      </Stack>

      <div >

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (

          <div >
            {showReport && reportComponents[choosenReport.componnentname] &&
              React.createElement(reportComponents[choosenReport.componnentname], { data: reportData })}
          </div>

        )}

      </div>
    </>
  );
};
