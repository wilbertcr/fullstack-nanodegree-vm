import React from 'react';

export default class NewRestaurantForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '' };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(e) {
        this.setState({ name: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.onNewRestaurantSubmit({ name: this.state.name.trim() });
        this.state.name = '';
    }

    render() {
        return React.createElement(
            'form',
            { className: 'newRestaurantForm', onSubmit: this.handleSubmit },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Name',
                value: this.state.name,
                onChange: this.handleNameChange
            }),
            React.createElement('br', null),
            React.createElement('input', { className: 'redButton', type: 'submit', value: 'Submit' })
        );
    }
}

//# sourceMappingURL=NewRestaurantForm-compiled.js.map