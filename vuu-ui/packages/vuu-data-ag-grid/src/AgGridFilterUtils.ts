import {
  AndFilter,
  Filter,
  FilterClause,
  MultiClauseFilter,
  SingleValueFilterClauseOp,
} from "@finos/vuu-filter-types";
import { filterAsQuery } from "@finos/vuu-filters";

import { VuuSortCol } from "@finos/vuu-protocol-types";

export type AgGridSetFilter = {
  filterType: "set";
  values: string[];
};
export type AgGridGreaterThanFilter = {
  filter: number;
  filterType: "number";
  type: "greaterThan";
};
export type AgGridGreaterThanOrEqualFilter = {
  filter: number;
  filterType: "number";
  type: "greaterThanOrEqual";
};
export type AgGridLessThanFilter = {
  filter: number;
  filterType: "number";
  type: "lessThan";
};
export type AgGridLessThanOrEqualFilter = {
  filter: number;
  filterType: "number";
  type: "lessThanOrEqual";
};

export type AgGridEqualsFilter = {
  filter: string | number;
  filterType: "number" | "text";
  type: "equals";
};
export type AgGridNotEqualFilter = {
  filter: string | number;
  filterType: "number" | "text";
  type: "notEqual";
};
export type AgGridStartsWithFilter = {
  filter: string;
  filterType: "text";
  type: "startsWith";
};

export type AgGridFilter =
  | AgGridGreaterThanFilter
  | AgGridEqualsFilter
  | AgGridNotEqualFilter
  | AgGridLessThanFilter
  | AgGridSetFilter
  | AgGridGreaterThanOrEqualFilter
  | AgGridLessThanOrEqualFilter;

const agToSingleValueVuuFilterType = (
  type: string
): SingleValueFilterClauseOp => {
  switch (type) {
    case "startsWith":
      return "starts";
    case "greaterThan":
      return ">";
    case "lessThan":
      return "<";
    case "equals":
      return "=";
    case "notEquals":
      return "!=";
    default:
      throw Error(
        `@finos/vuu-data-ag-grid AgGridFilterUtils AgGrid filter type ${type} not supported`
      );
  }
};

type AgGridSortCol = {
  sort: "asc" | "desc";
  colId: string;
};

export const agGridFilterModelToVuuFilter = (
  filterModel: AgGridFilter
): [string, Filter | undefined] => {
  const filterClauses: Filter[] = [];
  Object.entries(filterModel).forEach(([column, agGridFilter]) => {
    const { filterType, filter: value, type, values } = agGridFilter;
    if (filterType === "set") {
      if (values.length === 1) {
        const filterClause: FilterClause = {
          op: "=",
          column,
          value: values[0],
        };
        filterClauses.push(filterClause);
      } else if (values.length > 0) {
        const filterClause: FilterClause = {
          op: "in",
          column,
          values,
        };
        filterClauses.push(filterClause);
      }
    } else if (type === "lessThanOrEqual") {
      const filterClause: MultiClauseFilter = {
        op: "or",
        filters: [
          { op: "<", column, value },
          { op: "=", column, value },
        ],
      };
      filterClauses.push(filterClause);
    } else if (type === "greaterThanOrEqual") {
      const filterClause: MultiClauseFilter = {
        op: "or",
        filters: [
          { op: ">", column, value },
          { op: "=", column, value },
        ],
      };
      filterClauses.push(filterClause);
    } else if (filterType === "text" || filterType === "number") {
      const { type } = agGridFilter;
      const filterClause: FilterClause = {
        op: agToSingleValueVuuFilterType(type),
        column,
        value,
      };
      filterClauses.push(filterClause);
    }
  });

  const vuuFilter: Filter | undefined =
    filterClauses.length === 0
      ? undefined
      : filterClauses.length === 1
      ? (filterClauses[0] as FilterClause)
      : ({
          op: "and",
          filters: filterClauses,
        } as AndFilter);

  const filterQuery = vuuFilter ? filterAsQuery(vuuFilter) : "";
  return [filterQuery, vuuFilter];
};

export const agSortModelToVuuSort = (
  sortModel: AgGridSortCol[]
): VuuSortCol[] => {
  return sortModel.map(({ colId, sort }) => ({
    column: colId,
    sortType: sort === "asc" ? "A" : "D",
  }));
};
