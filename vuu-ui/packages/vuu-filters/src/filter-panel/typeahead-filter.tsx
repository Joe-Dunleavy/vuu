import { useTypeaheadSuggestions } from "@finos/vuu-data";
import {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

export const typeaheadFilter = (data: string[]) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<
    string | undefined
  >(undefined);

  const getSuggestions = useTypeaheadSuggestions();

  useEffect(() => {
    getSuggestions([
      { module: "SIMUL", table: "instruments" },
      "currency",
    ]).then((response) => setSuggestions(response));
  }, [getSuggestions]);

  //   const renderSuggestions = useCallback(() => {
  //     if (suggestions.length === 0) return null;
  //     return (
  //       <ul>
  //         {suggestions.map((city) => (
  //           <li key={city} onClick={(e) => this.suggestionSelected(city)}>
  //             {city}
  //           </li>
  //         ))}
  //       </ul>
  //     );
  //   }, [suggestions]);

  return <input onChange={getSuggestions} placeholder="filter by..." />;
};
