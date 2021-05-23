import "../src/theme/globals.scss";
import "../src/theme/variables.scss";
import "../public/fonts/Helvetica/stylesheet.css";
import "../public/fonts/Graphik/stylesheet.css";
import {withComponent} from "./decorators/with-component";
import {ConnectWalletProvider} from "@app/modules/connect-wallet-modal/ConnectWalletProvider";
import {withNextRouter} from "storybook-addon-next-router";

export const parameters = {
  actions: {argTypesRegex: "^on[A-Z].*"},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}


export const decorators = [
  withComponent(ConnectWalletProvider),
  withNextRouter({
    path: '/', // defaults to `/`
    asPath: '/', // defaults to `/`
    query: {}, // defaults to `{}`
    push() {
    } // defaults to using addon actions integration, can override any method in the router
  })
]
