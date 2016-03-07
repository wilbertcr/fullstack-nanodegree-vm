import React from 'react';
import Menu from './Menu';

export default class Restaurant extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = { comp: null };
        this.props = { data: {} };
        this.displayMenu = this.displayMenu.bind(this);
    }

    displayMenu() {
        var restaurant = this.props.data;
        if (this.state.comp) {
            $.ajax({
                url: "/restaurants/" + restaurant.id + "/menu/JSON",
                dataType: 'json',
                cache: false,
                success: function (data) {
                    this.state.comp.setState({ data: data.MenuItems });
                    console.log("Refreshed menu.");
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        } else {
            this.state.comp = ReactDOM.render(React.createElement(Menu, { url: "/restaurants/" + restaurant.id + "/menu/JSON", restaurant: restaurant, pollInterval: 2000 }), document.getElementById('centercolumn'));
            console.log("Rendering menu.");
        }
    }

    render() {
        var restaurant = this.props.data;
        return React.createElement(
            'li',
            null,
            React.createElement(
                'a',
                { key: restaurant.id,
                    onClick: this.displayMenu },
                restaurant.name
            ),
            React.createElement(
                'button',
                { className: 'editItemSmallButton',
                    onClick: this.props.deleteRestaurant,
                    'data-key': restaurant.id,
                    'data-index': this.props.index },
                'edit'
            ),
            React.createElement(
                'button',
                { className: 'deleteItemSmallButton',
                    onClick: this.props.deleteRestaurant,
                    'data-key': restaurant.id,
                    'data-index': this.props.index },
                'delete'
            )
        );
    }
}

//# sourceMappingURL=Restaurant-compiled.js.map