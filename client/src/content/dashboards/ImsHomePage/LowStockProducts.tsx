import {
  Button,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  Avatar,
  alpha,
  styled,
  Stack,
  CardActions,
} from "@mui/material";

import SendIcon from "@mui/icons-material/SendRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import {
  hasAdminAccess,
  POrderFormLine,
  ProductModel,
  StatisticsDTO,
} from "../../../models/mymodels";
import { useNavigate } from "react-router-dom";
import PurchaseOrderDialog from "../../../Components/Shared/Finalglobalpoformdialog";


import { useAuth } from "../../../contexts/UserContext";
import { useState } from "react";
import React from "react";
const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${theme.palette.mode === "dark"
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`,
);





function LowStockProducts(those: StatisticsDTO | null) {
  const navigate = useNavigate();
  const userContext = useAuth();
  const [isPurchaseOrderDialogOpen, setPurchaseOrderDialogOpen] =
    useState(false);

  const handleEditClick = (id: string) => {
    navigate(`/management/products/edit/${id}`); // Use navigate to navigate to the desired URL
  };
  const handleOrderClick = (id: string) => {
    setSelectedProducts([id]);
    //setSelectedProducts((prevSelected) => [
    //    ...prevSelected,
    //    id
    //]);
    setPurchaseOrderDialogOpen(true);
    //      navigate(`/management/products/edit/${id}`); // Use navigate to navigate to the desired URL
  };

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const applyFilterforPOForm = (
    prodList: ProductModel[],
    selectedids: string[],
  ): POrderFormLine[] => {
    return prodList
      .filter((x) => selectedids.includes(x.id))
      .map((product) => {
        const {
          id,
          code,
          name,
          vatId,
          vatRate,
          minstockqty,
          punits,
          availabletotalstockqty,
          defaultSupplierId,
          defaultSupplierName,

          costprice,
        } = product;

        return {
          id,
          code,
          name,
          orderQuantity: 1,
          requestlineid: 0,
          originalreqlineqty: 0,
          vatId,
          vatRate,
          minstockqty,
          punits,
          availabletotalstockqty,
          defaultSupplierId,
          defaultSupplierName,
          costprice,
          editableCostpriceFlag: product.forsequencingFlag,
        };
      });
  };
  const prepareSelectedProductsforPO = applyFilterforPOForm(
    those?.lowstockproducts ?? [],
    selectedProducts,
  );

  return (
    <>
      {isPurchaseOrderDialogOpen && (
        <PurchaseOrderDialog
          orderLines={prepareSelectedProductsforPO}
          onClose={() => setPurchaseOrderDialogOpen(false)}
          onOrderSent={() => setSelectedProducts([])}
        // onOrderSent={function (): void { setSelectedProducts([]) }}
        />
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3,
        }}
      >
        <Typography variant="h3">Low Stock Products</Typography>
        {/*<Button*/}
        {/*  size="small"*/}
        {/*  variant="outlined"*/}
        {/*  startIcon={<AddTwoToneIcon fontSize="small" />}*/}
        {/*>*/}
        {/*  Add new*/}
        {/*</Button>*/}
      </Box>

      <Grid container spacing={3}>
        {those?.lowstockproducts &&
          those.lowstockproducts.length > 0 &&
          those.lowstockproducts.map((product) => {
            return (
              <Grid key={product.id} xs={12} sm={6} md={3} item>
                <Card
                  sx={{
                    px: 1,
                  }}
                >
                  <CardContent>
                    <AvatarWrapper>
                      <img
                        alt={product.name}
                        src="/static/images/placeholders/logo/icon-256x256.gif"
                      />
                    </AvatarWrapper>

                    <Typography variant="h5"> {product.name} </Typography>
                    <Box
                      sx={{
                        pt: 3,
                      }}
                    >
                      <Typography variant="subtitle2" noWrap>
                        Code: {product.code}{" "}
                      </Typography>
                      <Typography variant="subtitle2" noWrap>
                        Available Stock: {product.availabletotalstockqty}{" "}
                      </Typography>
                      <Typography variant="subtitle2" noWrap>
                        Min. Stock: {product.minstockqty}{" "}
                      </Typography>
                      <Box
                        sx={{
                          pt: 1,
                        }}
                      >
                        {/*<Button*/}
                        {/*    size="small"*/}
                        {/*    variant="contained"*/}
                        {/*    startIcon={<SendIcon fontSize="small" />}*/}
                        {/*>*/}
                        {/*    Order Now!*/}
                        {/*</Button>*/}
                      </Box>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-start"
                        sx={{ pt: 1 }}
                      ></Stack>
                    </Box>
                  </CardContent>

                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "space-between", // Align buttons to the left and right
                    }}
                  >
                    {/* Edit button (conditionally rendered) */}
                    {hasAdminAccess(userContext?.currentUser) && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<EditIcon fontSize="small" />}
                        onClick={() => handleEditClick(product.id)}
                      >
                        Edit
                      </Button>
                    )}
                    {/* Order button (conditionally rendered) */}
                    {userContext?.currentUser &&
                      userContext?.currentUser?.claimCanMakePo && (
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<SendIcon fontSize="small" />}
                          onClick={() => handleOrderClick(product.id)}
                        >
                          Order Now
                        </Button>
                      )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}

export default LowStockProducts;
