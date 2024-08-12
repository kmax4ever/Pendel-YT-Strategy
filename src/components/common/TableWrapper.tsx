import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { Colors } from "styles/theme";
import Text from "./Text";

const useStyles = makeStyles({
  root: {
    width: "100%",
    borderRadius: 10,
    display: "flex",
    flexGrow: 1,
    minHeight: 500,
    overflow: "auto",
  },
  container: {
    borderRadius: 10,
    flexGrow: 1,
    minHeight: 0,
    overflow: "auto",
  },
  tableHeaderRow: {},
  tableRow: {
    backgroundColor: Colors.tableRowBg2,
    "&:nth-child(odd)": {
      background: Colors.tableRowBg1,
    },
  },
});

export interface TableWrapperColumn {
  dataKey: string;
  label: string | Function;
  cellRenderer: (value: any, row: any) => any;
}

export type TableWrapperProps = {
  data: any[];
  columns: TableWrapperColumn[];
};

export default function TableWrapper(props: TableWrapperProps) {
  const classes = useStyles();
  const { data, columns } = props;

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table aria-label="sticky table" stickyHeader>
          <TableHead
            style={{
              backgroundColor: Colors.tableHeaderBg,
              borderBottom: "2px solid #16192A",
            }}
          >
            <TableRow className={classes.tableHeaderRow}>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  style={{ backgroundColor: Colors.tableHeaderBg }}
                >
                  {typeof column.label === "string" ? (
                    <Text color="#86889A" variant="bold">
                      {column.label}
                    </Text>
                  ) : (
                    column.label()
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => {
              return (
                <TableRow
                  role="checkbox"
                  tabIndex={-1}
                  key={rowIndex}
                  className={classes.tableRow}
                >
                  {columns.map((column, columnIndex) => {
                    const value = row[column.dataKey];
                    return (
                      <TableCell key={columnIndex}>
                        {column.cellRenderer(value, row)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
