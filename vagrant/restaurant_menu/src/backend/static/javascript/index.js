'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var _RestaurantList = require('./RestaurantList');

var _RestaurantList2 = _interopRequireDefault(_RestaurantList);

var _Menu = require('./Menu');

var _Menu2 = _interopRequireDefault(_Menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RestaurantsApp = function (_Component) {
    _inherits(RestaurantsApp, _Component);

    function RestaurantsApp(props) {
        _classCallCheck(this, RestaurantsApp);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RestaurantsApp).call(this, props));

        _this.state = {
            restaurantListURL: "/restaurants/JSON",
            initialized: false,
            id: 0,
            name: "",
            menuItems: [],
            restaurants: []
        };
        console.log("test");
        return _this;
    }

    _createClass(RestaurantsApp, [{
        key: 'displayMenu',
        value: function displayMenu(restaurant) {
            var endpoint = "/restaurants/" + restaurant.id + "/menu/JSON";
            $.ajax({
                url: endpoint,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var prevState = this.state;
                    var newState = _extends({}, this.state, {
                        menuItems: data.MenuItems,
                        initialized: true,
                        name: restaurant.name,
                        id: restaurant.id });
                    this.setState(newState);
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(url, status, err.toString());
                }.bind(this)
            });
        }
    }, {
        key: 'addMenuItem',
        value: function addMenuItem(item) {
            var endpoint = "/restaurants/" + this.state.id + "/menu/new";
            $.ajax({
                url: endpoint,
                dataType: 'json',
                type: 'POST',
                data: item,
                success: function (data) {
                    var newItem = data['NewItem'];
                    var menuItems = [newItem].concat(_toConsumableArray(this.state.menuItems));
                    this.setState({ menuItems: menuItems });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(endpoint, status, err.toString());
                }.bind(this)
            });
        }
    }, {
        key: 'deleteMenuItem',
        value: function deleteMenuItem(item) {
            console.log("Deleting item with id: %d", item.id);
            var restaurantId = this.state.id;
            var itemId = item.id;
            var menuItems = [].concat(_toConsumableArray(this.state.menuItems));
            for (var i = 0; i < menuItems.length; i++) {
                if (menuItems[i].id = itemId) {
                    menuItems.splice(i, 1);
                    this.setState({ menuItems: menuItems });
                    break;
                }
            }
            var endpoint = "/restaurants/" + restaurantId + "/delete/" + itemId;
            $.ajax({
                url: endpoint,
                dataType: 'json',
                type: 'POST',
                data: [],
                success: function (data) {
                    this.setState({ menuItems: data.MenuItems });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(endpoint, status, err.toString());
                }.bind(this)
            });
        }
    }, {
        key: 'addRestaurant',
        value: function addRestaurant(restaurant) {
            var endpoint = "restaurants/new";
            $.ajax({
                url: endpoint,
                dataType: 'json',
                type: 'POST',
                data: restaurant,
                success: function (data) {
                    this.setState({ restaurants: data.restaurants });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(endpoint, status, err.toString());
                }.bind(this)
            });
        }
    }, {
        key: 'deleteRestaurant',
        value: function deleteRestaurant(id) {
            console.log("Erasing data with id: %d", id);
            var restaurants = [].concat(_toConsumableArray(this.state.restaurants));
            for (var i = 0; i < restaurants.length; i++) {
                if (restaurants[i].id === id) {
                    restaurants.splice(i, 1);
                    if (id !== this.state.id) {
                        this.setState({ restaurants: restaurants });
                    } else {
                        this.setState({ restaurants: restaurants,
                            initialized: false,
                            name: "",
                            menuItems: [],
                            id: 0 });
                    }
                    break;
                }
            }
            var endpoint = "/restaurants/delete/" + id;
            $.ajax({
                url: endpoint,
                dataType: 'json',
                type: 'POST',
                data: id,
                success: function (data) {
                    this.setState({ restaurants: restaurants });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(endpoint, status, err.toString());
                }.bind(this)
            });
        }
    }, {
        key: 'loadRestaurants',
        value: function loadRestaurants() {
            $.ajax({
                url: this.state.restaurantListURL,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    this.setState({ restaurants: data.restaurants });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(restaurantListURL, status, err.toString());
                }.bind(this)
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.loadRestaurants();
            setInterval(this.loadRestaurants, 120000);
        }
    }, {
        key: 'render',
        value: function render() {
            var menu;
            menu = _react2.default.createElement(_Menu2.default, { initialized: this.state.initialized,
                name: this.state.name,
                id: this.state.id,
                menuItems: this.state.menuItems,
                addMenuItem: this.addMenuItem,
                deleteMenuItem: this.deleteMenuItem });
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { id: 'leftcolumn' },
                    _react2.default.createElement(_RestaurantList2.default, { restaurants: this.state.restaurants,
                        displayMenu: this.displayMenu,
                        deleteRestaurant: this.deleteRestaurant,
                        addRestaurant: this.addRestaurant })
                ),
                _react2.default.createElement(
                    'div',
                    { id: 'centercolumn' },
                    menu
                ),
                _react2.default.createElement('div', { id: 'rightcolumn' }),
                _react2.default.createElement(
                    'div',
                    { id: 'footer' },
                    '© Copyright with...'
                )
            );
        }
    }]);

    return RestaurantsApp;
}(_Component3.default);

exports.default = RestaurantsApp;


$(document).ready(function () {
    _reactDom2.default.render(_react2.default.createElement(RestaurantsApp, null), document.getElementById("mainbox"));
});