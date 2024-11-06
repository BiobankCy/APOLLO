import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Card, Divider, Typography } from "@mui/material";
import {
  LocationModel,
  LocBuildingModel,
  LocRoomModel,
} from "src/models/mymodels";
import LocationsTable from "./Table";
import {
  getAllLocations,
  getAllBuildings,
  getAllRooms,
} from "src/services/user.service";
import BuildingsTable from "src/content/applications/Buildings/Table";
import RoomsTable from "src/content/applications/Rooms/Table";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function ApiGetAllRows() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [locationsList, setLocationsList] = useState<LocationModel[]>([]);
  const [buildingsList, setbuildingsList] = useState<LocBuildingModel[]>([]);
  const [roomsList, setroomsList] = useState<LocRoomModel[]>([]);

  useEffect(() => {
    //   console.log(value);

    switch (value) {
      case 0:
        {
          getAllBuildings().then(
            (response) => {
              setbuildingsList(response.data);
            },
            (error) => {
              setbuildingsList([]);
            },
          );
        }
        break;

      case 1:
        {
          //get all rooms
          getAllRooms().then(
            (response) => {
              setroomsList(response.data);
            },
            (error) => {
              setroomsList([]);
            },
          );
        }
        break;

      case 2:
        {
          getAllLocations().then(
            (response) => {
              setLocationsList(response.data);
            },
            (error) => {
              setLocationsList([]);
            },
          );
        }
        break;

      default: {
        break;
      }
    }
  }, [value]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
          marginTop: 2,
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Buildings" {...a11yProps(0)} />
          <Tab label="Rooms" {...a11yProps(1)} />
          <Tab label="Locations" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Card>
          <BuildingsTable
            buildingsList={buildingsList}
            updateBuildingsList={setbuildingsList}
          />
        </Card>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Card>
          <RoomsTable
            buildingsList={buildingsList}
            roomsList={roomsList}
            updateRoomsList={setroomsList}
          />
        </Card>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Card>
          <LocationsTable
            locsList={locationsList}
            updateLocationsList={setLocationsList}
          />
        </Card>
      </TabPanel>
    </Box>
  );
}
