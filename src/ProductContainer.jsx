import React from "react";
import ReactDOM from "react-dom"

import { connect } from 'react-redux';
import styles from "ProductContainer.scss";

import InfiniteScrollContainer from "InfiniteScrollContainer.jsx";
import { ProductItemA, ProductItemB } from "ProductItem.jsx";
import { fetchProductsAC, fetchProductDetailsAC } from "state";

/** ProductContainer ***********************************************************/

class ProductContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            datasetSize: 1000,
            itemOverflow: 50,
            filterText: "",
            datasetFiltered: this.props.productList.slice(0),
            itemFactory: "productItemA",

        };

        this.updateDatasetOptions = this.updateDatasetOptions.bind(this);
        this.updateDatasetSize = this.updateDatasetSize.bind(this);
        this.updateitemOverflow = this.updateitemOverflow.bind(this);
        this.updateFilterText = this.updateFilterText.bind(this);
        this.updateItemFactory = this.updateItemFactory.bind(this);
    }

    componentDidMount() {
        this.props.fetchProductList(this.state.datasetSize);
    }

    productFactoryA (prod) {
        return (
            <ProductItemA key={prod.id} productId={prod.id} productName={prod.name} />
        );
    }

    productFactoryB (prod) {
        return (
            <ProductItemB key={prod.id} productId={prod.id} productName={prod.name} />
        );
    }

    updateDatasetOptions (event) {
        event.preventDefault();
        this.props.fetchProductList(this.state.datasetSize);
    }

    updateDatasetSize (event) {
        let newValue = event.target.value === "" ? 0 : parseInt(event.target.value);
        this.setState({ datasetSize: newValue });
    }

    updateitemOverflow (event) {
        let newValue = event.target.value === "" ? 0 : parseInt(event.target.value);
        this.setState({ itemOverflow: newValue });
    }

    updateFilterText (event) {
        let filteredList = this.props.productList.filter(item => {
            return item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        })

        this.setState({datasetFiltered: filteredList, filterText: event.target.value});
    }

    updateItemFactory (event) {
        this.setState({itemFactory: event.target.value});
    }

    componentDidUpdate (prevProps, prevState) {
        if (prevProps.productList !== this.props.productList) {
            this.setState({datasetFiltered: this.props.productList.slice(0), filterText: ""});
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <form className={styles.form} onSubmit={this.updateDatasetOptions}>
                    <input placeholder="dataset size" type="number" value={this.state.datasetSize} onChange={this.updateDatasetSize} />
                    <input type="submit" value="update dataset" />
                </form>

                <form className={styles.form}>
                    <label htmlFor="itemOverflow">item overflow:</label>
                    <input id="itemOverflow" placeholder="itemOverflow" type="number" value={this.state.itemOverflow} onChange={this.updateitemOverflow} />
                    <label htmlFor="radioA">factoryA</label>
                    <input id="radioA" type="radio" value={"productItemA"} checked={this.state.itemFactory === "productItemA"} onChange={this.updateItemFactory} />
                    <label htmlFor="radioB">factoryB</label>
                    <input id="radioB" type="radio" value={"productItemB"} checked={this.state.itemFactory === "productItemB"} onChange={this.updateItemFactory} />
                </form>

                <input className={styles.filter} placeholder="filter" type="text" value={this.state.filterText} onChange={this.updateFilterText} />

                <div className={styles.datacontainer}>
                    <InfiniteScrollContainer
                        dataset={this.state.datasetFiltered}
                        itemOverflow={this.state.itemOverflow}
                        itemHeight={55}
                        itemFactory={this.state.itemFactory === "productItemA" ? this.productFactoryA : this.productFactoryB} />
                </div>
            </div>
        )
    }
}

/** Connect state and actions **************************************************/

const mapStateToProps = (state) => {
    return {productList: state.productList, productDetailed: state.productDetailed, productDetailsLoading: state.productDetailsLoading}
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchProductList: (thisMany) => {
            dispatch(fetchProductsAC(thisMany));
        },
        fetchProductDetails: (name) => {
            dispatch(fetchProductDetailsAC(name));
        },
        fetchProductDetailsCancel: () => {
            dispatch(fetchProductDetailsCancelledAC());
        }
    };
}

/** Exports ********************************************************************/

export default connect(mapStateToProps, mapDispatchToProps)(ProductContainer)
