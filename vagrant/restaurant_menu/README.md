#Restaurants

A one page basic web application displaying a navigation bar representing restaurants and the menu of the currently selected restaurant. 
User can add,edit and delete restaurants and add,edit and delete their respective menu items.


#Installation

First you need to setup the database:

`$ psql`

`$ALTER ROLE vagrant WITH ENCRYPTED PASSWORD 'vagrantvm';`

`$DROP DATABASE IF EXISTS restaurant;`

`$CREATE DATABASE restaurant;`

```
.
├── build.py
├── build.pyc
├── docs
├── index.md
├── __init__.py
├── README.md
├── setup.py
└── src
    ├── backend
    │   ├── __init__.py
    │   ├── __pycache__
    │   ├── python
    │   │   ├── config
    │   │   │   ├── database_setup.py
    │   │   │   ├── database_setup.pyc
    │   │   │   ├── __init__.py
    │   │   │   ├── __init__.pyc
    │   │   │   └── __pycache__
    │   │   ├── __init__.py
    │   │   ├── __init__.pyc
    │   │   ├── server.py
    │   │   ├── server.pyc
    │   │   ├── static
    │   │   │   ├── images
    │   │   │   │   ├── border-bottom.jpg
    │   │   │   │   ├── border-mid.jpg
    │   │   │   │   ├── border-top.jpg
    │   │   │   │   ├── contact-details.jpg
    │   │   │   │   ├── menu.jpg
    │   │   │   │   ├── spinner-rosetta-gray-26x26.gif
    │   │   │   │   ├── sub-contact.jpg
    │   │   │   │   ├── sub-navigation.jpg
    │   │   │   │   ├── thumb-desserts.jpg
    │   │   │   │   ├── thumb-food.jpg
    │   │   │   │   ├── thumb-wine.jpg
    │   │   │   │   └── top-banner.jpg
    │   │   │   ├── javascript
    │   │   │   │   ├── Component.js
    │   │   │   │   ├── index.js
    │   │   │   │   ├── main.js
    │   │   │   │   ├── MenuItem.js
    │   │   │   │   ├── Menu.js
    │   │   │   │   ├── NewItemForm.js
    │   │   │   │   ├── NewRestaurantForm.js
    │   │   │   │   ├── Restaurant.js
    │   │   │   │   └── RestaurantList.js
    │   │   │   └── styles
    │   │   │       ├── main.css
    │   │   │       └── styles.css
    │   │   └── templates
    │   │       └── restaurants.html
    │   └── scripts
    │       └── restaurant_menu_schema.sql
    ├── frontend
    │   ├── components
    │   │   ├── Component.jsx
    │   │   ├── index.jsx
    │   │   ├── MenuItem.jsx
    │   │   ├── Menu.jsx
    │   │   ├── NewItemForm.jsx
    │   │   ├── NewRestaurantForm.jsx
    │   │   ├── Restaurant.jsx
    │   │   └── RestaurantList.jsx
    │   ├── node_modules
    │   │   └── babel-preset-es2015
    │   │       └── node_modules
    │   │           └── babel-plugin-transform-es2015-literals
    │   │               └── node_modules
    │   │                   └── babel-runtime
    │   │                       ├── core-js
    │   │                       │   ├── function
    │   │                       │   │   ├── only.js
    │   │                       │   │   └── part.js
    │   │                       │   ├── number
    │   │                       │   │   ├── is-finite.js
    │   │                       │   │   ├── is-integer.js
    │   │                       │   │   ├── is-safe-integer.js
    │   │                       │   │   ├── max-safe-integer.js
    │   │                       │   │   ├── min-safe-integer.js
    │   │                       │   │   └── random.js
    │   │                       │   ├── object
    │   │                       │   │   ├── assign.js
    │   │                       │   │   ├── classof.js
    │   │                       │   │   ├── create.js
    │   │                       │   │   ├── define.js
    │   │                       │   │   ├── define-properties.js
    │   │                       │   │   ├── define-property.js
    │   │                       │   │   ├── entries.js
    │   │                       │   │   ├── freeze.js
    │   │                       │   │   ├── get-own-property-descriptor.js
    │   │                       │   │   ├── get-own-property-descriptors.js
    │   │                       │   │   ├── get-own-property-names.js
    │   │                       │   │   ├── get-own-property-symbols.js
    │   │                       │   │   ├── get-prototype-of.js
    │   │                       │   │   ├── index.js
    │   │                       │   │   ├── is-extensible.js
    │   │                       │   │   ├── is-frozen.js
    │   │                       │   │   ├── is.js
    │   │                       │   │   ├── is-object.js
    │   │                       │   │   ├── is-sealed.js
    │   │                       │   │   ├── keys.js
    │   │                       │   │   ├── make.js
    │   │                       │   │   ├── prevent-extensions.js
    │   │                       │   │   ├── seal.js
    │   │                       │   │   ├── set-prototype-of.js
    │   │                       │   │   └── values.js
    │   │                       │   ├── reflect
    │   │                       │   │   ├── apply.js
    │   │                       │   │   ├── construct.js
    │   │                       │   │   ├── define-property.js
    │   │                       │   │   ├── delete-property.js
    │   │                       │   │   ├── enumerate.js
    │   │                       │   │   ├── get.js
    │   │                       │   │   ├── get-own-property-descriptor.js
    │   │                       │   │   ├── get-prototype-of.js
    │   │                       │   │   ├── has.js
    │   │                       │   │   ├── is-extensible.js
    │   │                       │   │   ├── own-keys.js
    │   │                       │   │   ├── prevent-extensions.js
    │   │                       │   │   ├── set.js
    │   │                       │   │   └── set-prototype-of.js
    │   │                       │   ├── regexp
    │   │                       │   │   └── escape.js
    │   │                       │   ├── string
    │   │                       │   │   ├── at.js
    │   │                       │   │   ├── code-point-at.js
    │   │                       │   │   ├── ends-with.js
    │   │                       │   │   ├── escape-html.js
    │   │                       │   │   ├── from-code-point.js
    │   │                       │   │   ├── includes.js
    │   │                       │   │   ├── pad-left.js
    │   │                       │   │   ├── pad-right.js
    │   │                       │   │   ├── raw.js
    │   │                       │   │   ├── repeat.js
    │   │                       │   │   ├── starts-with.js
    │   │                       │   │   ├── trim.js
    │   │                       │   │   ├── trim-left.js
    │   │                       │   │   ├── trim-right.js
    │   │                       │   │   └── unescape-html.js
    │   │                       │   └── symbol
    │   │                       │       ├── for.js
    │   │                       │       ├── has-instance.js
    │   │                       │       ├── is-concat-spreadable.js
    │   │                       │       ├── iterator.js
    │   │                       │       ├── key-for.js
    │   │                       │       ├── match.js
    │   │                       │       ├── replace.js
    │   │                       │       ├── search.js
    │   │                       │       ├── species.js
    │   │                       │       ├── split.js
    │   │                       │       ├── to-primitive.js
    │   │                       │       ├── to-string-tag.js
    │   │                       │       └── unscopables.js
    │   │                       ├── helpers
    │   │                       │   ├── _async-to-generator.js
    │   │                       │   ├── async-to-generator.js
    │   │                       │   ├── asyncToGenerator.js
    │   │                       │   ├── bind.js
    │   │                       │   ├── _class-call-check.js
    │   │                       │   ├── class-call-check.js
    │   │                       │   ├── classCallCheck.js
    │   │                       │   ├── _create-class.js
    │   │                       │   ├── create-class.js
    │   │                       │   ├── createClass.js
    │   │                       │   ├── create-decorated-class.js
    │   │                       │   ├── create-decorated-object.js
    │   │                       │   ├── default-props.js
    │   │                       │   ├── _defaults.js
    │   │                       │   ├── defaults.js
    │   │                       │   ├── define-decorated-property-descriptor.js
    │   │                       │   ├── _define-enumerable-properties.js
    │   │                       │   ├── define-enumerable-properties.js
    │   │                       │   ├── defineEnumerableProperties.js
    │   │                       │   ├── _define-property.js
    │   │                       │   ├── define-property.js
    │   │                       │   ├── defineProperty.js
    │   │                       │   ├── _extends.js
    │   │                       │   ├── extends.js
    │   │                       │   ├── _get.js
    │   │                       │   ├── get.js
    │   │                       │   ├── has-own.js
    │   │                       │   ├── _inherits.js
    │   │                       │   ├── inherits.js
    │   │                       │   ├── _instanceof.js
    │   │                       │   ├── instanceof.js
    │   │                       │   ├── interop-export-wildcard.js
    │   │                       │   ├── _interop-require-default.js
    │   │                       │   ├── interop-require-default.js
    │   │                       │   ├── interopRequireDefault.js
    │   │                       │   ├── interop-require.js
    │   │                       │   ├── _interop-require-wildcard.js
    │   │                       │   ├── interop-require-wildcard.js
    │   │                       │   ├── interopRequireWildcard.js
    │   │                       │   ├── _jsx.js
    │   │                       │   ├── jsx.js
    │   │                       │   ├── _new-arrow-check.js
    │   │                       │   ├── new-arrow-check.js
    │   │                       │   ├── newArrowCheck.js
    │   │                       │   ├── _object-destructuring-empty.js
    │   │                       │   ├── object-destructuring-empty.js
    │   │                       │   ├── objectDestructuringEmpty.js
    │   │                       │   ├── _object-without-properties.js
    │   │                       │   ├── object-without-properties.js
    │   │                       │   ├── objectWithoutProperties.js
    │   │                       │   ├── _possible-constructor-return.js
    │   │                       │   ├── possible-constructor-return.js
    │   │                       │   ├── possibleConstructorReturn.js
    │   │                       │   ├── _self-global.js
    │   │                       │   ├── self-global.js
    │   │                       │   ├── selfGlobal.js
    │   │                       │   ├── _set.js
    │   │                       │   ├── set.js
    │   │                       │   ├── _sliced-to-array.js
    │   │                       │   ├── sliced-to-array.js
    │   │                       │   ├── slicedToArray.js
    │   │                       │   ├── _sliced-to-array-loose.js
    │   │                       │   ├── sliced-to-array-loose.js
    │   │                       │   ├── slicedToArrayLoose.js
    │   │                       │   ├── slice.js
    │   │                       │   ├── _tagged-template-literal.js
    │   │                       │   ├── tagged-template-literal.js
    │   │                       │   ├── taggedTemplateLiteral.js
    │   │                       │   ├── _tagged-template-literal-loose.js
    │   │                       │   ├── tagged-template-literal-loose.js
    │   │                       │   ├── taggedTemplateLiteralLoose.js
    │   │                       │   ├── temporal-assert-defined.js
    │   │                       │   ├── _temporal-ref.js
    │   │                       │   ├── temporal-ref.js
    │   │                       │   ├── temporalRef.js
    │   │                       │   ├── _temporal-undefined.js
    │   │                       │   ├── temporal-undefined.js
    │   │                       │   ├── temporalUndefined.js
    │   │                       │   ├── _to-array.js
    │   │                       │   ├── to-array.js
    │   │                       │   ├── toArray.js
    │   │                       │   ├── _to-consumable-array.js
    │   │                       │   ├── to-consumable-array.js
    │   │                       │   ├── toConsumableArray.js
    │   │                       │   ├── _typeof.js
    │   │                       │   ├── typeof.js
    │   │                       │   └── typeof-react-element.js
    │   │                       ├── node_modules
    │   │                       │   └── core-js
    │   │                       │       ├── bower.json
    │   │                       │       ├── CHANGELOG.md
    │   │                       │       ├── fn
    │   │                       │       │   ├── array
    │   │                       │       │   │   ├── entries.js
    │   │                       │       │   │   ├── filter.js
    │   │                       │       │   │   ├── of.js
    │   │                       │       │   │   ├── reverse.js
    │   │                       │       │   │   └── some.js
    │   │                       │       │   ├── clear-immediate.js
    │   │                       │       │   ├── delay.js
    │   │                       │       │   ├── dict.js
    │   │                       │       │   ├── get-iterator.js
    │   │                       │       │   ├── get-iterator-method.js
    │   │                       │       │   ├── is-iterable.js
    │   │                       │       │   ├── _.js
    │   │                       │       │   ├── json
    │   │                       │       │   │   └── stringify.js
    │   │                       │       │   ├── log.js
    │   │                       │       │   ├── map.js
    │   │                       │       │   ├── math
    │   │                       │       │   │   ├── acosh.js
    │   │                       │       │   │   ├── asinh.js
    │   │                       │       │   │   ├── atanh.js
    │   │                       │       │   │   ├── cbrt.js
    │   │                       │       │   │   ├── clz32.js
    │   │                       │       │   │   ├── cosh.js
    │   │                       │       │   │   ├── expm1.js
    │   │                       │       │   │   ├── fround.js
    │   │                       │       │   │   ├── hypot.js
    │   │                       │       │   │   ├── imul.js
    │   │                       │       │   │   ├── index.js
    │   │                       │       │   │   ├── log10.js
    │   │                       │       │   │   ├── log1p.js
    │   │                       │       │   │   ├── log2.js
    │   │                       │       │   │   ├── sign.js
    │   │                       │       │   │   ├── sinh.js
    │   │                       │       │   │   ├── tanh.js
    │   │                       │       │   │   └── trunc.js
    │   │                       │       │   ├── promise.js
    │   │                       │       │   ├── set-immediate.js
    │   │                       │       │   ├── set-interval.js
    │   │                       │       │   ├── set.js
    │   │                       │       │   ├── set-timeout.js
    │   │                       │       │   ├── weak-map.js
    │   │                       │       │   └── weak-set.js
    │   │                       │       ├── Gruntfile.js
    │   │                       │       ├── index.js
    │   │                       │       ├── LICENSE
    │   │                       │       ├── package.json
    │   │                       │       ├── README.md
    │   │                       │       └── shim.js
    │   │                       └── regenerator
    │   │                           ├── index.js
    │   │                           └── runtime.js
    │   ├── package.json
    │   └── tools
    │       ├── gulpfile.js
    │       └── webpack.config.js
    └── unittest
        └── python
            └── __init__.py

40 directories, 265 files```


Now you need to build the project. Go to the root of the restaurant_menu project. 

