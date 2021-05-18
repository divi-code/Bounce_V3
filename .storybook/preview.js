import "../src/theme/globals.scss";
import "../src/theme/variables.scss";
import "../public/fonts/Helvetica/stylesheet.css";
import "../public/fonts/Graphik/stylesheet.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
