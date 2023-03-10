import { useTypeaheadSuggestions } from "@finos/vuu-data";
import { TypeaheadParams } from "@finos/vuu-protocol-types";
import "./typeahead-filter.css";
import { useEffect, useRef, useState } from "react";

export const TypeaheadFilter = (props: {
  defaultTypeaheadParams: TypeaheadParams;
  existingFilters: { [key: string]: string[] } | null;
  onFilterSubmit: Function;
}) => {
  const [tableName, columnName] = props.defaultTypeaheadParams;
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>({
    [columnName]: [],
  });
  const [selectedSuggestions, setSelectedSuggestions] = useState<{
    [key: string]: string[];
  }>(props.existingFilters ?? { [columnName]: [] });
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const startsWithFilter = useRef<boolean>(false);

  useEffect(() => {
    setSearchValue("");
    if (showDropdown && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showDropdown]);

  const ref = useRef<HTMLDivElement>(null);

  //if selected column changes, add it to selectedSuggestions
  useEffect(() => {
    if (!selectedSuggestions[columnName])
      setSelectedSuggestions({
        ...selectedSuggestions,
        [columnName]: [],
      });
  }, [columnName]);

  //close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any): void => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  });

  //get suggestions on load
  useEffect(() => {
    getSuggestions(props.defaultTypeaheadParams).then((response) => {
      setSuggestions({ ...suggestions, [columnName]: response });
    });
  }, [props.defaultTypeaheadParams[1]]);

  //get suggestions while typing
  useEffect(() => {
    getSuggestions([tableName, columnName, searchValue]).then((options) => {
      if (searchValue) options.unshift(`${searchValue}...`);
      setSuggestions({ ...suggestions, [columnName]: options });
    });
  }, [searchValue]);

  useEffect(() => {
    const filterQuery = getFilterQuery(
      selectedSuggestions[columnName],
      columnName,
      startsWithFilter.current
    );
    props.onFilterSubmit(filterQuery, selectedSuggestions);
  }, [selectedSuggestions]);

  const handleDropdownToggle = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const getSuggestions = useTypeaheadSuggestions();
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const suggestionSelected = (value: string) => {
    const newSelection = getUpdatedSelection(value);
    setSelectedSuggestions({
      ...selectedSuggestions,
      [columnName]: newSelection,
    });
  };

  const getUpdatedSelection = (selectedValue: string) => {
    if (isAlreadySelected(selectedValue)) {
      startsWithFilter.current = false;
      return removeOption(selectedValue);
    } else {
      if (isStartsWithFilter(selectedValue)) {
        startsWithFilter.current = true;
        return [selectedValue];
      } else {
        //don't allow starts with filter to be mixed with exact match filter
        if (startsWithFilter.current) {
          startsWithFilter.current = false;
          return [selectedValue];
        } else {
          startsWithFilter.current = false;
          return [...selectedSuggestions[columnName], selectedValue];
        }
      }
    }
  };

  const getDisplay = () => {
    if (
      !selectedSuggestions[columnName] ||
      selectedSuggestions[columnName].length === 0
    )
      return "Filter";

    return (
      <div className="dropdown-tags">
        {selectedSuggestions[columnName].map((suggestion) => (
          <div key={suggestion} className="dropdown-tag-item">
            {suggestion}
            <span
              onClick={(e) => onTagRemove(e, suggestion)}
              className="dropdown-tag-close"
            >
              <CloseIcon />
            </span>
          </div>
        ))}
      </div>
    );
  };

  const onTagRemove = (e: React.MouseEvent, suggestion: string): void => {
    e.stopPropagation();
    const newSelection = removeOption(suggestion);
    setSelectedSuggestions({
      ...selectedSuggestions,
      [columnName]: newSelection,
    });
    const filterQuery = getFilterQuery(
      newSelection,
      columnName,
      startsWithFilter.current
    );
    props.onFilterSubmit(filterQuery, selectedSuggestions);
  };

  const removeOption = (option: string): string[] => {
    if (selectedSuggestions)
      return selectedSuggestions[columnName].filter((o) => o !== option);
    else return [];
  };

  const isSelected = (selected: string): boolean => {
    if (selectedSuggestions[columnName])
      return (
        selectedSuggestions[columnName].filter(
          (suggestion) => suggestion === selected
        ).length > 0
      );
    else return false;
  };

  function isStartsWithFilter(selectedVal: string) {
    return selectedVal === searchValue + "...";
  }

  const isAlreadySelected = (selectedValue: string): boolean => {
    return (
      selectedSuggestions[columnName].findIndex(
        (suggestion) => suggestion === selectedValue
      ) >= 0
    );
  };

  return (
    <>
      <div className="dropdown-container" ref={ref}>
        <div onClick={handleDropdownToggle} className="dropdown-input">
          <div className="dropdown-selected-value">{getDisplay()}</div>
          <div className="dropdown-tools">
            <div className="dropdown-tool">
              <Icon />
            </div>
          </div>
        </div>
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="search-box">
              <input
                onChange={onSearch}
                value={searchValue}
                ref={searchRef}
                id="input-field"
              />
            </div>
            {suggestions[columnName].map((suggestion: string) => (
              <div
                key={suggestion}
                className={`dropdown-item ${
                  isSelected(suggestion) && "selected"
                }`}
                onClick={() => {
                  suggestionSelected(suggestion);
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

function getFilterQuery(
  filterValues: string[],
  column: string,
  isStartsWithFilter?: boolean
) {
  if (isStartsWithFilter) {
    const startsWith = filterValues[0].substring(0, filterValues[0].length - 3);
    return `${column} starts ${startsWith}`; // multiple starts with filters not currently supported
  } else {
    if (filterValues && filterValues.length > 0)
      return `${column} in ${JSON.stringify(filterValues)}`;
  }
}

enum FilterType {
  exactMatch = "exact match",
  startsWith = "starts with",
}

const Icon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};

const CloseIcon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
    </svg>
  );
};
