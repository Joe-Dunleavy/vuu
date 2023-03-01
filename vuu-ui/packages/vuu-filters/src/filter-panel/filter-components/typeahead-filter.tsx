import { useTypeaheadSuggestions } from "@finos/vuu-data";
import { TypeaheadParams } from "@finos/vuu-protocol-types";
import "./typeahead-filter.css";
import { useEffect, useRef, useState } from "react";

export const TypeaheadFilter = (props: {
  defaultTypeaheadParams: TypeaheadParams;
  onFilterSubmit: Function;
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typeaheadParams, setTypeaheadParams] = useState<TypeaheadParams>(
    props.defaultTypeaheadParams
  );
  const [selectedSuggestions, setSelectedSuggestions] = useState<{
    [key: string]: string[];
  }>({ [typeaheadParams[1]]: [] });
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchValue("");
    if (showDropdown && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showDropdown]);

  const ref = useRef<HTMLDivElement>(null);

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
    setTypeaheadParams(props.defaultTypeaheadParams);
    getSuggestions(props.defaultTypeaheadParams).then((response) => {
      setSuggestions(response);
    });
  }, [props.defaultTypeaheadParams[1]]);

  //get suggestions while typing
  useEffect(() => {
    setTypeaheadParams([typeaheadParams[0], typeaheadParams[1], searchValue]);
    getSuggestions([typeaheadParams[0], typeaheadParams[1], searchValue]).then(
      (options) => {
        setSuggestions(options);
      }
    );
  }, [searchValue]);

  const handleDropdownToggle = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const getSuggestions = useTypeaheadSuggestions();
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const suggestionSelected = (value: string) => {
    const newValue =
      selectedSuggestions[typeaheadParams[1]].findIndex(
        (suggestion) => suggestion === value
      ) >= 0
        ? removeOption(value)
        : [...selectedSuggestions[typeaheadParams[1]], value];
    setSelectedSuggestions({
      ...selectedSuggestions,
      [typeaheadParams[1]]: newValue,
    });
    const filterQuery = getFilterQuery(newValue, typeaheadParams[1]);
    props.onFilterSubmit(filterQuery);
  };

  const getDisplay = () => {
    if (
      !selectedSuggestions ||
      selectedSuggestions[typeaheadParams[1]].length === 0
    )
      return "Filter";

    return (
      <div className="dropdown-tags">
        {selectedSuggestions[typeaheadParams[1]].map((suggestion) => (
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
      [typeaheadParams[1]]: newSelection,
    });
    const filterQuery = getFilterQuery(newSelection, typeaheadParams[1]);
    props.onFilterSubmit(filterQuery);
  };

  const removeOption = (option: string): string[] => {
    if (selectedSuggestions)
      return selectedSuggestions[typeaheadParams[1]].filter(
        (o) => o !== option
      );
    else return [];
  };

  const isSelected = (selected: string): boolean => {
    if (selectedSuggestions)
      return (
        selectedSuggestions[typeaheadParams[1]].filter(
          (suggestion) => suggestion === selected
        ).length > 0
      );
    else return false;
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
              <input onChange={onSearch} value={searchValue} ref={searchRef} />
            </div>
            {suggestions.map((suggestion) => (
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

function getFilterQuery(filterValues: string[], column: string) {
  if (filterValues.length > 0) {
    let filterQuery = `${column} = "${filterValues[0]}"`;

    filterValues.slice(1).forEach(function (value) {
      filterQuery += ` or ${column} = "${value}"`;
    });

    return filterQuery.replaceAll("_", " ");
  }
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
