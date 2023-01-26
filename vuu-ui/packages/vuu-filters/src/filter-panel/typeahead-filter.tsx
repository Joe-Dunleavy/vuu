import { useTypeaheadSuggestions } from "@finos/vuu-data";
import { TypeaheadParams } from "@finos/vuu-protocol-types";
import {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

export const typeaheadFilter = (typeaheadParams: TypeaheadParams) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  //const [userInput, setUserInput] = useState<string | undefined>(undefined);

  const getSuggestions = useTypeaheadSuggestions();

  // useEffect(() => {
  //   getSuggestions(typeaheadParams).then((response) =>
  //     setSuggestions(response)
  //   );
  // }, [getSuggestions]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //setUserInput(event.currentTarget.value);
    if (event.currentTarget.value !== undefined) {
      typeaheadParams = [
        typeaheadParams[0],
        typeaheadParams[1],
        event.currentTarget.value,
      ];
      getSuggestions(typeaheadParams).then((response) =>
        setSuggestions(response)
      );
    }
  };

  const suggestionSelected = (value: string) => {
    setSelectedSuggestions([...selectedSuggestions, value]);
  };

  const renderSuggestions = useCallback(() => {
    if (suggestions.length === 0) return null;
    return (
      <ul>
        {suggestions.map((value) => (
          <li key={value} onClick={(e) => suggestionSelected(value)}>
            {value}
          </li>
        ))}
      </ul>
    );
  }, [suggestions]);

  return (
    <>
      <input onChange={handleInputChange} placeholder="filter by..." />
      {suggestions}
    </>
  );
};
