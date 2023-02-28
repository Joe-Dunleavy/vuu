import { ColumnDescriptor } from "@finos/vuu-datagrid-types";
import { VuuTable } from "@finos/vuu-protocol-types";
import {
  Dropdown,
  Panel,
  SelectionChangeHandler,
  Toolbar,
  ToolbarField,
} from "@heswell/salt-lab";
import { useState } from "react";
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

  const [filterQuery, setFilterQuery] = useState<string | null>(null);

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
    setFilterQuery(null);
    props.onFilterSubmit("");
  };

  const onFilterSubmit = (newQuery: string) => {
    newQuery = getFilterQuery(newQuery, filterQuery);
    setFilterQuery(newQuery);
    props.onFilterSubmit(newQuery);
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

function getFilterQuery(newQuery: string, oldQuery: string | null) {
  if (oldQuery) {
    newQuery += " and " + oldQuery;
  }

  return newQuery;
}
