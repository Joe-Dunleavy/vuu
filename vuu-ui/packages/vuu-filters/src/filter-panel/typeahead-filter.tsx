import { useTypeaheadSuggestions } from "@finos/vuu-data";
import { TypeaheadParams } from "@finos/vuu-protocol-types";
import {
  Dropdown,
  getDropdownPlaceholder,
  SIZE_OPTIONS,
} from "@heswell/salt-lab";
import "./typeahead-filter.css";
import {
  HTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { render } from "react-dom";

export const TypeaheadFilter = (props: {
  defaultTypeaheadParams: TypeaheadParams;
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [typeaheadParams, setTypeaheadParams] = useState<TypeaheadParams>(
    props.defaultTypeaheadParams
  );
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    const handler = () => setShowDropdown(false);
    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  });

  const handleDropdownToggle = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
    if (showDropdown) {
      setTypeaheadParams([typeaheadParams[0], typeaheadParams[1]]);
      getSuggestions([typeaheadParams[0], typeaheadParams[1]]).then(
        (response) => {
          setSuggestions(response);
        }
      );
    }
  };

  const getSuggestions = useTypeaheadSuggestions();

  useEffect(() => {
    getSuggestions(typeaheadParams).then((response) =>
      setSuggestions(response)
    );
  }, [getSuggestions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;

    if (inputValue !== undefined) {
      setTypeaheadParams([typeaheadParams[0], typeaheadParams[1], inputValue]);
      getSuggestions([typeaheadParams[0], typeaheadParams[1], inputValue]).then(
        (response) => {
          setSuggestions(response);
        }
      );
    }
  };

  const suggestionSelected = (value: string) => {
    setSelectedSuggestions([...selectedSuggestions, value]);
  };

  const getPlaceholder = () => {
    if (selectedSuggestions.length > 0) {
      return selectedSuggestions;
    }

    return "Filter by";
  };

  const isSelected = (suggestion: string) => {
    if (selectedSuggestions.length < 1) return false;
    return selectedSuggestions.includes(suggestion);
  };

  return (
    <>
      <div className="dropdown-container">
        <div
          onClick={handleDropdownToggle}
          placeholder="Select filter"
          className="dropdown-input"
        >
          <div className="dropdown-selected-value">{getPlaceholder()}</div>
          <div className="dropdown-tools">
            <div className="dropdown-tool">
              <Icon />
            </div>
          </div>
        </div>
        {showDropdown && (
          <div className="dropdown-menu">
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

const Icon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
    </svg>
  );
};
