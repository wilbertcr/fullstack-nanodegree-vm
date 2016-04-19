import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
var bleach = require('bleach');

/**
 *
 * @class AddCategoryForm
 * */
export default class AddCategoryForm extends Component {
    /**
     * @constructs AddCategoryForm
     * @param {Object} props - Object passed down to us from our parent..
     * @param {Object} props.addCategory - See {@link CatalogApp#addCategory}
     * @param {Object} props.switchModalVisibility - See {@link CatalogApp#addCategory}
     * @param {Object} props.switchModalVisibility - See {@link Sidebar@switchModalVisibility}
     *
     * */
    constructor(props) {
        super(props);
        /** @member {Object} A State object composed of the state variables
         * @property {boolean} state.validated - True if the form is validated, false otherwise.
         * @property {string} state.name - The name of the category
         * @property {number} state.stage - 0(Editing) 1(Confirming)
         * @property {boolean} state.isInputEnabled - If true, inputs are enabled. If false, inputs are disabled.
         * */
        this.state = {
                validated: false,
                name: "",
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
     * Callback for onChange event in the "Name" field.
     * */
    updateName(){
        //First we sanitize the input.
        var name = bleach.sanitize(this.textInput.value);
        //Then we update the state.
        this.setState({...this.state,
            name: name,
            validated: !(name==="")
        });
    }

    /**
     * Requests this.props.addCategory to add the new category
     * after making sure the content is validated.
     * It also switches the modal off and resets the fields.
     * */
    addCategory(){
        if(this.state.validated){
            //If the content is valid.
            //Then ship to the function that will ship it down the wire.
            this.props.addCategory(this.state.name);
            this.props.switchModalVisibility();
            this.resetFields();
        } else {
            //This shouldn't happen so we warn the programmer.
            console.error("AddCategoryForm.js - Line 76: This shouldn't be called when data is invalid.");
        }
    }

    /**
     * Reset the fields in the form to their original state.
     * */
    resetFields(){
        this.setState({
            ...this.state,
            name: "",
            validated: true,
            stage: 0,
            isInputEnabled: true
        });
    }

    /**
     * Resets fields and hides modal.
     * */
    switchModalVisibility(){
        this.resetFields();
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
            //If we're editing and content is not validated.
            //We want to show an error in the form
            formClasses = 'ui small form error';
            //And we want buttons to be disabled.
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
            //We want to ask the user to confirm via a "success" message.
            buttons = <div className="ui buttons">
                <div className="ui basic blue button"
                     onClick={this.goBack}>
                    <i className="chevron circle left icon"></i>Back
                </div>
                <div className="ui basic green button"
                     onClick={this.addCategory}>
                    Send<i className="chevron circle right icon"></i>
                </div>
            </div>;
        }

        return (

            <div className="ui item">
                <i className="right floated big remove circle icon" onClick={this.switchModalVisibility}></i>
                <div className="header">
                    Add Category
                </div>
                <div className="image content">

                </div>
                <div className="content">
                    <div className={formClasses}>
                        <div className="ui field">
                            <div className="required field">
                                <label>Name</label>
                                <input type="text"
                                       ref={
                                        (ref) => {
                                            this.textInput=ref;
                                            if(this.textInput!==null){
                                                this.textInput.focus();
                                            }
                                        }
                                       }
                                       disabled={!this.state.isInputEnabled}
                                       value={this.state.name}
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
                    </div>
                    {buttons}
                </div>
            </div>
        );
    }
}