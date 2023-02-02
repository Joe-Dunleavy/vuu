import { ColumnDescriptor } from "@finos/vuu-datagrid-types";
import { VuuColumnDataType } from "@finos/vuu-protocol-types";
import { Dropdown, Toolbar, ToolbarField } from "@heswell/salt-lab";
import { SyntheticEvent, useEffect, useState } from "react";

export const FilterPanel = (props: { columns: ColumnDescriptor[] }) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumnName, setSelectedColumnName] = useState<string | null>(
    null
  );

  useEffect(() => {
    setColumns(props.columns.map(({ name }) => name));
  }, [props.columns]);

  useEffect(() => {
    const selectedColumn: ColumnDescriptor[] = props.columns.filter(
      (column) => column.name === selectedColumnName
    );
    selectFilterComponent(selectedColumn[0].serverDataType).then(() => {});
  }, [selectedColumnName]);

  const getSelectedColumnType = () => {
    if (selectedColumnName !== null) {
      const selectedColumn: ColumnDescriptor[] = props.columns.filter(
        (column) => column.name === selectedColumnName
      );

      return selectedColumn[0].serverDataType;
    } else {
      return null;
    }
  };

  const columnSelectHandler = (e: SyntheticEvent, selectedItem: string) => {
    setSelectedColumnName(selectedItem);
  };

  return (
    <Toolbar id="toolbar-default">
      <ToolbarField
        //className="vuuFilterDropdown"
        label="Column"
        labelPlacement="top"
      >
        <Dropdown
          className="arrow-down-symbol"
          onSelect={columnSelectHandler}
          // defaultSelected={[currencies[0]]}
          //selectionStrategy="multiple"
          source={columns}
          style={{ width: 70 }}
        />
      </ToolbarField>
      <FilterComponent columnType={getSelectedColumnType} />
    </Toolbar>
  );
};

const selectFilterComponent = (columnType: VuuColumnDataType | undefined) => {};
