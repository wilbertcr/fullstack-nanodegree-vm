import React from 'react';
import NewRestaurantForm from './NewRestaurantForm';
import Restaurant from './Restaurant';

export default class RestaurantList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.handleNewRestaurantSubmit = this.handleNewRestaurantSubmit.bind(this);
        this.handleDeleteRestaurant = this.handleDeleteRestaurant.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data.restaurants });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    handleNewRestaurantSubmit(data) {
        var restaurants = this.state.data;
        var endpoint = "restaurants/new";
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function (data) {
                this.setState({ data: data.restaurants });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(endpoint, status, err.toString());
            }.bind(this)
        });
    }

    handleDeleteRestaurant(e) {
        var key = parseInt(e.target.attributes.getNamedItem('data-key').value, 10);
        var index = parseInt(e.target.attributes.getNamedItem('data-index').value, 10);
        console.log("Erased restaurant with key %d and index %d", key, index);
        this.setState({ data: this.state.data.splice(index, 1) });
        var restaurant_id = key;
        var endpoint = "/restaurants/" + restaurant_id + "/delete";
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: key,
            success: function (data) {
                this.setState({ data: data.restaurants });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(endpoint, status, err.toString());
            }.bind(this)
        });
    }

    render() {
        var restaurantNodes = this.state.data.map(function (restaurant, index) {
            return React.createElement(Restaurant, { key: restaurant.id,
                index: index,
                data: restaurant,
                deleteRestaurant: this.handleDeleteRestaurant });
        }.bind(this));
        return React.createElement(
            'ul',
            { className: 'mainnav' },
            restaurantNodes,
            React.createElement(NewRestaurantForm, { onNewRestaurantSubmit: this.handleNewRestaurantSubmit })
        );
    }
}

//# sourceMappingURL=RestaurantList-compiled.js.map