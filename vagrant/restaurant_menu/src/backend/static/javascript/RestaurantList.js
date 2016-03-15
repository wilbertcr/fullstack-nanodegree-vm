'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var _NewRestaurantForm = require('./NewRestaurantForm');

var _NewRestaurantForm2 = _interopRequireDefault(_NewRestaurantForm);

var _Restaurant = require('./Restaurant');

var _Restaurant2 = _interopRequireDefault(_Restaurant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RestaurantList = function (_Component) {
    _inherits(RestaurantList, _Component);

    function RestaurantList(props) {
        _classCallCheck(this, RestaurantList);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(RestaurantList).call(this, props));
    }

    _createClass(RestaurantList, [{
        key: 'addRestaurant',
        value: function addRestaurant(data) {
            this.props.addRestaurant(data);
        }
    }, {
        key: 'deleteRestaurant',
        value: function deleteRestaurant(id) {
            this.props.deleteRestaurant(id);
        }
    }, {
        key: 'editRestaurant',
        value: function editRestaurant(restaurant) {
            var name = restaurant.name;
            var id = restaurant.id;
            var index = restaurant.index;
            var newRestaurant = { name: name, id: id };
            this.setState({ data: this.props.restaurants.splice(index, 1, newRestaurant) });
            var endpoint = "/restaurants/edit/" + id;
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
        key: 'displayMenu',
        value: function displayMenu(restaurant) {
            this.props.displayMenu(restaurant);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'ul',
                    { className: 'mainnav' },
                    this.props.restaurants.map(function (restaurant, index) {
                        return _react2.default.createElement(_Restaurant2.default, { key: restaurant.id,
                            index: index,
                            restaurant: restaurant,
                            deleteRestaurant: this.deleteRestaurant,
                            editRestaurant: this.editRestaurant,
                            displayMenu: this.displayMenu
                        });
                    }.bind(this))
                ),
                _react2.default.createElement(_NewRestaurantForm2.default, { onNewRestaurantSubmit: this.addRestaurant })
            );
        }
    }]);

    return RestaurantList;
}(_Component3.default);

exports.default = RestaurantList;