import React from 'react';
import ReactDOM from 'react-dom';
import InlineEdit from 'react-edit-inline';

export default class InLineEditExample extends React.Component {

    constructor(props) {
        super(props);
        this.dataChanged = this.dataChanged.bind(this);
        this.state = {
            message: 'ReactInline demo'
        };
    }

    dataChanged(data) {
        // data = { description: "New validated text comes here" }
        // Update your model from here
        console.log(data);
    }

    customValidateText(text) {
        return text.length > 0 && text.length < 64;
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h2',
                null,
                this.state.message
            ),
            React.createElement(
                'span',
                null,
                'Edit me: '
            ),
            React.createElement(InlineEdit, {
                validate: this.customValidateText,
                activeClassName: 'editing',
                text: this.state.message,
                paramName: 'message',
                change: this.dataChanged,
                style: {
                    backgroundColor: 'yellow',
                    minWidth: 150,
                    display: 'inline-block',
                    margin: 0,
                    padding: 0,
                    fontSize: 15,
                    outline: 0,
                    border: 0
                }
            })
        );
    }
}

//# sourceMappingURL=inLineEdit-compiled.js.map