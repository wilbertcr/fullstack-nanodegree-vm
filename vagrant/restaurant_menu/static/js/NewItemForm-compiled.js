import React from 'react';

export default class NewItemForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', price: '', course: '', description: '' };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleCourseChange = this.handleCourseChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleNameChange(e) {
        this.setState({ name: e.target.value });
    }
    handleDescriptionChange(e) {
        this.setState({ description: e.target.value });
    }
    handlePriceChange(e) {
        this.setState({ price: e.target.value });
    }
    handleCourseChange(e) {
        this.setState({ course: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var description = this.state.description.trim();
        var price = this.state.price.trim();
        var course = this.state.course.trim();
        this.props.onNewItemSubmit({ name: name, description: description, price: price, course: course });
        this.setState({ name: '', description: '', price: '', course: '' });
    }
    render() {
        return React.createElement(
            'form',
            { className: 'newItemForm', onSubmit: this.handleSubmit },
            React.createElement('input', {
                type: 'text',
                placeholder: 'Name',
                value: this.state.name,
                onChange: this.handleNameChange
            }),
            React.createElement('br', null),
            React.createElement('input', {
                type: 'text',
                placeholder: 'Description',
                value: this.state.description,
                onChange: this.handleDescriptionChange
            }),
            React.createElement('br', null),
            React.createElement('input', {
                type: 'text',
                placeholder: 'Price',
                value: this.state.price,
                onChange: this.handlePriceChange
            }),
            React.createElement('br', null),
            React.createElement('input', {
                type: 'text',
                placeholder: 'Course',
                value: this.state.course,
                onChange: this.handleCourseChange
            }),
            React.createElement('br', null),
            React.createElement('input', { className: 'redButton', type: 'submit', value: 'Submit' })
        );
    }
}

//# sourceMappingURL=NewItemForm-compiled.js.map