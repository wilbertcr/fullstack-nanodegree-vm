import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
var bleach = require('bleach');

/**
 * Wrapper around Semantic-ui's "ui form". May be I should just call it Form.
 * @class EditCategoryForm
 * */
export default class EditCategoryForm extends Component {

    /**
     * @constructs EditCategoryForm
     * @param {Object} props - Object passed down to us from our parent..
     * @param {Object} props.category - See {@link Category#constructor}
     * @param {Object} props.editCategory - See {@link CatalogApp#editCategory}
     * @param {Object} props.switchModalVisibility - See {@link Category#switchModalVisibility}
     * */
    constructor(props) {
        super(props);
        /** @member {Object} A State object composed of the state variables
         * @property {Object} state.category - The category being edited.
         * @property {string} state.name - The name of the category
         * @property {boolean} state.validated - True if the form is validated, false otherwise.
         * @property {number} state.stage - 0(Editing) 1(Confirming)
         * @property {boolean} state.isInputEnabled - If true, inputs are enabled. If false, inputs are disabled.
         * */
        this.state = {
            category: this.props.category,
            name: this.props.category.name,
            validated: true,
            stage: 0,
            isInputEnabled: true
        }
    }

    /**
     * Moves form from editing(0) stage to confirmation(1) stage.
     * Input is disabled at the same time.
     * */
    advanceStage(){
        this.setState({
            ...this.state,
            stage: this.state.stage+1,
            isInputEnabled: false
        });
    }

    /**
     * Moves form from confirmation(1) stage to editing(0) stage.
     * Input is (re)enabled
     * */
    goBack(){
        this.setState({
            ...this.state,
            stage: this.state.stage-1,
            isInputEnabled: true
        });
    }

    /**
     * Returns true if at least one field has changed
     * or a new picture has been dropped.
     * */
    hasChanged(){
        return  this.props.category.name !== this.state.name;
    }

    /**
     * Fired by the onChange event in the "Name" input field.
     * */
    updateName(){
        //First we sanitize the input.
        var name = bleach.sanitize(this.textInput.value);
        //Then we update the state.
        this.setState({...this.state,
            //Update the value of the field.
            name: name,
            //The form is validated if the name field is not empty.
            validated: !(name==="")
        });
    }

    /**
     * Ships category for editing.
     * */
    editCategory(){
        if(this.state.validated){
            //If the category is validated.
            if(this.hasChanged()){
                //And the content has changed.

                //We change the name
                this.setState({
                    stage: 0,
                    category: {...category,name: this.state.name}
                });
                //Then ship to the function that will ship it down the wire.
                this.props.editCategory(this.state.category);
            }
            //I'll close the modal either way.
            this.props.switchModalVisibility();
        } else {
            console.error("EditCagetoryForm.js - Line 96: This shouldn't be called when data is invalid.");
        }
    }

    /**
     * Reset the fields in the form to their original state.
     * */
    resetFields(){
        this.setState({
            ...this.state,
            stage: 0,
            category: this.props.category,
            name: this.props.category.name,
            isInputEnabled: true
        });
    }

    /**
     * Resets form and calls {@link Category#switchEditModalVisibility}
     * */
    switchModalVisibility(){
        this.resetFields();
        //Somewhere up the chain, someone is in charged of closing it. The form doesn't know the details of that.
        this.props.switchModalVisibility();
    }

    render() {
        var formClasses;
        var buttons;
        if(this.state.stage===0 && this.state.validated){
            /**
             * If we're editing and content is validated
             * Then we want a regular form.
             */
            formClasses = 'ui form';
            //And we display the "Back" and "Next" Buttons.
            buttons = <div className="ui buttons">
                <div className="ui basic blue button"
                     onClick={this.switchModalVisibility}>
                    <i className="chevron circle left icon"></i>Back
                </div>
                <div className="ui basic green button"
                     onClick={this.advanceStage}>
                    Next<i className="chevron circle right icon"></i>
                </div>
            </div>;
        }
        if(this.state.stage===0 && !this.state.validated){
            //If we're editing and some or all of the content isn't valid.
            //then show an error and disable the button.
            formClasses = 'ui small form error';
            //And we disable the buttons, so the user cannot move forward.
            //(user can always close the form or click on the modal to get out of here).
            buttons = <div className="ui buttons">
                <div className="ui disabled basic blue button"
                     onClick={this.switchModalVisibility}>
                    <i className="chevron circle left icon"></i>Back
                </div>
                <div className="ui disabled basic green button"
                     onClick={this.advanceStage}>
                    Next<i className="chevron circle right icon"></i>
                </div>
            </div>;
        }
        if(this.state.stage===1 && this.state.validated){
            //If we are done editing.
            //We want to show a success message.
            formClasses = 'ui small form success';
            //We want to ask the user to confirm via a semantic-ui "success" message.
            buttons = <div className="ui buttons">
                <div className="ui basic blue button"
                     onClick={this.goBack}>
                    <i className="chevron circle left icon"></i>Back
                </div>
                <div className="ui basic green button"
                     onClick={this.editCategory}>
                    Send<i className="chevron circle right icon"></i>
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
                                       disabled={!this.state.isInputEnabled}
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