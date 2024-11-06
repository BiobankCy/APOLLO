import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { ccyFormat, generateQRCodeDataForProduct, ProductModel } from "../../../../models/mymodels";
import QRCodeGenerator from "../../QRCodeGenerator";

interface ProductInfoComponentProps {
  data: ProductModel; 
}

const ProductInfoComponent: React.FC<ProductInfoComponentProps> = ({
  data,
}) => {
  return (
    <Card>
      <CardContent>
        {/*<Typography variant="h4" component="div">*/}
        {/*    Product Information*/}
        {/*</Typography>*/}
        <Typography variant="body2" color="textSecondary">
          Product Code: {data.code}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Product Name: {data.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Inventory Qty: {data.availabletotalstockqty}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Price: {ccyFormat(data.costprice)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Vat Rate: {data.vatRate}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Default Tender: {data.tenderName}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Default Location: {data.defaultLocName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Default Supplier: {data.defaultSupplierName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Brand: {data.brandName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Category: {data.categoryName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Subcategory: {data.subCategoryName}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Barcode: {data.barcode}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Units: {data.punits}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Storage Condition: {data.storageCondsName}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          General Notes: {data.generalNotes}
        </Typography>
        <QRCodeGenerator data={generateQRCodeDataForProduct(data)} size={120} />
      </CardContent>
    </Card>
  );
};

export default ProductInfoComponent;
