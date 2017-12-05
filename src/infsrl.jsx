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
        const placeholder = this.calcPlaceholder2(this.props.dataset.length, this.props.itemHeight, slice);

        return { renderedSlice: slice, placeholder: placeholder, prevScrollTop: 0 };
    }

    // ------------------------------------------------------------------------------------------------------------------

    calcShiftUpwards (ontopCurrent, onbotCurrent, overflow, itemCount) {
        const newtop = Math.max(ontopCurrent - overflow, 0);
        const newbot = Math.min(onbotCurrent + 1, itemCount);

        return { start: newtop, end: newbot };
    }

    calcShiftDownwards (ontopCurrent, onbotCurrent, overflow, itemCount) {
        const newtop = Math.max(ontopCurrent - 1, 0);
        const newbot = Math.min(onbotCurrent + overflow, itemCount);

        return { start: newtop, end: newbot };
    }

    calcPlaceholder2(itemcount, itemheight, newslice) {
        const total = itemcount * itemheight;
        const displayed = (newslice.end - newslice.start) * itemheight;

        const newtop = newslice.start * itemheight;
        const newbot = total - displayed - newtop;

        return { top: newtop, bot: newbot };
    }

    // ------------------------------------------------------------------------------------------------------------------

    onScrollHandler = (e) => {
        const overflow = this.props.itemOverflow;
        const treshold = 1;

        const vpCapacity = Math.ceil(e.target.offsetHeight / this.props.itemHeight);
        const ontop = Math.floor(e.target.scrollTop / this.props.itemHeight);
        const onbot = Math.floor((e.target.scrollTop + e.target.offsetHeight) / this.props.itemHeight);

        console.log('capacity', vpCapacity, 'ontop', ontop, 'onbot', onbot);

        if (this.state.prevScrollTop > e.target.scrollTop && this.state.renderedSlice.start >= ontop - treshold) {
            const newslice = this.calcShiftUpwards(ontop, onbot, overflow, this.props.dataset.length);
            let newph = this.calcPlaceholder2(this.props.dataset.length, this.props.itemHeight, newslice);

            console.log('load more above', newslice, newph);

            this.setState({ renderedSlice: newslice, placeholder: newph, prevScrollTop: e.target.scrollTop });

        } else if (this.state.prevScrollTop < e.target.scrollTop && this.state.renderedSlice.end <= onbot + treshold) {
            const newslice = this.calcShiftDownwards(ontop, onbot, overflow, this.props.dataset.length);
            let newph = this.calcPlaceholder2(this.props.dataset.length, this.props.itemHeight, newslice);

            console.log('load more below', newslice, newph);

            this.setState({ renderedSlice: newslice, placeholder: newph, prevScrollTop: e.target.scrollTop });
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

/** Exports ****************************************************************/
export default InfiniteScrollContainer;
