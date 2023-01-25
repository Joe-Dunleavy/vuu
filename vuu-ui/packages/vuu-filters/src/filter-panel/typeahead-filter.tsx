import {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  SyntheticEvent,
  useCallback,
  useState,
} from "react";

export const typeaheadFilter = (data: string[]) => {
  const [suggestions, setSuggestions] = useState([]);

  function filterBy(event: SyntheticEvent) {
    throw new Error("Function not implemented.");
  }

  return <input onChange={filterBy} placeholder="filter by..." />;
};
