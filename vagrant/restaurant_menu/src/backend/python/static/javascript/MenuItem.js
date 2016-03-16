'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

var _riek = require('riek');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //Menu items can delete themselves by calling a
//function(deleteMenuItem) in their parent(Menu)
//and sending the key(or item.id) to it.
//Not only will this delete the item from the underlying
//data array, but also from the DB, asynchronously via ajax.


var MenuItem = function (_Component) {
    _inherits(MenuItem, _Component);

    function MenuItem(props) {
        _classCallCheck(this, MenuItem);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MenuItem).call(this, props));

        _this.state = { editing: false,
            editButtonState: "Edit" };
        return _this;
    }

    _createClass(MenuItem, [{
        key: 'editMenuItem',
        value: function editMenuItem(e) {
            if (!this.state.editing) {
                this.setState({ editing: true, editButtonState: "Done" });
            } else {
                this.setState({ editing: false, editButtonState: "Edit" });
            }
        }
    }, {
        key: 'deleteMenuItem',
        value: function deleteMenuItem() {
            console.log("Menu item:");
            console.log(this.props.item);
            this.props.deleteMenuItem(this.props.item);
        }
    }, {
        key: 'handleNameChange',
        value: function handleNameChange(data) {
            this.props.item.name = data.name;
            this.props.editMenuItem(this.props.item);
        }
    }, {
        key: 'handlePriceChange',
        value: function handlePriceChange(data) {
            this.props.item.price = data.price;
            this.props.editMenuItem(this.props.item);
        }
    }, {
        key: 'handleDescriptionChange',
        value: function handleDescriptionChange(data) {
            this.props.item.description = data.description;
            this.props.editMenuItem(this.props.item);
        }
    }, {
        key: 'render',
        value: function render() {
            var item = this.props.item;
            var name;
            var price;
            var description;
            if (this.state.editing === true) {
                name = _react2.default.createElement(_riek.RIEInput, {
                    value: item.name,
                    propName: 'name',
                    change: this.handleNameChange,
                    className: 'InLineEdit',
                    classEditing: 'EditingName'
                });
                price = _react2.default.createElement(_riek.RIENumber, {
                    value: item.price,
                    propName: 'price',
                    change: this.handlePriceChange,
                    className: 'InLineEdit',
                    classEditing: 'EditingPrice'
                });
                description = _react2.default.createElement(_riek.RIEInput, {
                    value: item.description,
                    propName: 'description',
                    change: this.handleDescriptionChange,
                    className: 'InLineEdit',
                    classEditing: 'EditingDescription'
                });
            } else {
                name = item.name;
                price = item.price;
                description = item.description;
            }
            return _react2.default.createElement(
                'div',
                { className: 'menuItem', key: item.id },
                _react2.default.createElement(
                    'table',
                    null,
                    _react2.default.createElement(
                        'tbody',
                        null,
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'td',
                                { className: 'name left' },
                                name
                            ),
                            _react2.default.createElement(
                                'td',
                                { className: 'price right' },
                                '$',
                                price
                            )
                        ),
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'td',
                                { className: 'left description' },
                                description
                            ),
                            _react2.default.createElement('td', { className: 'right' })
                        ),
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'td',
                                { className: 'left' },
                                _react2.default.createElement(
                                    'button',
                                    { className: 'editItemButton',
                                        onClick: this.editMenuItem,
                                        'data-key': this.props.item.id,
                                        'data-index': this.props.index },
                                    this.state.editButtonState
                                )
                            ),
                            _react2.default.createElement(
                                'td',
                                { className: 'right' },
                                _react2.default.createElement(
                                    'button',
                                    { className: 'deleteItemButton',
                                        onClick: this.deleteMenuItem },
                                    'delete'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return MenuItem;
}(_Component3.default);

exports.default = MenuItem;