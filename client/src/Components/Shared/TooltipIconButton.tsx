import React from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { TableContainer, useTheme } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

import MoreRoundedIcon from "@mui/icons-material/Science";
import Zoom from "@mui/material/Zoom";
import { PrimerModel } from "../../models/mymodels";

interface TooltipIconButtonProps {
  title: React.ReactNode;
  size?: "small" | "medium";
  primers?: PrimerModel[];
}

const TooltipIconButton: React.FC<TooltipIconButtonProps> = ({
  title,
  size,
  primers,
}) => {
  const theme = useTheme();

  const renderPrimersTable = () => {
    if (!primers || primers.length === 0) {
      return null;
    }

    return (
      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell style={{ color: theme.palette.success.contrastText }}>
                <strong>Sequence Identifier</strong>
              </TableCell>
              <TableCell style={{ color: theme.palette.success.contrastText }}>
                <strong>Nucleotide Sequence</strong>
              </TableCell>
            </TableRow>
            {primers.map((primer) => (
              <TableRow key={primer.id}>
                <TableCell
                  style={{ color: theme.palette.success.contrastText }}
                >
                  {primer.sequenceIdentifier}
                </TableCell>
                <TableCell
                  style={{ color: theme.palette.success.contrastText }}
                >
                  {primer.nucleotideSequence}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Tooltip
      title={<>{renderPrimersTable()}</>}
      arrow
      TransitionComponent={Zoom}
    >
      <IconButton
        sx={{
          "&:hover": {
            background: theme.colors.info.lighter,
          },
          color: theme.palette.info.main,
        }}
        color="inherit"
        size="small"
      >
        <MoreRoundedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default TooltipIconButton;
