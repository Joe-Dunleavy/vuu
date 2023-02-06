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
import { Button } from "../../../../showcase/src/examples/salt";
import { FilterComponent } from "./filter-components/filter-selector";
import "./filter-panel.css";

export const FilterPanel = (props: {
  table: VuuTable;
  columns: ColumnDescriptor[];
  onFilterSubmit: Function;
}) => {
  const [selectedColumnName, setSelectedColumnName] = useState<string | null>(
    null
  );

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

  const handleClear = () => {
    setSelectedColumnName(null);
    props.onFilterSubmit("");
  };

  const onFilterSubmit = (filterQuery: string) => {
    props.onFilterSubmit(filterQuery);
  };

  return (
    <Panel id="filter-panel" variant="secondary">
      <div className="inline-block">
        <ToolbarField
          className="column-field"
          label="Column"
          labelPlacement="top"
        >
          <Dropdown
            className="arrow-down-symbol"
            onSelectionChange={handleColumnSelect}
            source={props.columns.map(({ name }) => name)}
          />
        </ToolbarField>
      </div>
      <div id="filter-component" className="inline-block">
        {selectedColumnName ? (
          <div>
            <FilterComponent
              columnType={getSelectedColumnType()}
              defaultTypeaheadParams={[props.table, selectedColumnName]}
              onFilterSubmit={onFilterSubmit}
            />
            <button
              className="clear-button"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        ) : null}
      </div>
    </Panel>
  );
};
