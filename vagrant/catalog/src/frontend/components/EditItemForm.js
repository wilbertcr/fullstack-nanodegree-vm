import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

/**
 * Form allows edition of items.
 * There are two stages. It begins with the form
 * containing the current values of the item.
 * Pr
 * @class EditItemForm
 * */
export default class EditItemForm extends Component {
    constructor(props) {
        super(props);

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
                validated: true
            }
    }

    /**
     * Moves form from editing(0) to confirmation(1) stage.
     * */
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

    isValidated(){
        return this.state.isNameValid &&
                this.state.isPriceValid &&
                this.state.isDescriptionValid
    }

    hasChanged(){
        return  this.props.item.price !== this.state.price ||
                this.props.item.name !== this.state.name ||
                this.props.item.description !== this.state.description ||
                this.props.item.picture !== this.state.picture;
    }

    updateName(e){
        let newName = this.inputName.value;
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
        let newPrice = this.inputPrice.value;
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
        let newDescription = this.inputDescription.value;
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
     * Effectively hiding the modal without
     * successfully saving its contents.
     * */
    switchModalVisibility(){
        /**
         * Reset form's stage back to initial one.
         * */
        this.setState({stage: 0});
        this.props.switchModalVisibility();
    }

    /**
     * Ships item for editing in both, front end and back end.
     * */
    editItem(){
        /**
         * Item must be "valid"
         * */
        if(this.isValidated()){
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
            /**
             * We only want to talk to the backend
             * if there's something to change
             * */
            if(this.hasChanged()){
                this.props.editItem(item);
            } else {
                console.log("It thinks nothing changed");
            }
            /**
             * Now we start the process of
             * hiding this menu and its modal.
             * */
            this.switchModalVisibility();
        }
    }

    /**
     * Prevents default behavior and prevents
     * event e from propagaing up the node tree.
     * */
    stopEvent(e){
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e){
        e.preventDefault();
        e.stopPropagation();
        console.log('test');
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
        console.log(droppedFiles);
    }

    componentDidMount(){
        console.log()
    }

    render() {
        var formClasses;
        var buttons;
        var steps;
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
                     onClick={this.editItem}>
                    Send<i className="chevron circle right icon"></i>
                </div>
                <div className="ui basic blue button"
                     onClick={this.switchModalVisibility}>
                    <i className="remove circle icon"></i>Cancel
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
                                           value={this.state.name}
                                           onChange={this.updateName}/>
                                </div>
                                <div className="required field">
                                    <label>Price</label>
                                    <input type="text"
                                           ref={(ref) => this.inputPrice=ref}
                                           value={this.state.price}
                                           onChange={this.updatePrice}/>
                                </div>
                                <div className="required field">
                                    <label>Description</label>
                                    <textarea type="text"
                                           ref={(ref) => this.inputDescription=ref}
                                           value={this.state.description}
                                           onChange={this.updateDescription}/>
                                </div>
                                <div className="ui error message">
                                    <div className="header">Empty name</div>
                                    <p>Something is missing...</p>
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