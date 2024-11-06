import React, { useState } from "react";
import { read, utils, writeFile } from "xlsx";

import { Helmet } from "react-helmet-async";

import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { SyntheticEvent } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Footer from "src/Components/Footer";
import {
  Brandmodel,
  CategoryModel,
  InventoryRowsFromExcel,
  LocationModel,
  LocBuildingModel,
  LocRoomModel,
  LocTypeModel,
  StorageConditionModel,
  SubCategoryModel,
} from "../../../models/mymodels";

import {
  addNewBrandsBulk,
  addNewBuildingsBulk,
  addNewCategoriesBulk,
  addNewProductsFromExcelBulk,
  addNewStorageConditionsBulk,
} from "../../../services/user.service";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const storageConditionsConverted = (
  excelrows: InventoryRowsFromExcel[],
): StorageConditionModel[] => {
  let newlist: StorageConditionModel[] = [];
  //  const storageConditionsList: string[] = [...new Set(excelrows.map(row => row.Storage_Conditions?.toUpperCase() ?? ""))];
  const storageConditionsList: string[] = [
    ...new Set(
      excelrows.map(
        (row) => row.Storage_Conditions?.trim().toUpperCase() ?? "",
      ),
    ),
  ].sort((a, b) => a.localeCompare(b));
  // const storageConditionsList: string[] = [...new Set(excelrows.map(row => row.Storage_Conditions?.trim().toUpperCase() ?? ""))];
  storageConditionsList.forEach((stocond) => {
    newlist.push({
      id: "0",
      name: stocond,
      description: "",
    });
  });

  return newlist;
};
const brandsConverted = (excelrows: InventoryRowsFromExcel[]): Brandmodel[] => {
  let newlist: Brandmodel[] = [];
  const distinctList: string[] = [
    ...new Set(excelrows.map((row) => row.Brand?.trim().toUpperCase() ?? "")),
  ].sort((a, b) => a.localeCompare(b));
  // const storageConditionsList: string[] = [...new Set(excelrows.map(row => row.Brand?.trim().toUpperCase() ?? ""))];
  distinctList.forEach((stocond) => {
    newlist.push({
      id: 0,
      name: stocond,
      descr: "",
    });
  });

  return newlist;
};
const categoriesConverted = (
  excelrows: InventoryRowsFromExcel[],
): CategoryModel[] => {
  let newlist: CategoryModel[] = [];
  const distinctList: string[] = [
    ...new Set(
      excelrows.map((row) => row.Category?.trim().toUpperCase() ?? ""),
    ),
  ].sort((a, b) => a.localeCompare(b));

  // const storageConditionsList: string[] = [...new Set(excelrows.map(row => row.Brand?.trim().toUpperCase() ?? ""))];
  distinctList.forEach((stocond) => {
    const subCategoriesall: string[] = [
      ...new Set(
        excelrows
          .filter(
            (row) =>
              row.Category?.trim().toLowerCase() === stocond.toLowerCase(),
          )
          .map((row) => row.Sub_category?.trim().toUpperCase() ?? ""),
      ),
    ].sort((a, b) => a.localeCompare(b));

    //     const subCategoriesall = Array.from(new Set(excelrows.filter(p => p.category && p.category.trim().toLowerCase() === stocond.toLowerCase()).map(p => p.Sub_category))).sort((a, b) => a.localeCompare(b));
    // const subCategoriesall = Array.from(new Set(excelrows.filter(p => p.category.trim().toLowerCase() === stocond.toLowerCase()).map(p => p.Sub_category)));
    let subcatlist: SubCategoryModel[] = [];
    subCategoriesall.forEach((subcatname) => {
      if (subcatname.length > 0) {
        subcatlist.push({
          id: "0",
          name: subcatname,
          descr: "",
          catid: 0,
        });
      }
    });
    newlist.push({
      id: "0",
      name: stocond,
      descr: "",
      productsubcategories: subcatlist,
    });
  });

  //distinctList.forEach((line: string | undefined, index) => {

  //    let catname: string = line ?? "";
  //    catname = catname.trim();
  //    if (catname.length > 0) {

  //        // const subCategories = Array.from(new Set(inventory_rows.filter(p => p.Category === catname.toLowerCase()).map(p => p.Sub_category)));
  //        const subCategoriesall = Array.from(new Set(inventory_rows.filter((p: any) => (p.Category as string ?? "").toLowerCase() === catname.toLowerCase()).map((p: any) => p.Sub_category)));

  //        let subcatlist: SubCategoryModel[] = [];
  //        subCategoriesall.forEach((line: string | undefined, index) => {
  //            let subcatname: string = line ?? "";
  //            subcatname = subcatname.trim();
  //            if (subcatname.length > 0) {
  //                subcatlist.push({
  //                    id: "0",
  //                    name: subcatname,
  //                    descr: "",
  //                    catid: 0
  //                });
  //            }
  //        });

  //        catlist.push(
  //            {
  //                id: index.toString(),
  //                name: catname,
  //                descr: "",
  //                productsubcategories: subcatlist
  //            });
  //    }

  //});

  return newlist;
};

