import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

/**
 * Represents an item in a category.
 * @class Item
 * */
export default class Item extends Component {
    /**
     * @constructs Item
     * @param {Object} props - Object passed down to us from our parent.
     * @param {{name: string, price: string, description: string, picture: string }} props.item
     * */
    constructor(props) {
        super(props);
    }

    /**
     *@member render - Renders Virtual DOM.
     * */
    render() {
        return (
            <div className="card">
                <div className="content">
                    <img className="ui medium circular bordered image" src={this.props.item.picture}></img>
                    <div className="header">
                        Name: {this.props.item.name}
                    </div>
                    <div className="meta">
                        Price: ${this.props.item.price}
                    </div>
                    <div className="content">
                        Description: {this.props.item.description}
                    </div>
                </div>
                <div className="extra content"
                     style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}>
                    <div className="ui two butons">
                        <div className="ui basic blue button">Edit</div>
                        <div className="ui basic red button">Delete</div>
                    </div>
                </div>
            </div>
        );
    }
}

Item.defaultProps = {
    item: {
        name: " ",
        picture: "",
        price: "0",
        description: " ",
        login_status: this.STATUS.LoggedOut }
};