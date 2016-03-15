'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _NewItemForm = require('./NewItemForm');

var _NewItemForm2 = _interopRequireDefault(_NewItemForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menu = function (_Component) {
    _inherits(Menu, _Component);

    function Menu(props) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Menu).call(this, props));

        _this.state = { data: [] };
        return _this;
    }

    //Stores the new item in the server and updates the
    //menu accordingly once the server has responded appropriately.


    _createClass(Menu, [{
        key: 'handleNewItemSubmit',
        value: function handleNewItemSubmit(item) {
            this.props.addMenuItem(item);
        }

        //@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/edit', methods=['POST'])

    }, {
        key: 'editMenuItem',
        value: function editMenuItem(item) {
            var restaurantId = this.props.id;
            var itemId = item.id;
            var endpoint = "/restaurants/" + restaurantId + "/" + itemId + "/edit";
            $.ajax({
                url: endpoint,
                dataType: 'json',
                type: 'post',
                data: item,
                cache: false,
                success: function (menuItem) {
                    console.log("Success!");
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(restaurantListURL, status, err.toString());
                }.bind(this)
            });
        }
    }, {
        key: 'deleteMenuItem',
        value: function deleteMenuItem(item) {
            console.log("Menu item:");
            console.log(item);
            this.props.deleteMenuItem(item);
        }
    }, {
        key: 'render',
        value: function render() {
            var name = this.props.initialized ? this.props.name + "'s" : "";
            return _react2.default.createElement(
                'div',
                { className: 'Menu' },
                _react2.default.createElement(
                    'h2',
                    null,
                    name,
                    ' Menu'
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    this.props.menuItems.map(function (item, index) {
                        return _react2.default.createElement(_MenuItem2.default, { key: item.id,
                            item: item,
                            index: index,
                            editMenuItem: this.editMenuItem,
                            deleteMenuItem: this.deleteMenuItem });
                    }.bind(this))
                ),
                _react2.default.createElement(_NewItemForm2.default, { onNewItemSubmit: this.handleNewItemSubmit })
            );
        }
    }]);

    return Menu;
}(_Component3.default);

exports.default = Menu;