

var MenuItems = React.createClass({
    displayName: "MenuItems",

    render: function () {
        var menuItemNodes = this.props.data.map(function (item, index) {
            return React.createElement(
                "table",
                { key: item.id },
                React.createElement(
                    "tbody",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "name left" },
                            item.name
                        ),
                        React.createElement(
                            "td",
                            { className: "price right" },
                            "$",
                            item.price
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "left description" },
                            item.description
                        ),
                        React.createElement("td", { className: "right" })
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "left" },
                            React.createElement(
                                "button",
                                { className: "editItemButton",
                                    onClick: this.props.editMenuItem,
                                    "data-key": item.id,
                                    "data-index": index },
                                "edit"
                            )
                        ),
                        React.createElement(
                            "td",
                            { className: "right" },
                            React.createElement(
                                "button",
                                { className: "deleteItemButton",
                                    onClick: this.props.deleteMenuItem,
                                    "data-key": item.id,
                                    "data-index": index },
                                "delete"
                            )
                        )
                    )
                )
            );
        }.bind(this));
        return React.createElement(
            "div",
            { className: "menuItems" },
            menuItemNodes
        );
    }
});

var Menu = React.createClass({
    displayName: "Menu",

    //Loads/refreshes menu items in display.
    loadItemsFromServer: function () {
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
    },
    //Stores the new item in the server and updates the
    //menu accordingly once the server has responded appropriately.
    handleNewItemSubmit: function (item) {
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
    },
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
        this.loadItemsFromServer();
        setInterval(this.loadItemsFromServer, this.props.pollInterval);
    },
    deleteMenuItem: function (e) {
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
    },
    render: function () {
        var restaurant = this.props.restaurant;
        return React.createElement(
            "div",
            { className: "Menu" },
            React.createElement(
                "h2",
                null,
                restaurant.name + "'s",
                " Menu"
            ),
            React.createElement(MenuItems, { data: this.state.data, deleteMenuItem: this.deleteMenuItem }),
            React.createElement(NewItemForm, { onNewItemSubmit: this.handleNewItemSubmit })
        );
    }
});

var NewItemForm = React.createClass({
    displayName: "NewItemForm",

    getInitialState: function () {
        return { name: '', price: '', course: '', description: '' };
    },
    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },
    handleDescriptionChange: function (e) {
        this.setState({ description: e.target.value });
    },
    handlePriceChange: function (e) {
        this.setState({ price: e.target.value });
    },
    handleCourseChange: function (e) {
        this.setState({ course: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var description = this.state.description.trim();
        var price = this.state.price.trim();
        var course = this.state.course.trim();
        this.props.onNewItemSubmit({ name: name, description: description, price: price, course: course });
        this.setState({ name: '', description: '', price: '', course: '' });
    },
    render: function () {
        return React.createElement(
            "form",
            { className: "newItemForm", onSubmit: this.handleSubmit },
            React.createElement("input", {
                type: "text",
                placeholder: "Name",
                value: this.state.name,
                onChange: this.handleNameChange
            }),
            React.createElement("br", null),
            React.createElement("input", {
                type: "text",
                placeholder: "Description",
                value: this.state.description,
                onChange: this.handleDescriptionChange
            }),
            React.createElement("br", null),
            React.createElement("input", {
                type: "text",
                placeholder: "Price",
                value: this.state.price,
                onChange: this.handlePriceChange
            }),
            React.createElement("br", null),
            React.createElement("input", {
                type: "text",
                placeholder: "Course",
                value: this.state.course,
                onChange: this.handleCourseChange
            }),
            React.createElement("br", null),
            React.createElement("input", { className: "redButton", type: "submit", value: "Submit" })
        );
    }
});

var NewRestaurantForm = React.createClass({
    displayName: "NewRestaurantForm",

    getInitialState: function () {
        return { name: '' };
    },
    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var data = { name: name };
        this.props.onNewRestaurantSubmit(data);
        this.state.name = '';
    },
    render: function () {
        return React.createElement(
            "form",
            { className: "newRestaurantForm", onSubmit: this.handleSubmit },
            React.createElement("input", {
                type: "text",
                placeholder: "Name",
                value: this.state.name,
                onChange: this.handleNameChange
            }),
            React.createElement("br", null),
            React.createElement("input", { className: "redButton", type: "submit", value: "Submit" })
        );
    }
});

var Restaurant = React.createClass({
    displayName: "Restaurant",

    getInitialState: function () {
        return { comp: null };
    },
    displayMenu: function () {
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
    },
    render: function () {
        var restaurant = this.props.data;
        return React.createElement(
            "li",
            null,
            React.createElement(
                "a",
                { key: restaurant.id,
                    onClick: this.displayMenu },
                restaurant.name
            ),
            React.createElement(
                "button",
                { className: "editItemSmallButton",
                    onClick: this.props.deleteRestaurant,
                    "data-key": restaurant.id,
                    "data-index": this.props.index },
                "edit"
            ),
            React.createElement(
                "button",
                { className: "deleteItemSmallButton",
                    onClick: this.props.deleteRestaurant,
                    "data-key": restaurant.id,
                    "data-index": this.props.index },
                "delete"
            )
        );
    }
});

var RestaurantList = React.createClass({
    displayName: "RestaurantList",

    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
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
    },
    handleNewRestaurantSubmit: function (data) {
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
    },
    handleDeleteRestaurant: function (e) {
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
    },
    render: function () {
        var restaurantNodes = this.state.data.map(function (restaurant, index) {
            return React.createElement(Restaurant, { key: restaurant.id,
                index: index,
                data: restaurant,
                deleteRestaurant: this.handleDeleteRestaurant });
        }.bind(this));
        return React.createElement(
            "ul",
            { className: "mainnav" },
            restaurantNodes,
            React.createElement(NewRestaurantForm, { onNewRestaurantSubmit: this.handleNewRestaurantSubmit })
        );
    }
});

var EnclosingApp = React.createClass({
    displayName: "EnclosingApp",

    getInitialState: function () {
        return { data: [] };
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { id: "leftcolumn" },
                React.createElement(
                    "div",
                    null,
                    React.createElement(RestaurantList, { url: "/restaurants/JSON" })
                )
            ),
            React.createElement("div", { id: "centercolumn" }),
            React.createElement("div", { id: "rightcolumn" }),
            React.createElement(
                "div",
                { id: "footer" },
                "© Copyright with..."
            )
        );
    }
});

ReactDOM.render(React.createElement(EnclosingApp, null), document.getElementById('mainbox'));

//# sourceMappingURL=main-compiled.js.map