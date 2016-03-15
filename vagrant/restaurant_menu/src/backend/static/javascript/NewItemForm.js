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

var NewItemForm = function (_Component) {
    _inherits(NewItemForm, _Component);

    function NewItemForm(props) {
        _classCallCheck(this, NewItemForm);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NewItemForm).call(this, props));

        _this.state = { name: '', price: '', course: '', description: '' };
        return _this;
    }

    _createClass(NewItemForm, [{
        key: 'handleNameChange',
        value: function handleNameChange(e) {
            e.preventDefault();
            this.setState({ name: e.target.value });
        }
    }, {
        key: 'handleDescriptionChange',
        value: function handleDescriptionChange(e) {
            e.preventDefault();
            this.setState({ description: e.target.value });
        }
    }, {
        key: 'handlePriceChange',
        value: function handlePriceChange(e) {
            e.preventDefault();
            this.setState({ price: e.target.value });
        }
    }, {
        key: 'handleCourseChange',
        value: function handleCourseChange(e) {
            e.preventDefault();
            this.setState({ course: e.target.value });
        }
    }, {
        key: 'handleSubmit',
        value: function handleSubmit(e) {
            e.preventDefault();
            var name = this.state.name.trim();
            var description = this.state.description.trim();
            var price = this.state.price.trim();
            var course = this.state.course.trim();
            this.props.onNewItemSubmit({ name: name, description: description, price: price, course: course });
            this.setState({ name: '', description: '', price: '', course: '' });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'form',
                { className: 'newItemForm', onSubmit: this.handleSubmit },
                _react2.default.createElement('input', {
                    type: 'text',
                    placeholder: 'Name',
                    value: this.state.name,
                    onChange: this.handleNameChange
                }),
                _react2.default.createElement('br', null),
                _react2.default.createElement('input', {
                    type: 'text',
                    placeholder: 'Description',
                    value: this.state.description,
                    onChange: this.handleDescriptionChange
                }),
                _react2.default.createElement('br', null),
                _react2.default.createElement('input', {
                    type: 'text',
                    placeholder: 'Price',
                    value: this.state.price,
                    onChange: this.handlePriceChange
                }),
                _react2.default.createElement('br', null),
                _react2.default.createElement('input', {
                    type: 'text',
                    placeholder: 'Course',
                    value: this.state.course,
                    onChange: this.handleCourseChange
                }),
                _react2.default.createElement('br', null),
                _react2.default.createElement('input', { className: 'redButton', type: 'submit', value: 'Submit' })
            );
        }
    }]);

    return NewItemForm;
}(_Component3.default);

exports.default = NewItemForm;