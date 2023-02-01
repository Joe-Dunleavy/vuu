import { TypeaheadParams } from "@finos/vuu-protocol-types";
import { useState } from "react";

export const rangeFilter = (defaultTypeaheadParams: TypeaheadParams) => {
  const [start, setStart] = useState<number | Date | null>(null);
  const [end, setEnd] = useState<number | Date | null>(null);

  return (
    <div>
      <input onChange={} /> to <input onChange={} />
    </div>
  );
};
