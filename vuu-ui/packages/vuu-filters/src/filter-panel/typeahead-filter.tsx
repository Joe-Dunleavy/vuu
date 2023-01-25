import {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  SyntheticEvent,
  useCallback,
  useState,
} from "react";

export const typeaheadFilter = (data: string[]) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const filterBy = useCallback((e: SyntheticEvent) => {
    const inputValue = (e.target as HTMLInputElement).value;

    if (inputValue.length > 0) {
      const regex = new RegExp(`^${inputValue}`, `i`);
      setSuggestions(data.sort().filter((v) => regex.test(v)));
    }
  }, []);

  return <input onChange={filterBy} placeholder="filter by..." />;
};
