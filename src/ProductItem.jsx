import React from "react";
import CSSModules from 'react-css-modules';
import styles from "ProductItem.scss";


const productItemA = ({productId, productName}) => {
    return (
        <div styleName="container">{ productId + " - " + productName }</div>
    );
};

const productItemB = ({productId, productName}) => {
    return (
        <div styleName="container2">{ productName.toUpperCase() + " - " + productId }</div>
    );
};

let ProductItemA = CSSModules(productItemA, styles);
let ProductItemB = CSSModules(productItemB, styles);

export { ProductItemA, ProductItemB };
