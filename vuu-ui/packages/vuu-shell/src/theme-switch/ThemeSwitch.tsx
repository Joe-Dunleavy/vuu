import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupChangeEventHandler,
} from "@heswell/salt-lab";
import cx from "classnames";
import { useControlled } from "@salt-ds/core";
import { HTMLAttributes, useCallback } from "react";

import "./ThemeSwitch.css";

const classBase = "vuuThemeSwitch";

export type ThemeMode = "light" | "dark";

export interface ThemeSwitchProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  defaultMode?: ThemeMode;
  mode?: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}

const modes: ThemeMode[] = ["light", "dark"];

export const ThemeSwitch = ({
  className: classNameProp,
  defaultMode: defaultModeProp,
  mode: modeProp,
  onChange,
  ...htmlAttributes
}: ThemeSwitchProps) => {
  const [mode, setMode] = useControlled<ThemeMode>({
    controlled: modeProp,
    default: defaultModeProp ?? "light",
    name: "ThemeSwitch",
    state: "mode",
  });

  const selectedIndex = modes.indexOf(mode);

  const handleChangeSecondary: ToggleButtonGroupChangeEventHandler =
    useCallback(
      (_evt, index) => {
        const mode = modes[index];
        setMode(mode);
        onChange(mode);
      },
      [onChange, setMode]
    );
  const className = cx(classBase, classNameProp);
  return (
    <ToggleButtonGroup
      className={className}
      {...htmlAttributes}
      onChange={handleChangeSecondary}
      selectedIndex={selectedIndex}
    >
      <ToggleButton
        aria-label="alert"
        tooltipText="Light Theme"
        data-icon="light"
      />
      <ToggleButton
        aria-label="home"
        tooltipText="Dark Theme"
        data-icon="dark"
      />
    </ToggleButtonGroup>
  );
};
