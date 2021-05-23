import {ComponentClass} from "react";

export const withComponent = (Component: ComponentClass) => (Story) => (
  <Component>
    <Story />
  </Component>
);
