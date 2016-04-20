import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
var bleach = require('bleach');

/**
 * Form allows edition of items.
 * @class EditItemForm
 * */
export default class EditItemForm extends Component {

    /**
     * @constructs EditItemForm
     * @param {Object} props - Object passed down to us from our parent..
     * @param {Object} props.category - See {@link Category#constructor}
     * @param {Object} props.editCategory - See {@link CatalogApp#editCategory}
     * @param {Object} props.switchModalVisibility - See {@link Item#switchEditModalVisibility}
     * */
    constructor(props) {
        super(props);
        /**
         * @member {Object} A state object composed of the state variables.
         * @property {boolean} state.isNameValid
         * @property {boolean} state.isPriceValid
         * @property {boolean} state.isDescriptionValid
         * @property {boolean} state.newPictureMounted
         * @property {number} state.id - The item's id.
         * @property {string} state.picture - The path to the item's picture
         * @property {string} state.name - The item's name.
         * @property {string} state.price - The item's price.
         * @property {string} state.description - The item's description.
         * @property {number} state.stage - The stage of the form(0 or 1).
         * @property {Object} state.file - A File object
         * @property {boolean} state.validated - If true, the form's fields are all valid.
         * */
        this.state = {
                categoryId: this.props.categoryId,
                isNameValid: true,
                isPriceValid:true,
                isDescriptionValid: true,
                newPictureMounted:false,
                id: this.props.item.id,
                picture: this.props.item.picture,
                name: this.props.item.name,
                price: this.props.item.price,
                description: this.props.item.description,
                stage: 0,
                file: null,
                validated: true,
                isInputEnabled: true
            }
    }

    advanceStage(){
        /**
         * Moves form from editing(0) stage to confirmation(1) stage.
         * Input is disabled at the same time.
         * */
        this.setState({
            ...this.state,
            stage: this.state.stage+1,
            isInputEnabled: false
        });
    }

    goBack(){
        /**
         * Moves form from confirmation(1) stage to editing(0) stage.
         * Input is (re)enabled
         * */
        this.setState({
            ...this.state,
            stage: this.state.stage-1,
            isInputEnabled: true
        });
    }

    isValidated(){
        /**
         * Returns true if all fields have content in them.
         * This should be much more intricate in a production environment.
         * */
        return this.state.isNameValid &&
                this.state.isPriceValid &&
                this.state.isDescriptionValid
    }

    hasChanged(){
        /**
         * Returns true if at least one field has changed
         * or a new picture has been dropped.
         * */
        return  this.props.item.price !== this.state.price ||
                this.props.item.name !== this.state.name ||
                this.props.item.description !== this.state.description ||
                this.props.item.picture !== this.state.picture;
    }

    updateName(e){
        /**
         * Callback for onChange event in the "Name" field.
         * */
        //First we sanitize the input.
        let newName = bleach.sanitize(this.inputName.value);
        //Then we update the state.
        this.setState({
            ...this.state,
            //Update the value of the field.
            name: newName,
            //The field is valid, if it is not empty.
            isNameValid: newName!=="",
            // The form is valid if this and all the other fields are valid.
            validated:  newName!=="" &&
                        this.state.isDescriptionValid &&
                        this.state.isPriceValid
        });
    }

    updatePrice(e){
        /**
         * Callback for onChange event in the "Price" field.
         * See updateName.
         * */
        let newPrice = bleach.sanitize(this.inputPrice.value);
        this.setState({
            ...this.state,
            price: newPrice,
            isPriceValid: newPrice!=="",
            validated:  this.state.isNameValid &&
                        this.state.isDescriptionValid &&
                        newPrice!==""
        });
    }

    updateDescription(e){
        /**
         * Callback for onChange event in the "Description" field.
         * See updateName for more details.
         * */
        let newDescription = bleach.sanitize(this.inputDescription.value);
        this.setState({
            ...this.state,
            description: newDescription,
            isDescriptionValid: newDescription!=="",
            validated:  newDescription!=="" &&
                        this.state.isNameValid &&
                        this.state.isPriceValid
        });
    }

