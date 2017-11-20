import React from "react";
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import "index.scss";
import store from "state"
import ProductContainer from "ProductContainer.jsx"

if (module.hot) module.hot.accept();

ReactDOM.render(
  <Provider store={ store }>
      <ProductContainer />
  </Provider>
  ,document.querySelector("#root")
);
