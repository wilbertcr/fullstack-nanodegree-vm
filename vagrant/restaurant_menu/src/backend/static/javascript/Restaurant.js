'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _riek = require('riek');

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var _Menu = require('./Menu');

var _Menu2 = _interopRequireDefault(_Menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Restaurant = function (_Component) {
    _inherits(Restaurant, _Component);

    function Restaurant(props) {
        _classCallCheck(this, Restaurant);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Restaurant).call(this, props));

        _this.state = { name: '', editing: false };
        _this.props = { data: {} };
        return _this;
    }

    _createClass(Restaurant, [{
        key: 'editRestaurant',
        value: function editRestaurant(data) {
            var name = data.name;
            var id = this.props.restaurant.id;
            var index = this.props.index;
            var restaurant = { name: name, index: index, id: id };
            this.props.editRestaurant(restaurant);
            this.setState({ editing: false });
        }
    }, {
        key: 'deleteRestaurant',
        value: function deleteRestaurant() {
            this.props.deleteRestaurant(this.props.restaurant.id);
        }
    }, {
        key: 'displayMenu',
        value: function displayMenu() {
            this.props.displayMenu(this.props.restaurant);
        }
    }, {
        key: 'handleEdit',
        value: function handleEdit(e) {
            if (!this.state.editing) {
                this.setState({ editing: true });
            } else {
                this.setState({ editing: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var restaurant = this.props.restaurant;
            var name;
            if (this.state.editing === true) {
                name = _react2.default.createElement(_riek.RIEInput, {
                    value: restaurant.name,
                    propName: 'name',
                    change: this.editRestaurant,
                    className: 'InLineEdit'
                });
            } else {
                name = restaurant.name;
            }
            return _react2.default.createElement(
                'li',
                null,
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement('span', { className: 'fa fa-pencil-square-o',
                        onClick: this.handleEdit }),
                    ' ',
                    _react2.default.createElement(
                        'span',
                        { className: 'fa fa-trash',
                            onClick: this.deleteRestaurant },
                        '  '
                    ),
                    _react2.default.createElement(
                        'a',
                        { className: 'navbarLink',
                            onClick: this.displayMenu },
                        name
                    )
                )
            );
        }
    }]);

    return Restaurant;
}(_Component3.default);

exports.default = Restaurant;