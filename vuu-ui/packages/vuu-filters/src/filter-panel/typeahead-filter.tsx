import { useTypeaheadSuggestions } from "@finos/vuu-data";
import { TypeaheadParams } from "@finos/vuu-protocol-types";
import { Dropdown, SIZE_OPTIONS } from "@heswell/salt-lab";
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
  //const [userInput, setUserInput] = useState<string | undefined>(undefined);

  // useEffect(() => {
  //   const handler = () => setShowDropdown(false);
  //   window.addEventListener("click", handler);

  //   return () => {
  //     window.removeEventListener("click", handler);
  //   };
  // });

  const handleDropdownClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
    setShowDropdown(!showDropdown);
    if (showDropdown) {
      setTypeaheadParams([typeaheadParams[0], typeaheadParams[1], ""]);
      getSuggestions([typeaheadParams[0], typeaheadParams[1], ""]).then(
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

  // const suggestionSelected = useCallback((value: string) => {
  //   setSelectedSuggestions([...selectedSuggestions, value]);
  // }, []);

  // const renderSuggestions = useMemo(() => {
  //   if (suggestions.length === 0) return <div>test</div>;
  //   return (
  //     <div className="dropdown-menu">
  //       {suggestions.map((suggestion) => (
  //         <div key={suggestion} className="dropdown-item">
  //           {suggestion}
  //         </div>
  //       ))}
  //     </div>
  //     // <ul>
  //     //   {suggestions.map((value) => (
  //     //     <li key={value} onClick={(e) => suggestionSelected(value)}>
  //     //       {value}
  //     //     </li>
  //     //   ))}
  //     // </ul>
  //   );
  // }, [suggestions]);

  return (
    <>
      <div className="dropdown-container">
        <div
          onClick={handleDropdownClick}
          // onChange={handleInputChange}
          placeholder="filterBy..."
          className="dropdown-input"
        >
          <div className="dropdown-selected-value">filter by...</div>
          <div className="dropdown-tools">
            <div className="dropdown-tool">
              <Icon />
            </div>
          </div>
        </div>
        {showDropdown && (
          <div className="dropdown-menu">
            {suggestions.map((suggestion) => (
              <div key={suggestion} className="dropdown-item">
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <input onChange={handleInputChange} placeholder="filter by..." /> */}
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
