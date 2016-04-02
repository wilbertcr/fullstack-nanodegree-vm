import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
var bleach = require('bleach');

/**
 * Wrapper around Semantic-ui's "ui form". May be I should just call it Form.
 * @class EditCategoryForm
 * */
export default class EditCategoryForm extends Component {

    constructor(props) {
        super(props);
        this.state = {category: this.props.category,
                        validated: true}
    }

    /**
     * Fired by the onChange event in the input field.
     * @param {Object} e - The event's object.
     * */
    updateName(e){
        var category = this.state.category;
        /**
         * We don't want any html in that name do we?
         * */
        category.name = bleach.sanitize(this.textInput.value);
        /**
         * We keep track of the state of validation. We don't want empty names.
         * */
        this.setState({...this.state,
            category: category,
            validated: !(category.name==="")});
    }

    /**
     * Attempts to save the data(it won't save if state is "invalidated")
     * */
    handleKey(e){
        if(e.key==='Enter'){
            this.editCategory();
        }
    }

    /**
     * Clicking Submit button saves the data if it is validated.
     * */
    editCategory(){
        if(this.state.validated){
            this.props.editCategory(this.state.category);
        }
    }

    /**
     * The category is going to change, so we want to store it in a state
     * variable.
     * */
    componentDidMount() {
        this.setState({category: this.props.category});
    }

    render() {
        //formClasses An error is displayed if content is invalidated.
        var formClasses = (this.state.validated) ? 'ui small form': 'ui small form error';
        //Button becomes disabled if content is invalidated.
        var submitClasses = (this.state.validated) ? 'ui submit button': 'ui disabled submit button';
        return (
            <div className={formClasses}>
                <div className="one field">
                    <div className="required field">
                        <label>Category</label>
                        <input type="text"
                               ref={(ref) => this.textInput = ref}
                               value={this.state.category.name}
                               onChange={this.updateName}
                               onKeyPress={this.handleKey}/>
                    </div>
                    <div className="ui error message">
                        <div className="header">Empty name</div>
                        <p>Category must have a nonempty name.</p>
                    </div>
                </div>
                <div className={submitClasses} onClick={this.editCategory}>
                    Submit
                </div>
            </div>
        );
    }
}