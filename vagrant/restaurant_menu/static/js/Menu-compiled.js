import React from 'react';
import MenuItems from './MenuItems';
import NewItemForm from './NewItemForm';

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
        this.loadItemsFromServer = this.loadItemsFromServer.bind(this);
        this.handleNewItemSubmit = this.handleNewItemSubmit.bind(this);
        this.deleteMenuItem = this.deleteMenuItem.bind(this);
    }

    //Loads/refreshes menu items in display.
    loadItemsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data.MenuItems });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }
    //Stores the new item in the server and updates the
    //menu accordingly once the server has responded appropriately.
    handleNewItemSubmit(item) {
        var restaurant = this.props.restaurant;
        var MenuItems = this.state.data;
        var endpoint = "/restaurants/" + restaurant.id + "/menu/new";
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: item,
            success: function (data) {
                var NewItemWrapper = data['NewItem'];
                var NewItem = NewItemWrapper[0];
                var newMenuItems = MenuItems.concat([NewItem]);
                this.setState({ data: newMenuItems });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(endpoint, status, err.toString());
            }.bind(this)
        });
    }

    componentDidMount() {
        this.loadItemsFromServer();
        setInterval(this.loadItemsFromServer, this.props.pollInterval);
    }

    deleteMenuItem(e) {
        var key = parseInt(e.target.attributes.getNamedItem('data-key').value, 10);
        var index = parseInt(e.target.attributes.getNamedItem('data-index').value, 10);
        console.log("Erased menu item with key %d and index %d", key, index);
        this.setState({ data: this.state.data.splice(index, 1) });
        var restaurant = this.props.restaurant;
        var endpoint = "/restaurants/" + restaurant.id + "/" + key + "/delete";
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: key,
            success: function (data) {
                this.setState({ data: data.MenuItems });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(endpoint, status, err.toString());
            }.bind(this)
        });
    }

    render() {
        var restaurant = this.props.restaurant;
        return React.createElement(
            'div',
            { className: 'Menu' },
            React.createElement(
                'h2',
                null,
                restaurant.name + "'s",
                ' Menu'
            ),
            React.createElement(MenuItems, { data: this.state.data, deleteMenuItem: this.deleteMenuItem }),
            React.createElement(NewItemForm, { onNewItemSubmit: this.handleNewItemSubmit })
        );
    }
}

//# sourceMappingURL=Menu-compiled.js.map