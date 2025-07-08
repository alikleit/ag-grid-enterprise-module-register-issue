"use client";

import {
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  GridSizeChangedEvent,
  ICellRendererParams,
  ModuleRegistry,
  RowSelectionModule,
} from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  RowGroupingModule,
} from "ag-grid-enterprise";
// import type { ICellRendererParams } from 'ag-grid-enterprise';
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { ReactNode, useEffect, useState } from "react";
// import AgGridTableAutocompleteFieldComponent from '../ag-grid-table/components/autocomplete-field';
// import AgGridTableAutocompleteFieldControlledComponent from '../ag-grid-table/components/autocomplete-field-controlled';
// import AgGridTableCheckCircleFieldComponent from '../ag-grid-table/components/check-circle-field';
// import AgGridDateFilter from '../ag-grid-table/components/date-filter';
// import AgGridDateTimeFilter from '../ag-grid-table/components/datetime-filter';
// import AgGridTableTextFieldComponent from '../ag-grid-table/components/text-field';

// type AGGridTableProps<T> = {
//   // rowData: T[];
//   // columnDefs: ColDef<T>[];
//   // defaultColDef?: ColDef<T>;
//   // autoGroupColumnDef?: ColDef<T>;
//   // onGridReady?: (params: GridReadyEvent) => void
// } & AgGridReactProps<T>;

// export const groupableCellRenderer = <TRow, TValue>(
//   params: ICellRendererParams<TRow, TValue>,
//   targetLabel: string
// ): any => {
//   if (params.data) return params.data[targetLabel];

//   if (
//     params.value &&
//     params.node.group &&
//     params.node?.allLeafChildren?.length
//   ) {
//     return params.node.allLeafChildren[0].data
//       ? params.node.allLeafChildren[0].data[targetLabel]
//       : "";
//   }

//   return undefined;
// };

export const useGridTable = <T extends unknown>() => {
  const [gridApi, setGridApi] = useState<GridApi<T[]> | null>(null);
  // const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);

  // const debouncedResize = useDebouncedCallback(() => {
  //   columnApi?.autoSizeAllColumns();
  // }, 500);

  const handleGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);

    // setColumnApi(params.columnApi);
  };

  return {
    gridApi,
    // columnApi,
    setGridApi,
    // debouncedResize,
    // setColumnApi,
    handleGridReady,
  };
};

export type AgGridTableProps<T extends unknown> = AgGridReactProps<T> & {
  parentId?: string;
  title?: ReactNode;
  itemName?: string;
  height?: string | number;
  minHeight?: string | number;
  size?: "small" | "medium";

  add?: {
    to?: string;
    onClick?: () => void;
    tooltip: string;
  };

  aiAssistant?: {
    onClick: () => void;
    tooltip: string;
  };

  // topBarRight?: ReactNode[];
  topBarRight?: ReactNode;
  topBarLeft?: ReactNode;
};

// function onGridSizeChanged(params: GridSizeChangedEvent) {
//   // get the current grids width
//   // var gridWidth = document.querySelector('.ag-body-viewport')!.clientWidth;

//   // // keep track of which columns to hide/show
//   // var columnsToShow: string[] = [];
//   // var columnsToHide: string[] = [];

//   // // iterate over all columns (visible or not) and work out
//   // // now many columns can fit (based on their minWidth)
//   // var totalColsWidth = 0;
//   // var allColumns = params.api.getColumns();
//   // if (allColumns && allColumns.length > 0) {
//   //   for (var i = 0; i < allColumns.length; i++) {
//   //     var column = allColumns[i];
//   //     totalColsWidth += column.getMinWidth();
//   //     if (totalColsWidth > gridWidth) {
//   //       columnsToHide.push(column.getColId());
//   //     } else {
//   //       columnsToShow.push(column.getColId());
//   //     }
//   //   }
//   // }

//   // // show/hide columns based on current grid width
//   // params.api.setColumnsVisible(columnsToShow, true);
//   // params.api.setColumnsVisible(columnsToHide, false);

//   // wait until columns stopped moving and fill out
//   // any available space to ensure there are no gaps
//   // window.setTimeout(() => {
//   params.api.sizeColumnsToFit();
//   // }, 10);
// }

export type AgGridRowDataState<T> = {
  initialized: boolean;
  data: T[];
};

