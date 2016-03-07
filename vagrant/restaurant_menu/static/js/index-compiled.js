import React from 'react';
import ReactDOM from 'react-dom';
import RestaurantList from './RestaurantList';

export default class RestaurantsApp extends React.Component {
    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { id: 'leftcolumn' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(RestaurantList, { url: "/restaurants/JSON" })
                )
            ),
            React.createElement('div', { id: 'centercolumn' }),
            React.createElement('div', { id: 'rightcolumn' }),
            React.createElement(
                'div',
                { id: 'footer' },
                '© Copyright with...'
            )
        );
    }
}

ReactDOM.render(React.createElement(RestaurantsApp, null), document.getElementById("mainbox"));

//# sourceMappingURL=index-compiled.js.map