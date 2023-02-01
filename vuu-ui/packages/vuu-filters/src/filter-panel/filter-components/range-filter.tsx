import { TypeaheadParams } from "@finos/vuu-protocol-types";
import { useState } from "react";

export const RangeFilter = (props: {
  defaultTypeaheadParams: TypeaheadParams;
}) => {
  const [range, setRange] = useState<IRange>({ start: null, end: null });
  const [queryType, setqueryType] = useState<string | null>(null);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value: number | null = null;

    if (e.target.value === "") {
      value = null;
    } else {
      value = Number(e.target.value);
    }

    setRange({
      ...range,
      [e.target.name]: value,
    });
  };

  return (
    <div>
      <input name="start" onChange={inputChangeHandler} /> to{" "}
      <input name="end" onChange={inputChangeHandler} />
    </div>
  );
};

const getRangeQuery = (range: IRange, column: string): string => {
  let queryType = "" as keyof typeof queryOptions;

  if (range.start !== null) queryType = "start";
  if (range.end !== null) {
    if (queryType === "start") queryType = "both";
    else queryType = "end";
  }

  const queryOptions = {
    start: `${column} >= ${range.start}`,
    end: `${column} <= ${range.end}`,
    both: `${column} >= ${range.start} and ${column} <= ${range.end}`,
  };

  return queryOptions[queryType];
};

interface IRange {
  start: number | null;
  end: number | null;
}