//const buildingsConverted = (
//    excelrows: InventoryRowsFromExcel[]
//): LocBuildingModel[] => {
//    let newlist: LocBuildingModel[] = [];
//    const distinctList: string[] = [...new Set(excelrows.map(row => row.Building?.trim().toUpperCase() ?? ""))].sort((a, b) => a.localeCompare(b));

//    distinctList.forEach(building => {

//        const roomsForThebuilding: string[] = [...new Set(excelrows.filter(row => row.Building?.trim().toLowerCase() === building.toLowerCase()).map(row => row.Room?.trim().toUpperCase() ?? ""))].sort((a, b) => a.localeCompare(b));
//       let roomsList: LocRoomModel[] = [];
//        roomsForThebuilding.forEach(roomname => {
//            if (roomname.length > 0) {
//                roomsList.push({
//                    id: "0",
//                    name: roomname,
//                    descr: "",
//                    catid: 0
//                });
//            }

//        })
//        newlist.push({
//            id: "0",
//            name: building,
//            descr: "",
//            productsubcategories: roomsList
//        });
//    });

//    return newlist;
//};

function convertToBuildingsNewFN(inventory_rows: InventoryRowsFromExcel[]) {
  let buildslist: LocBuildingModel[] = [];

  let unique_buildings = [
    ...new Set(
      inventory_rows.map((element: any) =>
        (element.Building?.toString() ?? "").toUpperCase(),
      ),
    ),
  ];

  unique_buildings.forEach((line: string | undefined, index) => {
    let buildingname: string = line ?? "";
    buildingname = buildingname.trim();
    if (buildingname.length > 0) {
      //locsforroom.push({
      //    id: 0,
      //    locname: "testloc1",
      //    loctype: loctype1,
      //    roomid: 0,
      //    loctypeid: 0,
      //    descr: "",
      //    activestatusFlag: true
      //});
      //locsforroom.push({
      //    id: 0,
      //    locname: "testloc2",
      //    loctype: loctype1,
      //    roomid: 0,
      //    loctypeid: 0,
      //    descr: "",
      //    activestatusFlag: true
      //});

      const roomsForTheBuilding = Array.from(
        new Set(
          inventory_rows
            .filter(
              (p: any) =>
                (p.Building?.toString() ?? "").toLowerCase() ===
                buildingname.toLowerCase(),
            )
            .map((p: any) => (p.Room?.toString() ?? "").toUpperCase()),
        ),
      );
      //  console.log(roomsForTheBuilding, 'rooms');
      let newroomslist: LocRoomModel[] = [];

      roomsForTheBuilding.forEach((line: string | undefined, index) => {
        let newroom_namename: string = line ?? "";
        newroom_namename = (newroom_namename?.toString() ?? "")
          .toUpperCase()
          .trim();

        console.log(newroom_namename, "room");
        if (newroom_namename.length > 0) {
          const locationsForTheRoom = Array.from(
            new Set(
              inventory_rows
                .filter(
                  (p: any) =>
                    (p.Building?.toString() ?? "").toLowerCase() ===
                    buildingname.toLowerCase() &&
                    (p.Room?.toString() ?? "").toLowerCase() ===
                    newroom_namename.toLowerCase(),
                )
                .map((p: any) => (p.Locname?.toString() ?? "").toUpperCase()),
            ),
          );
          console.log(locationsForTheRoom, "locations");
          //   let locsforroom: LocationModel[] = [];
          let locsforroom: LocationModel[] = [];
          locationsForTheRoom.forEach((line: string | undefined, index) => {
            let newloc_namename: string = line ?? "";
            newloc_namename = (newloc_namename?.toString() ?? "")
              .toUpperCase()
              .trim();
            if (newloc_namename.length > 0) {
              const loctypeForTheLocation = Array.from(
                new Set(
                  inventory_rows
                    .filter(
                      (p: any) =>
                        (p.Building?.toString() ?? "").toLowerCase() ===
                        buildingname.toLowerCase() &&
                        (p.Room?.toString() ?? "").toLowerCase() ===
                        newroom_namename.toLowerCase() &&
                        (p.Locname?.toString() ?? "").toLowerCase() ===
                        newloc_namename.toLowerCase(),
                    )
                    .map((p: any) =>
                      (p.Loctype?.toString() ?? "").toUpperCase(),
                    ),
                ),
              );

              let loctype1: LocTypeModel;
              loctype1 = {
                id: 0,
                loctype: (loctypeForTheLocation[0]?.toString() ?? "")
                  .toUpperCase()
                  .trim(),
                activestatus_flag: true,
              };

              //   loctype1 = { id: 0, loctype: "test1", activestatus_flag: true };

              locsforroom.push({
                id: 0,
                locname: newloc_namename,
                loctype: loctype1,
                roomid: 0,
                loctypeid: 0,
                descr: "",
                activestatusFlag: true,
              });
            }
          });

          newroomslist.push({
            id: 0,
            room: newroom_namename,
            descr: "",
            buildingid: 0,
            locations: locsforroom,
          });
        }
      });

      //rooms.push({
      //    id: 0,
      //    room: "testroom1",
      //    descr: "",
      //    buildingid: 0,
      //    locations: locsforroom,
      //});

      //rooms.push({
      //    id: 0,
      //    room: "testroom2",
      //    descr: "",
      //    buildingid: 0,
      //    locations: locsforroom,
      //});

      buildslist.push({
        id: index,
        building: buildingname,
        descr: "",
        locrooms: newroomslist,
      });
    }
  });
  return buildslist;
}
function convertToBuildingsFN(inventory_rows: unknown[]) {
  let buildslist: LocBuildingModel[] = [];

  let unique_buildings = [
    ...new Set(
      inventory_rows.map((element: any) =>
        (element.Building?.toString() ?? "").toUpperCase(),
      ),
    ),
  ];

  unique_buildings.forEach((line: string | undefined, index) => {
    let buildingname: string = line ?? "";
    buildingname = buildingname.trim();
    if (buildingname.length > 0) {
      //locsforroom.push({
      //    id: 0,
      //    locname: "testloc1",
      //    loctype: loctype1,
      //    roomid: 0,
      //    loctypeid: 0,
      //    descr: "",
      //    activestatusFlag: true
      //});
      //locsforroom.push({
      //    id: 0,
      //    locname: "testloc2",
      //    loctype: loctype1,
      //    roomid: 0,
      //    loctypeid: 0,
      //    descr: "",
      //    activestatusFlag: true
      //});

      const roomsForTheBuilding = Array.from(
        new Set(
          inventory_rows
            .filter(
              (p: any) =>
                (p.Building?.toString() ?? "").toLowerCase() ===
                buildingname.toLowerCase(),
            )
            .map((p: any) => (p.Room?.toString() ?? "").toUpperCase()),
        ),
      );
      //  console.log(roomsForTheBuilding, 'rooms');
      let newroomslist: LocRoomModel[] = [];

      roomsForTheBuilding.forEach((line: string | undefined, index) => {
        let newroom_namename: string = line ?? "";
        newroom_namename = (newroom_namename?.toString() ?? "")
          .toUpperCase()
          .trim();

        console.log(newroom_namename, "room");
        if (newroom_namename.length > 0) {
          const locationsForTheRoom = Array.from(
            new Set(
              inventory_rows
                .filter(
                  (p: any) =>
                    (p.Building?.toString() ?? "").toLowerCase() ===
                    buildingname.toLowerCase() &&
                    (p.Room?.toString() ?? "").toLowerCase() ===
                    newroom_namename.toLowerCase(),
                )
                .map((p: any) => (p.Locname?.toString() ?? "").toUpperCase()),
            ),
          );
          console.log(locationsForTheRoom, "locations");
          //   let locsforroom: LocationModel[] = [];
          let locsforroom: LocationModel[] = [];
          locationsForTheRoom.forEach((line: string | undefined, index) => {
            let newloc_namename: string = line ?? "";
            newloc_namename = (newloc_namename?.toString() ?? "")
              .toUpperCase()
              .trim();
            if (newloc_namename.length > 0) {
              const loctypeForTheLocation = Array.from(
                new Set(
                  inventory_rows
                    .filter(
                      (p: any) =>
                        (p.Building?.toString() ?? "").toLowerCase() ===
                        buildingname.toLowerCase() &&
                        (p.Room?.toString() ?? "").toLowerCase() ===
                        newroom_namename.toLowerCase() &&
                        (p.Locname?.toString() ?? "").toLowerCase() ===
                        newloc_namename.toLowerCase(),
                    )
                    .map((p: any) =>
                      (p.Loctype?.toString() ?? "").toUpperCase(),
                    ),
                ),
              );

              let loctype1: LocTypeModel;
              loctype1 = {
                id: 0,
                loctype: (loctypeForTheLocation[0]?.toString() ?? "")
                  .toUpperCase()
                  .trim(),
                activestatus_flag: true,
              };

              //   loctype1 = { id: 0, loctype: "test1", activestatus_flag: true };

              locsforroom.push({
                id: 0,
                locname: newloc_namename,
                loctype: loctype1,
                roomid: 0,
                loctypeid: 0,
                descr: "",
                activestatusFlag: true,
              });
            }
          });

          newroomslist.push({
            id: 0,
            room: newroom_namename,
            descr: "",
            buildingid: 0,
            locations: locsforroom,
          });
        }
      });

      //rooms.push({
      //    id: 0,
      //    room: "testroom1",
      //    descr: "",
      //    buildingid: 0,
      //    locations: locsforroom,
      //});

      //rooms.push({
      //    id: 0,
      //    room: "testroom2",
      //    descr: "",
      //    buildingid: 0,
      //    locations: locsforroom,
      //});

      buildslist.push({
        id: index,
        building: buildingname,
        descr: "",
        locrooms: newroomslist,
      });
    }
  });
  return buildslist;
}
//function convertToCategoriesFN(inventory_rows: unknown[]) {
//    let catlist: CategoryModel[] = [];

