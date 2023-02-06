import { RemoteDataSource } from "@finos/vuu-data";
import { ColumnDescriptor } from "@finos/vuu-datagrid-types";
import { VuuColumnDataType, VuuTable } from "@finos/vuu-protocol-types";
import {
  Dropdown,
  Panel,
  SelectionChangeHandler,
  Toolbar,
  ToolbarField,
} from "@heswell/salt-lab";
import { SyntheticEvent, useEffect, useState } from "react";
import { FilterComponent } from "./filter-components/filter-selector";
import "./filter-panel.css";

export const FilterPanel = (props: {
  table: VuuTable;
  columns: ColumnDescriptor[];
  onFilterSubmit: Function;
}) => {
  //const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumnName, setSelectedColumnName] = useState<string | null>(
    null
  );

  // useEffect(() => {
  //   setColumns(props.columns.map(({ name }) => name));
  // }, [props.columns]);

  // useEffect(() => {
  //   const selectedColumn: ColumnDescriptor[] = props.columns.filter(
  //     (column) => column.name === selectedColumnName
  //   );
  //   selectFilterComponent(selectedColumn[0].serverDataType).then(() => {});
  // }, [selectedColumnName]);

  const getSelectedColumnType = () => {
    if (selectedColumnName !== null) {
      const selectedColumn: ColumnDescriptor[] = props.columns.filter(
        (column) => column.name === selectedColumnName
      );

      return selectedColumn[0].serverDataType;
    } else {
      return undefined;
    }
  };

  const handleColumnSelect: SelectionChangeHandler = (event, selectedItem) => {
    setSelectedColumnName(selectedItem);
  };

  const onFilterSubmit = (filterQuery: string) => {
    props.onFilterSubmit(filterQuery);
  };

  return (
    <Panel className="filter-panel" variant="secondary">
      <div className="inline-block">
        <ToolbarField
          className="column-field"
          label="Column"
          labelPlacement="top"
        >
          <Dropdown
            className="arrow-down-symbol"
            onSelectionChange={handleColumnSelect}
            // defaultSelected={[currencies[0]]}
            //selectionStrategy="multiple"
            source={props.columns.map(({ name }) => name)}
          />
        </ToolbarField>
      </div>
      <div className="inline-block">
        {selectedColumnName ? (
          <FilterComponent
            columnType={getSelectedColumnType()}
            defaultTypeaheadParams={[props.table, selectedColumnName]}
            onFilterSubmit={onFilterSubmit}
          />
        ) : null}
      </div>
    </Panel>
  );
};
