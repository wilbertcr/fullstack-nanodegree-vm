'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Component = function (_React$Component) {
    _inherits(Component, _React$Component);

    function Component(props) {
        var shouldAutoBind = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        _classCallCheck(this, Component);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this, props));

        if (shouldAutoBind) {
            _this.autoBind();
        }
        return _this;
    }

    _createClass(Component, [{
        key: 'bindMethods',
        value: function bindMethods(methods) {
            var _this2 = this;

            methods.forEach(function (method) {
                _this2[method] = _this2[method].bind(_this2);
            });
        }
    }, {
        key: 'autoBind',
        value: function autoBind() {
            var _this3 = this;

            this.bindMethods(Object.getOwnPropertyNames(this.constructor.prototype).filter(function (prop) {
                return typeof _this3[prop] === 'function' && !Component.ignoreAutoBindFunctions.includes(prop);
            }));
        }
    }]);

    return Component;
}(_react2.default.Component);

exports.default = Component;

Component.ignoreAutoBindFunctions = ['constructor', 'render', 'componentWillMount', 'componentDidMount', 'componentWillUpdate', 'componentDidUpdate', 'componentWillUnmount'];