//    let unique_categories = [
//        ...new Set(inventory_rows.map((element: any) => element.Category)),
//    ];

//    unique_categories.forEach((line: string | undefined, index) => {

//        let catname: string = line ?? "";
//        catname = catname.trim();
//        if (catname.length > 0) {

//            // const subCategories = Array.from(new Set(inventory_rows.filter(p => p.Category === catname.toLowerCase()).map(p => p.Sub_category)));
//            const subCategoriesall = Array.from(new Set(inventory_rows.filter((p: any) => (p.Category as string ?? "").toLowerCase() === catname.toLowerCase()).map((p: any) => p.Sub_category)));

//            let subcatlist: SubCategoryModel[] = [];
//            subCategoriesall.forEach((line: string | undefined, index) => {
//                let subcatname: string = line ?? "";
//                subcatname = subcatname.trim();
//                if (subcatname.length > 0) {
//                    subcatlist.push({
//                        id: "0",
//                        name: subcatname,
//                        descr: "",
//                        catid: 0
//                    });
//                }
//            });

//            catlist.push(
//                {
//                    id: index.toString(),
//                    name: catname,
//                    descr: "",
//                    productsubcategories: subcatlist
//                });
//        }

//    });
//    return catlist;
//}

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
        <Box sx={{ p: 3 }}>
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

