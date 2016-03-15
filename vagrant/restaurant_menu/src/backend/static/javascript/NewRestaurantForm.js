'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Component2 = require('./Component');

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewRestaurantForm = function (_Component) {
    _inherits(NewRestaurantForm, _Component);

    function NewRestaurantForm(props) {
        _classCallCheck(this, NewRestaurantForm);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NewRestaurantForm).call(this, props));

        _this.state = { name: '' };
        return _this;
    }

    _createClass(NewRestaurantForm, [{
        key: 'handleNameChange',
        value: function handleNameChange(e) {
            this.setState({ name: e.target.value });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            e.preventDefault();
            this.props.onNewRestaurantSubmit({ name: this.state.name.trim() });
            this.state.name = '';
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'form',
                { className: 'newRestaurantForm', onSubmit: this.handleSubmit },
                _react2.default.createElement('input', {
                    type: 'text',
                    placeholder: 'Name',
                    value: this.state.name,
                    onChange: this.handleNameChange
                }),
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                    'button',
                    { className: 'redButton', type: 'submit' },
                    _react2.default.createElement('i', { className: 'fa fa-paper-plane' })
                )
            );
        }
    }]);

    return NewRestaurantForm;
}(_Component3.default);

exports.default = NewRestaurantForm;