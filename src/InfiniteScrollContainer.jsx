import React from "react";
import styles from "InfiniteScrollContainer.scss";

class InfiniteScrollContainer extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            renderedSlice: { start: 0, end: 0 },
            placeholder: { top: 0, bot: 0 },
            prevScrollTop: 0
        };

        this.threshold = 1;
    }

    componentDidMount () {
        let viewportCapacity = Math.ceil(this.container.offsetHeight / this.props.itemHeight);
        let itemRendered = viewportCapacity + this.props.itemOverflow;

        let initstate = this.getStartingValues(this.props.dataset.length, itemRendered, this.props.itemHeight);
        this.setState(initstate);
    }

    componentDidUpdate (prevProps, prevState) {
        let viewportCapacity = Math.ceil(this.container.offsetHeight / this.props.itemHeight);
        let itemRendered = viewportCapacity + this.props.itemOverflow;

        if ( prevProps.dataset != this.props.dataset ) {
            let initstate = this.getStartingValues(this.props.dataset.length, itemRendered, this.props.itemHeight);
            this.setState(initstate);
            this.container.scrollTop = 0;
        }

        if ( prevProps.itemOverflow != this.props.itemOverflow ) {
            let initstate = this.getStartingValues(this.props.dataset.length, itemRendered, this.props.itemHeight);
            this.setState(initstate);
            this.container.scrollTop = 0;
        }
    }

    getStartingValues (itemCount, itemRendered, itemHeight) {
        let slice = { start: 0, end: Math.min(itemRendered, itemCount) };
        let placeholder = this.calcPlaceholder(itemCount, itemHeight, itemRendered, slice.start);

        return { renderedSlice: slice, placeholder: placeholder, prevScrollTop: 0 };
    }

    calcPlaceholder (itemCount, itemHeight, itemRendered, renderedSliceStart) {
        let assumedSizeOfDataset = itemCount * itemHeight;
        let assumedSizeOfDisplayedItems =
            (itemCount > itemRendered) ? (itemRendered * itemHeight) : assumedSizeOfDataset;

        let topPlaceholderSize = renderedSliceStart * itemHeight;
        let botPlaceholderSize = assumedSizeOfDataset - assumedSizeOfDisplayedItems - topPlaceholderSize;

        return { top: topPlaceholderSize, bot: botPlaceholderSize };
    }

    // more items above
    calcLeftShift (itemViewportTop, itemViewportBot, itemRendered, threshold) {
        let itemsInViewport = itemViewportBot - itemViewportTop;
        let target = itemViewportTop - (itemRendered - itemsInViewport - threshold);

        let startingItem = Math.max(target, 0);
        return { start: startingItem, end: startingItem + itemRendered };
    }

    // more items below
    calcRightShift (itemViewportTop, itemCount, itemRendered, threshold) {
        let target = itemViewportTop - (threshold);
        let max = itemCount - itemRendered;

        let startingItem = Math.min(target, max);
        return { start: startingItem, end: startingItem + itemRendered };
    }

    onScrollHandler = (e) => {
        let itemCount = this.props.dataset.length;
        let renderedItems = this.state.renderedSlice.end - this.state.renderedSlice.start;
        let isScrollingDownward = this.state.prevScrollTop < e.target.scrollTop;

        let scrollAreaHeight = this.container.offsetHeight;
        let sum = e.target.scrollTop + scrollAreaHeight;

        let itemViewportTop = Math.floor(e.target.scrollTop / this.props.itemHeight);
        let itemViewportBot = Math.floor(sum / this.props.itemHeight);

        let itemsAboveViewport = itemViewportTop - this.state.renderedSlice.start;
        let itemsBelowViewport = this.state.renderedSlice.end - itemViewportBot;

        let viewportCapacity = Math.ceil(scrollAreaHeight / this.props.itemHeight);
        let itemRendered = viewportCapacity + this.props.itemOverflow;

        console.log("renderedItems", renderedItems, "itemViewportTop", itemViewportTop, "itemViewportBot", itemViewportBot, "slice", this.state.renderedSlice, "items above", itemsAboveViewport, "items below", itemsBelowViewport);

        let topRunningOut = this.state.renderedSlice.start > 0 && itemsAboveViewport <= this.threshold;
        let botRunningOut = this.state.renderedSlice.end < itemCount && itemsBelowViewport <= this.threshold;

        // more item needed above
        if ( topRunningOut && !isScrollingDownward ) {
            let newSlice = this.calcLeftShift(itemViewportTop, itemViewportBot, itemRendered, this.threshold);
            let newPlaceholder = this.calcPlaceholder(itemCount, this.props.itemHeight, itemRendered, newSlice.start);

            this.setState({ renderedSlice: newSlice, placeholder: newPlaceholder, prevScrollTop: e.target.scrollTop });
        }

        // more item needed below
        if ( botRunningOut && isScrollingDownward ) {
            let newSlice = this.calcRightShift(itemViewportTop, itemCount, itemRendered, this.threshold);
            let newPlaceholder = this.calcPlaceholder(itemCount, this.props.itemHeight, itemRendered, newSlice.start);

            this.setState({ renderedSlice: newSlice, placeholder: newPlaceholder, prevScrollTop: e.target.scrollTop });
        }
    }

    render () {
        let list = this.props.dataset
            .slice(this.state.renderedSlice.start, this.state.renderedSlice.end)
            .map(data => this.props.itemFactory(data));

        return (
            <div onScroll={this.onScrollHandler} className={styles.container} ref={ div => this.container = div }>
                <Placeholder pheight={ this.state.placeholder.top } />
                { list }
                <Placeholder pheight={ this.state.placeholder.bot } />
            </div>
        )
    }
}

/** Placeholder ****************************************************************/

const Placeholder = ({ pheight }) => {
    let element = (pheight > 0) ? (<div style={{ height: pheight + "px", backgroundColor: "cornflowerblue" }}></div>) : null;
    return (element);
}

export default InfiniteScrollContainer;