function TabsOfTables() {
  const [tabvalue, setTabValue] = useState(0);

  const [inventoryExcel, setInventoryExcel] = useState<
    InventoryRowsFromExcel[]
  >([]);
  /*  const [storageconditions, setStorageconditions] = useState<StorageConditionModel[]>([]);*/
  const [inventoryExcelInsertedInDB, setinventoryExcelInsertedInDB] =
    useState<boolean>(false);

  const storCondsGlobal = storageConditionsConverted(inventoryExcel);
  const [storageconditionsInsertedInDB, setstorageconditionsInsertedInDB] =
    useState<boolean>(false);
  const brandsGlobal = brandsConverted(inventoryExcel);
  const [brandsGlobalInsertedInDB, setbrandsGlobalInsertedInDB] =
    useState<boolean>(false);
  const categoriesGlobal = categoriesConverted(inventoryExcel);
  const [catsGlobalInsertedInDB, setcatsGlobalInsertedInDB] =
    useState<boolean>(false);
  const buildingsGlobal = convertToBuildingsNewFN(inventoryExcel);
  const [buildingsInsertedInDB, setbuildingsInsertedInDB] =
    useState<boolean>(false);

  /*   const [catsGlobalInsertedInDB, setcatsGlobalInsertedInDB] = useState<boolean>(false);*/

  const [locations, setLocations] = useState<any[]>([]);
  // const [inventory, setInventory] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  /*    const [categories, setCategories] = useState<CategoryModel[]>([]);*/
  //   const [locationsOrig, setlocationsOrig] = useState<LocationModel[]>([]);
  //    const [buildingsOrig, setbuildingsOrig] = useState<LocBuildingModel[]>([]);
  // const [roomsOrig, setroomsOrig] = useState<LocRoomModel[]>([]);

  const handleImport = ($event: any) => {
    setInventoryExcel([]);
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const wb = read(event.target.result);

          const sheets = wb.SheetNames;

          if (sheets.length) {
            //  const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
            const locs_rows = utils.sheet_to_json(wb.Sheets["Locations"]);
            setLocations(locs_rows);

            //const inventory_rows = utils.sheet_to_json(wb.Sheets['Inventory']);
            //console.log(inventory_rows);
            // setInventory(inventory_rows)

            let inventory_rows1 = utils.sheet_to_json<InventoryRowsFromExcel>(
              wb.Sheets["Inventory"],
            );
            //fix data
            for (let i = 0; i < inventory_rows1.length; i++) {
              for (let prop in inventory_rows1[i]) {
                const value = inventory_rows1[i]?.[prop];
                if (typeof value === "string") {
                  inventory_rows1[i][prop] = value.trim();
                }
              }
            }

            setInventoryExcel(inventory_rows1);
            // console.log(inventory_rows1, 'excelrows');

            const users_rows = utils.sheet_to_json(wb.Sheets["Users"]);
            setUsers(users_rows);

            //   setCategories(convertToCategoriesFN(inventory_rows));
            // setbuildingsOrig(convertToBuildingsFN(inventory_rows));
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const handleImportBrands = () => {
    setbrandsGlobalInsertedInDB(false);

    //  storageConditionsConverted(inventoryExcel).forEach((stcond) => { stcond.id = "0"; stcond.name = stcond.name.trim() });
    let finallist = brandsGlobal;
    if (finallist.length > 0) {
      addNewBrandsBulk(finallist).then(
        (response) => {
          //  setApiResponse(response);
          if (response.status === 200) {
            setbrandsGlobalInsertedInDB(true);
            console.log("All Brands Added");
          } else {
            //   setApiResponse(response);
            console.log(response.status, "Brands Not Added");
          }
        },
        (error) => {
          console.log(error, "Brands Not Added");
          // setApiResponse(error);
        },
      );
    } else {
      console.log("No Brands To Import!");
    }
  };
  const handleImportStorageConditions = () => {
    setstorageconditionsInsertedInDB(false);

    //  storageConditionsConverted(inventoryExcel).forEach((stcond) => { stcond.id = "0"; stcond.name = stcond.name.trim() });
    let finallist = storCondsGlobal;
    if (finallist.length > 0) {
      addNewStorageConditionsBulk(finallist).then(
        (response) => {
          //  setApiResponse(response);
          if (response.status === 200) {
            setstorageconditionsInsertedInDB(true);
            console.log("All Storage Conditions Added");
          } else {
            //   setApiResponse(response);
            console.log(response.status, "Storage Conditions Not Added");
          }
        },
        (error) => {
          console.log(error, "Storage Conditions Not Added");
          // setApiResponse(error);
        },
      );
    } else {
      console.log("No Storage Conditions To Import!");
    }
  };
  const handleImportCategories = () => {
    /*
        categories.forEach((category) => {

            addNewCategory(category).then(
                (response) => {
                    //  setApiResponse(response);
                    if (response.status === 200) {

                        console.log("OK Added", category.name);
                    }
                    else {
                        //   setApiResponse(response);
                        console.log(response.status, category.name);
                    }

                },
                (error) => {
                    console.log(error,category.name);
                    // setApiResponse(error);
                }
            );
        });*/

    setcatsGlobalInsertedInDB(false);

    categoriesGlobal.forEach((category) => {
      category.id = "0";
      category.name = category.name.trim();
    });

    if (categoriesGlobal.length > 0) {
      addNewCategoriesBulk(categoriesGlobal).then(
        (response) => {
          //  setApiResponse(response);
          if (response.status === 200) {
            setcatsGlobalInsertedInDB(true);
            console.log("All Categories Added");
          } else {
            //   setApiResponse(response);
            console.log(response.status, "Categories Not Added");
          }
        },
        (error) => {
          console.log(error, "Categories Not Added");
          // setApiResponse(error);
        },
      );
    } else {
      console.log("No Categories To Import!");
    }
  };
  const handleImportProducts = () => {
    /*
        categories.forEach((category) => {

            addNewCategory(category).then(
                (response) => {
                    //  setApiResponse(response);
                    if (response.status === 200) {

                        console.log("OK Added", category.name);
                    }
                    else {
                        //   setApiResponse(response);
                        console.log(response.status, category.name);
                    }

                },
                (error) => {
                    console.log(error,category.name);
                    // setApiResponse(error);
                }
            );
        });*/

    setinventoryExcelInsertedInDB(false);

    inventoryExcel.forEach((row) => {
      row.Product_Code = row.Product_Code?.toString().trim() ?? "";
      row.LOT = row.LOT?.toString().trim() ?? "";
      row.Stock_Quantity = row.Stock_Quantity?.toString().trim() ?? "";
      row.locid = row.locid?.toString().trim() ?? "";
      row.Minimum_Stock = row.Minimum_Stock?.toString().trim() ?? "";
      row.Price_exclVAT = row.Price_exclVAT?.toString().trim() ?? "";
      row.Room = row.Room?.toString().trim() ?? "";
      row.Expiry_Date = row.Expiry_Date?.toString().trim() ?? "";
      row.Product_Units = row.Product_Units?.toString().trim() ?? "";
      row.Tender = row.Tender?.toString().trim() ?? "";
    });

    if (inventoryExcel.length > 0) {
      // const firstTenItems = inventoryExcel.slice(0, 10);

      addNewProductsFromExcelBulk(inventoryExcel).then(
        (response) => {
          //  setApiResponse(response);
          if (response.status === 200) {
            setinventoryExcelInsertedInDB(true);
            console.log("All Products Added");
          } else {
            //   setApiResponse(response);
            console.log(response.status, "Products Not Added");
          }
        },
        (error) => {
          console.log(error, "Products Not Added");
          // setApiResponse(error);
        },
      );
    } else {
      console.log("No Products To Import!");
    }
  };
  const handleImportBuildings = () => {
    /*
        categories.forEach((category) => {

            addNewCategory(category).then(
                (response) => {
                    //  setApiResponse(response);
                    if (response.status === 200) {

                        console.log("OK Added", category.name);
                    }
                    else {
                        //   setApiResponse(response);
                        console.log(response.status, category.name);
                    }

                },
                (error) => {
                    console.log(error,category.name);
                    // setApiResponse(error);
                }
            );
        });*/

    setbuildingsInsertedInDB(false);

    buildingsGlobal.forEach((building) => {
      building.id = 0;
      building.building = building.building.trim();
    });

    if (buildingsGlobal.length > 0) {
      addNewBuildingsBulk(buildingsGlobal).then(
        (response) => {
          //  setApiResponse(response);
          if (response.status === 200) {
            setbuildingsInsertedInDB(true);
            console.log("All Buildings Added");
          } else {
            //   setApiResponse(response);
            console.log(response.status, "Buildings Not Added");
          }
        },
        (error) => {
          console.log(error, "Buildings Not Added");
          // setApiResponse(error);
        },
      );
    } else {
      console.log("No Buildings To Import!");
    }
  };
  const handleExport = () => {
    const headings = [["Movie", "Category", "Director", "Rating"]];
    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, headings);
    utils.sheet_add_json(ws, locations, { origin: "A2", skipHeader: true });
    utils.book_append_sheet(wb, ws, "Report");
    writeFile(wb, "Movie Report.xlsx");
  };

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title>Installation - IMS</title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Import Data" />
              <Divider />
              <CardContent>
                <Box sx={{ width: "100%" }}>
                  <div className="row mb-2 mt-5">
                    <div className="col-sm-6 offset-3">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-group">
                            <div className="custom-file">
                              <input
                                type="file"
                                name="file"
                                className="custom-file-input"
                                id="inputGroupFile"
                                required
                                onChange={handleImport}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="inputGroupFile"
                              >
                                Choose Excel file
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <button
                            onClick={handleExport}
                            className="btn btn-primary float-right"
                          >
                            Export <i className="fa fa-download"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    textColor="primary"
                    indicatorColor="primary"
                    value={tabvalue}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                  >
                    <Tab
                      label={"Locations (" + locations.length + ")"}
                      {...a11yProps(0)}
                    />
                    <Tab
                      label={"Inventory (" + inventoryExcel.length + ")"}
                      {...a11yProps(1)}
                    />
                    <Tab
                      label={"Users (" + users.length + ")"}
                      {...a11yProps(2)}
                    />
                    <Tab
                      label={"Categories (" + categoriesGlobal.length + ")"}
                      {...a11yProps(3)}
                    />
                    <Tab
                      label={"Buildings (" + buildingsGlobal.length + ")"}
                      {...a11yProps(4)}
                    />
                    <Tab
                      label={
                        "Storage Conditions (" + storCondsGlobal.length + ")"
                      }
                      {...a11yProps(5)}
                    />
                    <Tab
                      label={"Brands (" + brandsGlobal.length + ")"}
                      {...a11yProps(6)}
                    />
                  </Tabs>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <TabPanel value={tabvalue} index={0}>
          <div className="row">
            <div className="col-sm-6 offset-3">
              {/* Locations Readed*/}
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Building</th>
                    <th scope="col">Room</th>
                    <th scope="col">LocationName</th>
                    <th scope="col">LocType</th>
                    <th scope="col">r</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.length ? (
                    locations.map((movie, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{movie.Building}</td>
                        <td>{movie.Room}</td>
                        <td>{movie.LocationName}</td>
                        <td>{movie.LocType}</td>

                        <td>
                          <span className="badge bg-warning text-dark">
                            {movie.Rating}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Locations Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabvalue} index={1}>
          {/* Inventory Readed*/}

          <Stack sx={{ width: "100%" }} spacing={2}>
            <button
              hidden={inventoryExcel.length <= 0 || inventoryExcelInsertedInDB}
              onClick={handleImportProducts}
              className="btn btn-primary float-right"
            >
              Import Products And Inventory Now{" "}
              <i className="fa fa-download"></i>
            </button>

            <Alert hidden={!inventoryExcelInsertedInDB} severity="success">
              All Products Added!
            </Alert>
          </Stack>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Code</th>
                <th scope="col">Product</th>
                <th scope="col">Category</th>
                <th scope="col">Sub-category</th>

                <th scope="col">Brand</th>
                <th scope="col">Stock_Quantity</th>
                <th scope="col">LOT</th>

                <td scope="col">Expiry_Date</td>
                <td scope="col">Product_Units</td>
                <td scope="col">Price(�)-exclVAT</td>
                <td scope="col">VAT</td>
                <td scope="col">Supplier</td>
                <th scope="col">Tender</th>
                <th scope="col">Storage_Conditions</th>
                <th scope="col">Minimum_Stock</th>
                <th scope="col">Lab_Made_Flag</th>
                <th scope="col">Active_Flag</th>
                <th scope="col">Diagnostics_Flag</th>
              </tr>
            </thead>
            <tbody>
              {inventoryExcel.length ? (
                inventoryExcel.map((product, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.Product_Code}</td>
                    <td>{product.Product}</td>
                    <td>{product.Category}</td>
                    <td>{product.Sub_category}</td>

                    <td>{product.Brand}</td>
                    <td>{product.Stock_Quantity}</td>
                    <td>{product.LOT}</td>
                    <td>{product.Expiry_Date}</td>
                    <td>{product.Product_Units}</td>
                    <td>{product.Price_exclVAT}</td>
                    <td>{product.VAT_PERC}</td>
                    <td>{product.Supplier}</td>
                    <td>{product.Tender}</td>

                    <td>{product.Storage_Conditions}</td>
                    <td>{product.Minimum_Stock}</td>
                    <td>{product.Lab_Made_Flag}</td>
                    <td>{product.Active_Flag}</td>
                    <td>{product.Diagnostics_Flag}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={18} className="text-center">
                    No Products Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TabPanel>
        <TabPanel value={tabvalue} index={2}>
          <div className="row">
            <div className="col-sm-6 offset-3">
              {/* Users Readed*/}
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Firstname</th>
                    <th scope="col">Lastname</th>
                    <th scope="col">Email</th>
                    <th scope="col">System_Role</th>
                    <th scope="col">Job Role</th>
                    <th scope="col">Request</th>
                    <th scope="col">ApproveRequest</th>
                    <th scope="col">CreatePO</th>
                    <th scope="col">TransferStock</th>
                    <th scope="col">InventoryCount</th>
                    <th scope="col">ReceiveItems</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? (
                    users.map((user, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{user.Firstname}</td>
                        <td>{user.Lastname}</td>
                        <td>{user.Email}</td>
                        <td>{user.System_Role}</td>
                        <td>{user.Job_Role}</td>
                        <td>{user.Request}</td>
                        <td>{user.ApproveRequest}</td>
                        <td>{user.CreatePO}</td>
                        <td>{user.TransferStock}</td>
                        <td>{user.InventoryCount}</td>
                        <td>{user.ReceiveItems}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Users Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabvalue} index={3}>
          <div className="row">
            <div className="col-sm-6 offset-3">
              {/* Categories Readed*/}

              <Stack sx={{ width: "100%" }} spacing={2}>
                <button
                  hidden={
                    categoriesGlobal.length <= 0 || catsGlobalInsertedInDB
                  }
                  onClick={handleImportCategories}
                  className="btn btn-primary float-right"
                >
                  Import Categories Now <i className="fa fa-download"></i>
                </button>
                {/*<Alert severity="error">This is an error alert � check it out!</Alert>*/}
                {/*<Alert severity="warning">This is a warning alert � check it out!</Alert>*/}
                {/*<Alert severity="info">This is an info alert � check it out!</Alert>*/}
                <Alert hidden={!catsGlobalInsertedInDB} severity="success">
                  All Categories Added!
                </Alert>
              </Stack>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Category</th>
                    <th scope="col">Sub Categories</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesGlobal.length ? (
                    categoriesGlobal.map((category, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{category.name}</td>

                        <td>
                          {" "}
                          {category.productsubcategories
                            .map((subcategory) => subcategory.name)
                            .join(", ")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Categories Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabvalue} index={4}>
          <div className="row">
            <div className="col-sm-6 offset-3">
              {/* Custom Buildings Readed*/}

              <Stack sx={{ width: "100%" }} spacing={2}>
                <button
                  hidden={buildingsGlobal.length <= 0 || buildingsInsertedInDB}
                  onClick={handleImportBuildings}
                  className="btn btn-primary float-right"
                >
                  Import Buildings Now <i className="fa fa-download"></i>
                </button>
                {/*<Alert severity="error">This is an error alert � check it out!</Alert>*/}
                {/*<Alert severity="warning">This is a warning alert � check it out!</Alert>*/}
                {/*<Alert severity="info">This is an info alert � check it out!</Alert>*/}
                <Alert hidden={!buildingsInsertedInDB} severity="success">
                  All buildings Added!
                </Alert>
              </Stack>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Building</th>
                    <th scope="col">Rooms</th>
                    {/*{buildingsOrig?.map((building, index) => (*/}

                    {/*     building.locrooms?.map((room, index) => (*/}
                    {/*         <th scope="col">*/}
                    {/*             {room.room}*/}
                    {/*         </th>*/}

                    {/*            ))*/}

                    {/*))}*/}
                  </tr>
                </thead>
                <tbody>
                  {buildingsGlobal.length ? (
                    buildingsGlobal.map((building, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{building.building}</td>

                        {/*  <td> {building.locrooms?.map((room) => room.room).join(", ")}</td> */}

                        <td>
                          {building.locrooms &&
                            building.locrooms.length > 0 &&
                            building.locrooms?.map((room, index1) => {
                              return (
                                <React.Fragment key={room.room}>
                                  <Accordion>
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id={"panel1a-header" + room.room}
                                    >
                                      <Typography>{room.room}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <Typography>
                                        {room.locations &&
                                          room.locations.length > 0 &&
                                          room.locations?.map((loc, index2) => (
                                            <React.Fragment key={index2}>
                                              <Alert severity="info">
                                                {"Location: " + loc.locname}
                                                <br></br>
                                                {" Type: " +
                                                  loc.loctype?.loctype +
                                                  ""}
                                              </Alert>

                                              <Divider></Divider>
                                            </React.Fragment>
                                          ))}
                                      </Typography>
                                    </AccordionDetails>
                                  </Accordion>
                                </React.Fragment>
                              );
                            })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Buildings Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabvalue} index={5}>
          <div className="row">
            <div className="col-sm-6 offset-3">
              {/* Storage Conditions Readed*/}

              <Stack sx={{ width: "100%" }} spacing={2}>
                <button
                  hidden={
                    storCondsGlobal.length <= 0 || storageconditionsInsertedInDB
                  }
                  onClick={handleImportStorageConditions}
                  className="btn btn-primary float-right"
                >
                  Import Storage Conditions Now{" "}
                  <i className="fa fa-download"></i>
                </button>
                {/*<Alert severity="error">This is an error alert � check it out!</Alert>*/}
                {/*<Alert severity="warning">This is a warning alert � check it out!</Alert>*/}
                {/*<Alert severity="info">This is an info alert � check it out!</Alert>*/}
                <Alert
                  hidden={!storageconditionsInsertedInDB}
                  severity="success"
                >
                  All Storage Conditions Added!
                </Alert>
              </Stack>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Storage Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {storCondsGlobal.length ? (
                    storCondsGlobal.map((stcoond, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{stcoond.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Storage Conditions Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabvalue} index={6}>
          <div className="row">
            <div className="col-sm-6 offset-3">
              {/* Brands Readed*/}

              <Stack sx={{ width: "100%" }} spacing={2}>
                <button
                  hidden={brandsGlobal.length <= 0 || brandsGlobalInsertedInDB}
                  onClick={handleImportBrands}
                  className="btn btn-primary float-right"
                >
                  Import Brands Now <i className="fa fa-download"></i>
                </button>
                {/*<Alert severity="error">This is an error alert � check it out!</Alert>*/}
                {/*<Alert severity="warning">This is a warning alert � check it out!</Alert>*/}
                {/*<Alert severity="info">This is an info alert � check it out!</Alert>*/}
                <Alert hidden={!brandsGlobalInsertedInDB} severity="success">
                  All Brands Added!
                </Alert>
              </Stack>

              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Brand</th>
                  </tr>
                </thead>
                <tbody>
                  {brandsGlobal.length ? (
                    brandsGlobal.map((stcoond, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{stcoond.name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No Brands Found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
      </Container>
      <Footer />
    </>
  );
}

export default TabsOfTables;
