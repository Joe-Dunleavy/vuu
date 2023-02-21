import { TypeaheadParams, VuuColumnDataType } from "@finos/vuu-protocol-types";
import { RangeFilter } from "./range-filter";
import { TypeaheadFilter } from "./typeahead-filter";

export const FilterComponent = (props: {
  columnType: VuuColumnDataType | undefined;
  defaultTypeaheadParams: TypeaheadParams;
  onFilterSubmit: Function;
}) => {
  if (props.columnType !== undefined) {
    const SelectedFilter = filterComponent[props.columnType];

    return (
      <SelectedFilter
        defaultTypeaheadParams={props.defaultTypeaheadParams}
        onFilterSubmit={props.onFilterSubmit}
      />
    );
  }

  return null;
};

const filterComponent = {
  string: TypeaheadFilter,
  char: TypeaheadFilter,
  int: RangeFilter,
  long: RangeFilter,
  double: RangeFilter,
};
