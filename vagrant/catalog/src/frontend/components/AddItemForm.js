import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

export default class AddItemForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
                validated: true,
                id: 0,
                name: "",
                picture: "",
                stage: 0
            }
    }

    updateName(name){
        this.setState({...this.state,name: this.inputName.value});
    }

    updatePicture(event){
        var pictureFile = event.target.files[0];
        this.state.picture = pictureFile;
        if(!pictureFile){
            //File uploaded is empty
            return;
        }
        if (!pictureFile.name.match(/\.(jpg|jpeg|png|gif)$/)){
            //File uploaded isn't an imag
        }

        var reader = new FileReader();
        reader.onload = function(e) {
            var rawData = reader.result;
        };
        reader.readAsBinaryString(pictureFile);
        console.log(pictureFile);
    }

    advanceStage(){
        this.setState({...this.state,stage: this.state.stage+1});
    }

    addCategory(){
        if(this.state.validated){
            var category = {
                id: this.state.id,
                name: this.state.name,
                picture: this.state.picture
            };
            this.props.addCategory(category);
            this.props.switchModalVisibility();
            this.resetFields();
        } else {
            console.error("AddCategoryForm.js - Line 44: This shouldn't be called when data is invalid.");
        }
    }

    resetFields(){
        this.setState({
            ...this.state,
            id: 0,
            name: "",
            picture:"",
            validated: true,
            state: 0
        });
    }

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
            formClasses = 'ui small form';
            //And a submit button.
            buttons = <div className="ui one button">
                <div className="ui submit button"
                     onClick={this.advanceStage}>
                    Submit

                </div>
            </div>;        }
        if(this.state.stage===0 && !this.state.validated){
            //If we're editing and content is not validated.
            //We want to show an error in the form and to disable the button.
            formClasses = 'ui small form error';
            buttons = <div className="ui one button">
                <div className="ui disabled submit button">
                    Submit
                </div>
            </div>;
        }
        if(this.state.stage===1 && this.state.validated){
            formClasses = 'ui small form success';
            //If we are done editing.
            //We want to ask the user to confirm via a "success" message.
            buttons = <div className="ui two buttons">
                <div className="ui submit button"
                     onClick={this.addCategory}>
                    Ok
                </div>
                <div className="ui submit button"
                     onClick={this.switchModalVisibility}>
                    Cancel
                </div>
            </div>;
        }

        return (

            <div className="ui item">
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
                                       ref={(ref) => this.inputName=ref}
                                       value={this.state.name}
                                       onChange={this.updateName}/>
                            </div>
                            <div className="ui field">
                                <label>Picture</label>
                                <input type="file"
                                       name="Picture"
                                       ref={(ref) => this.inputPicture=ref}
                                       onChange={this.updatePicture}/>
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