    editItem(){
        /**
         * Ships item for editing.
         * */
        if(this.isValidated()){
            //If item is valid.
            var item = {
                categoryId: this.state.categoryId,
                id:this.state.id,
                picture: this.state.newPictureMounted? "/static/images/"+this.state.file.name : this.state.picture,
                name: this.state.name,
                price: this.state.price,
                description: this.state.description,
                file: this.state.file,
                newPicture: this.state.newPictureMounted
            };
            if(this.hasChanged()){
                //And something changed.
                //Then ship to the function that will ship it down the wire.
                this.props.editItem(item);
            }
            /**
             * Now we start the process of
             * hiding this menu and its modal.
             * */
            this.switchModalVisibility();
        }
    }

    switchModalVisibility(){
        /**
         * Effectively hiding the modal without
         * successfully saving its contents.
         * Form goes back to stage 0 before hiding.
         * */
        this.setState({
            stage: 0,
            isInputEnabled: true
        });
        //Somewhere up the chain, someone is in charged of closing it. The form doesn't know the details of that.
        this.props.switchModalVisibility();
    }

    /**
     * Prevents default behavior and prevents
     * event e from propagating up the node tree.
     * I am using it because "Drop's" default behavior is to navigate to a
     * page displaying only the image the user just dropped. We don't want accidental drops
     * to trigger that behavior, so we need to prevent it.
     * */
    stopEvent(e){
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Triggered when the user drops a file in the image box.
     * */
    handleDrop(e){
        //
        e.preventDefault();
        e.stopPropagation();
        const droppedFiles = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        var file = droppedFiles[0];
        file.preview = window.URL.createObjectURL(file);
        if (file.name.match(/\.(jpg|jpeg|png|gif)$/)){
            //File uploaded is an image
            this.setState({
                picture: file.preview,
                file: file,
                newPictureMounted: true
            });
        }
    }

    render() {

        var formClasses;
        var buttons;

        if(this.state.stage===0 && this.state.validated){
            /**
             * If we're editing and the content in all input fields is valid
             * we want a regular form.
             * */
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
            //We want to ask the user to confirm via a "success" message.
            buttons = <div className="ui buttons">
                <div className="ui basic blue button"
                     onClick={this.goBack}>
                    <i className="chevron circle left icon"></i>Back
                </div>
                <div className="ui basic green button"
                     onClick={this.editItem}>
                    Send<i className="chevron circle right icon"></i>
                </div>
            </div>;
        }

        return (
            <div className="ui grid container">
                <div className="ui container segment">
                    <a className="ui inverted red ribbon label">Drag and drop <i className="photo icon"></i></a>
                    <div className="item">
                        <i className="right floated big remove circle icon" onClick={this.switchModalVisibility}></i>
                        <div className="image padded content"
                             onDragOver={this.stopEvent}
                             onDrop={this.handleDrop}>
                            <img className="ui small image"
                                 src={this.state.picture}></img>
                        </div>
                        <div className="content">
                            <div className={formClasses}>
                                <div className="required field"
                                     ref={(ref) => this.FormContainer=ref}>
                                    <label>Name</label>
                                    <input type="text"
                                           ref={(ref) => this.inputName=ref}
                                           disabled={!this.state.isInputEnabled}
                                           value={this.state.name}
                                           onChange={this.updateName}/>
                                </div>
                                <div className="required field">
                                    <label>Price</label>
                                    <input type="text"
                                           ref={(ref) => this.inputPrice=ref}
                                           disabled={!this.state.isInputEnabled}
                                           value={this.state.price}
                                           onChange={this.updatePrice}/>
                                </div>
                                <div className="required field">
                                    <label>Description</label>
                                    <textarea type="text"
                                           ref={(ref) => this.inputDescription=ref}
                                           disabled={!this.state.isInputEnabled}
                                           value={this.state.description}
                                           onChange={this.updateDescription}/>
                                </div>
                                <div className="ui error message">
                                    <div className="header"></div>
                                    <p>Please fill out all fields. Don't forget the photo!</p>
                                </div>
                                <div className="ui success message">
                                    <div className="header">
                                        <p>Please confirm the change.</p>
                                    </div>
                                </div>
                                {buttons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}