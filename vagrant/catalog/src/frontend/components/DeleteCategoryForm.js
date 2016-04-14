import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
var bleach = require('bleach');

/**
 * Wrapper around Semantic-ui's "ui form". May be I should just call it Form.
 * @class EditCategoryForm
 * */
export default class DeleteCategoryForm extends Component {

    constructor(props) {
        super(props);
    }


    /**
     * Clicking Submit button saves the data if it is validated.
     * */
    deleteCategory(){
        //Then we ship it to the right function.
        this.props.deleteCategory(this.props.category.id);
        //We also need to close the modal, since we're done here.
        this.props.switchModalVisibility();
    }


    switchModalVisibility(){
        this.props.switchModalVisibility();
    }

    render() {
        var formClasses;
        var buttons;
        formClasses = 'ui small form error';
        buttons = <div className="ui buttons">
            <div className="ui basic blue button"
                 onClick={this.deleteCategory}>
                Yes
            </div>
            <div className="ui basic red button"
                 onClick={this.switchModalVisibility}>
                No
            </div>
        </div>;

        return (
            <div className="ui item">
                <i className="right floated big remove circle icon" onClick={this.switchModalVisibility}></i>
                <div className="header">
                    Confirmation
                </div>
                <div className="image content">
                </div>
                <div className="content">
                    <div className={formClasses}>
                        <div className="one field">
                            <div className="container "></div>
                            <div className="ui error message">
                                <p>Are you sure you want to delete {this.props.category.name}?</p>
                            </div>
                        </div>
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
}