import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
var bleach = require('bleach');

/**
 * Wrapper around Semantic-ui's "ui form". May be I should just call it Form.
 * @class DeleteCategoryForm
 * */
export default class DeleteCategoryForm extends Component {

    /**
     * @constructs DeleteCategoryForm
     * @param {Object} props - Object passed down to us from our parent..
     * @param {Object} props.category - See {@link Category#constructor}
     * @param {Object} props.deleteCategory - See {@link CatalogApp#deleteCategory}
     * @param {Object} props.switchModalVisibility - See {@link Category#switchDeleteModalVisibility}
     * */
    constructor(props) {
        super(props);
    }

    deleteCategory(){
        /**
         * Triggered by "Yes" Button.
         * */
        //We ship to the function that will ship it down the wire.
        this.props.deleteCategory(this.props.category.id);
        //We also need to close the modal, since we're done here.
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
                 onClick={this.props.switchModalVisibility}>
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