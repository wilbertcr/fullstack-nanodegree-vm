import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Item from './Item';

/**
 * Main container.
 * @class ItemsContainer
 * */
export default class ItemsContainer extends Component {
    /**
     * @constructs ItemsContainer
     * @param {Object} props - Object passed down to us from our parent..
     * */
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ui cards container">
                {this.props.items.map(
                    function(item,index){
                        return <Item key={item.id}
                                index={index}
                                item={item}
                                {...this.props}
                                />;
                    }.bind(this)
                )}
            </div>
        );
    }
}