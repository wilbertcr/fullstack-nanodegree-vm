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
        this.state = {
            category: this.props.category,
            name: this.props.category.name,
            validated: true,
            stage: 0
        }
    }

    /**
     * Fired by the onChange event in the input field.
     * @param {Object} e - The event's object.
     * */
    updateName(e){
        /**
         * We keep track of the state of validation. We don't want empty names.
         * */
        var name = bleach.sanitize(this.textInput.value);
        this.setState({...this.state,
            name: name,
            validated: !(name==="")
        });
    }

    advanceStage(){
        this.setState({
            ...this.state,
            stage: this.state.stage+1
        });
    }

    goBack(){
        this.setState({
            ...this.state,
            stage: this.state.stage-1
        });
    }

    /**
     * Clicking Submit button saves the data if it is validated.
     * */
    editCategory(){
        if(this.state.validated){
            //We are editing, so we change the name in the category.
            this.state.category.name = this.state.name;
            //Then we ship it to the right function.
            this.props.editCategory(this.state.category);
            //We also need to close the modal, since we're done here.
            this.props.switchModalVisibility();
            //Finally, let's make sure the modal starts where it is supposed to next time
            //it loads.
            this.setState({stage: 0});
        } else {
            console.error("EditCagetoryForm.js - Line 51: This shouldn't be called when data is invalid.");
        }
    }

    /**
     * The category is going to change, so we want to store it in a state
     * variable.
     * */
    componentDidMount() {
        this.setState({category: this.props.category});
    }

    switchModalVisibility(){
        this.setState({
            stage: 0,
            category: this.props.category,
            name: this.props.category.name
        });
        this.props.switchModalVisibility();
    }

    render() {
        var formClasses;
        var buttons;
        if(this.state.stage===0 && this.state.validated){
            /**
             * If we're editing and content is validated
             * */
                //Then we want a regular form.
            formClasses = 'ui form';
            //And functioning buttons
            buttons = <div className="ui buttons">
                <div className="ui basic blue button"
                     onClick={this.switchModalVisibility}>
                    <i className="chevron circle left icon"></i>Back
                </div>
                <div className="ui basic green button"
                     onClick={this.advanceStage}>
                    Submit<i className="chevron circle right icon"></i>
                </div>
            </div>;
        }
        if(this.state.stage===0 && !this.state.validated){
            //If we're editing and content is not validated.
            //We want to show an error in the form and to disable the button.
            formClasses = 'ui small form error';
            //And we want buttons to be disabled.
            buttons = <div className="ui buttons">
                <div className="ui disabled basic blue button"
                     onClick={this.switchModalVisibility}>
                    <i className="chevron circle left icon"></i>Back
                </div>
                <div className="ui disabled basic green button"
                     onClick={this.advanceStage}>
                    Submit<i className="chevron circle right icon"></i>
                </div>
            </div>;
        }
        if(this.state.stage===1 && this.state.validated){
            //If we are done editing.
            //We want to show a success message.
            formClasses = 'ui small form success';
            //We want to ask the user to confirm via a "success" message.
            buttons = <div className="ui buttons">
                <div className="ui basic blue button"
                     onClick={this.goBack}>
                    <i className="chevron circle left icon"></i>Back
                </div>
                <div className="ui basic green button"
                     onClick={this.editCategory}>
                    Send<i className="chevron circle right icon"></i>
                </div>
                <div className="ui basic blue button"
                     onClick={this.switchModalVisibility}>
                    <i className="remove circle icon"></i>Cancel
                </div>
            </div>;
        }

        return (
            <div className="ui item">
                <i className="right floated big remove circle icon" onClick={this.switchModalVisibility}></i>
                <div className="header">
                    Edit Category
                </div>
                <div className="image content">
                </div>
                <div className="content">
                    <div className={formClasses}>
                        <div className="one field">
                            <div className="required field">
                                <label>Category</label>
                                <input type="text"
                                       value={this.state.name}
                                       ref={
                                        (ref) => {
                                            this.textInput=ref;
                                            if(this.textInput!==null){
                                                this.textInput.focus();
                                            }
                                        }
                                       }
                                       onChange={this.updateName}/>
                            </div>
                            <div className="ui error message">
                                <div className="header">Empty name</div>
                                <p>Category must have a nonempty name.</p>
                            </div>
                            <div className="ui success message">
                                <div className="header">
                                    Please confirm the change.
                                </div>
                            </div>
                        </div>
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
}