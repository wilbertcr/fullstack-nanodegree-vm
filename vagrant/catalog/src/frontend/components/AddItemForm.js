import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
var bleach = require('bleach');

/**
 *
 * @class AddItemForm
 * */
export default class AddItemForm extends Component {
    /**
     * @constructs EditItemForm
     * @param {Object} props - Object passed down to us from our parent..
     * @param {Object} props.addItem - See {@link CatalogApp#addItem}
     * @param {number} props.categoryId - See {@link CatalogApp#state}
     * @param {Object} props.switchModalVisibility - See {@link ItemsContainer#switchModalVisibility}
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
                isNameValid: false,
                isPriceValid: false,
                isDescriptionValid: false,
                newPictureMounted:false,
                id: 0,
                picture: "/static/images/image.png",
                name: "",
                price: "",
                description: "",
                stage: 0,
                file: null,
                validated: true,
                isInputEnabled: true
        }
    }

    /**
     * Moves form from editing(0) to confirmation(1) stage.
     * */
    advanceStage(){
        this.setState({
            ...this.state,
            stage: this.state.stage+1,
            isInputEnabled: false
        });
    }

    goBack(){
        this.setState({
            ...this.state,
            stage: this.state.stage-1,
            isInputEnabled: true
        });
    }

    isValidated(){
        return "" !== this.state.price &&
            "" !== this.state.name &&
            "" !== this.state.description &&
            "" !== this.state.picture &&
            this.state.newPictureMounted;
    }

    hasChanged(){
        return  "" !== this.state.price ||
            "" !== this.state.name ||
            "" !== this.state.description ||
            "" !== this.state.picture;
    }

    updateName(e){
        let newName = bleach.sanitize(this.inputName.value);
        this.setState({
            ...this.state,
            name: newName,
            isNameValid: newName!=="",
            validated:  newName!=="" &&
            this.state.isDescriptionValid &&
            this.state.isPriceValid
        });
    }

    updatePrice(e){

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
        let newDescription = bleach.sanitize(this.inputDescription.value);
        this.setState({
            ...this.state,
            description: newDescription,
            isDescriptionValid: newDescription!=="",
            validated: newDescription!=="" &&
            this.state.isNameValid &&
            this.state.isPriceValid
        });
    }

    /**
     * Ships item for editing in both, front end and back end.
     * */
    addItem(){
        /**
         * Item must be "valid"
         * */
        if(this.isValidated()){
            var item = {
                categoryId: this.props.categoryId,
                id:this.state.id,
                //this.isValidated==true means a file has been mounted, so it is safe to use its name here.
                picture: "/static/images/"+this.state.file.name,
                name: this.state.name,
                price: this.state.price,
                description: this.state.description,
                file: this.state.file,
                newPicture: this.state.newPictureMounted
            };
            /**
             * We only want to talk to the backend
             * if there's something to change
             * */
            if(this.hasChanged()){
                this.props.addItem(item);
            }

            /**
             * Now we start the process of
             * hiding this menu and its modal.
             * */
            this.switchModalVisibility();
        }
    }

    /**
     * Reset the fields in the form to their original state.
     * */
    resetFields(){
        this.setState({
            isNameValid: false,
            isPriceValid: false,
            isDescriptionValid: false,
            newPictureMounted:false,
            id: 0,
            picture: "/static/images/image.png",
            name: "",
            price: "",
            description: "",
            stage: 0,
            file: null,
            validated: true,
            isInputEnabled: true
        });
    }

    /**
     * Effectively hiding the modal without
     * successfully saving its contents.
     * */
    switchModalVisibility(){
        /**
         * Reset and hide form.
         * */
        this.resetFields();
        this.props.switchModalVisibility();
    }

    /**
     * Prevents default behavior and prevents
     * event e from propagaing up the node tree.
     * */
    stopEvent(e){
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Captures the images dropped by users.
     * */
    handleDrop(e){
        this.stopEvent(e)
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

    componentDidMount(){
        this.setState({
            ...this.state,
            validated: this.isValidated()
        });
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
                     onClick={this.addItem}>
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
                        <div className="ui small image"
                             onDragOver={this.stopEvent}
                             onDrop={this.handleDrop}>
                            <div className="ui container segment">
                                <img src={this.state.picture}></img>
                            </div>
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
                                        <p>Please confirm.</p>
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