ModuleRegistry.registerModules([
  ColumnAutoSizeModule,
  RowSelectionModule,
  ClientSideRowModelModule,

  // !! COMMENT THIS OUT TO SEE THE DIFFERENCE !!
  ColumnsToolPanelModule,
  MenuModule,
  RowGroupingModule,
  FiltersToolPanelModule,
]);

function AgGridTableContent<T extends unknown>({
  height,
  minHeight,
  add,
  aiAssistant,
  topBarRight,
  topBarLeft,
  onFirstDataRendered,
  size,
  title,
  ...props
}: AgGridTableProps<T>) {
  // const { darkMode } = useAppStore();
  // const theme = useTheme();

  const [gridReady, setGridReady] = useState(false);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  useEffect(() => {
    return () => {
      gridApi?.destroy();
    };
  }, [gridApi]);

  useEffect(() => {
    setGridReady(true);
  }, []);

  // useEffect(() => {
  //   ModuleRegistry.registerModules([
  //     ColumnAutoSizeModule,
  //     RowSelectionModule,
  //     ClientSideRowModelModule,
  //     ColumnsToolPanelModule,
  //     MenuModule,
  //     RowGroupingModule,
  //     FiltersToolPanelModule
  //     // RangeSelectionModule
  //   ]);
  // }, []);

  // const tableTheme = useMemo(
  //   () =>
  //     (darkMode ? themeQuartz.withPart(colorSchemeDark) : themeQuartz).withParams({
  //       checkboxCheckedBackgroundColor: theme.palette.primary.main
  //     }),
  //   [darkMode, theme]
  // );

  // const { push } = useRouter();

  // const debouncedResize = useDebouncedCallback(params => {
  //   // props.api?.sizeColumnsToFit();
  //   params.api.autoSizeAllColumns();
  // }, 500);

  const handleFirstDataRendered = (params: FirstDataRenderedEvent) => {
    // params.api.sizeColumnsToFit();
    params.api.autoSizeAllColumns();
    if (onFirstDataRendered) {
      onFirstDataRendered(params);
    }
  };

  const onGridSizeChanged = (params: GridSizeChangedEvent<T>) => {
    // if (!params.api) {
    //   return;
    // }
    // // params.api.sizeColumnsToFit();
    // // get the current grids width
    // var gridWidth = document.querySelector('.ag-body-viewport')!.clientWidth;
    // // keep track of which columns to hide/show
    // var columnsToShow: string[] = [];
    // var columnsToHide: string[] = [];
    // // iterate over all columns (visible or not) and work out
    // // now many columns can fit (based on their minWidth)
    // var totalColsWidth = 0;
    // console.log({ api: params.api });
    // var allColumns = params.api.getColumns();
    // if (allColumns && allColumns.length > 0) {
    //   for (var i = 0; i < allColumns.length; i++) {
    //     var column = allColumns[i];
    //     totalColsWidth += column.getMinWidth();
    //     if (totalColsWidth > gridWidth) {
    //       columnsToHide.push(column.getColId());
    //     } else {
    //       columnsToShow.push(column.getColId());
    //     }
    //   }
    // }
    // // show/hide columns based on current grid width
    // params.api.setColumnsVisible(columnsToShow, true);
    // params.api.setColumnsVisible(columnsToHide, false);
    // wait until columns stopped moving and fill out
    // any available space to ensure there are no gaps
    // window.setTimeout(() => {
    params.api.autoSizeAllColumns();
    // }, 50);
  };

  const handleGridReady = (params: GridReadyEvent<T>) => {
    setGridApi(params.api);
    // setColumnApi(params.columnApi);
    // params.api.sizeColumnsToFit();
    // params.api.autoSizeAllColumns();
  };

  // const defaultColDef = useMemo<ColDef>(() => {
  //   return {
  //     enableValue: true,
  //     enableRowGroup: true,
  //     enablePivot: true
  //   };
  // }, []);

  return (
    <div>
      <div
        style={{
          height: "400px",
        }}
      >
        <div
          style={{ height: "100%", width: "100%" }}
          // className={`ag-theme-alpine${darkMode ? '-dark' : ''}`}
        >
          <AgGridReact<any>
            onGridReady={handleGridReady}
            columnDefs={[
              {
                field: "id",
                headerName: "ID",
                width: 100,
              },
            ]}
            rowData={[
              { id: "1", name: "Item 1" },
              { id: "2", name: "Item 2" },
              { id: "3", name: "Item 3" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default AgGridTableContent;
