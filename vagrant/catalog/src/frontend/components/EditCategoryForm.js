import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
var bleach = require('bleach');

export default class EditCategoryForm extends Component {

    constructor(props) {
        super(props);
        this.state = {category: this.props.category,
                        validated: true}
    }

    //This makes sure the name is up-to-date
    //at all times.
    updateName(e){
        var category = this.state.category;
        category.name = bleach.sanitize(this.textInput.value);
        this.setState({...this.state,
            category: category,
            validated: !(category.name==="")});
    }

    //Pressing enter finalizes the edit.
    handleKey(e){
        if(e.key==='Enter'){
            console.log("Enter pressed.");
            this.editCategory();
        }
    }

    //Called then edit is finalized.
    editCategory(){
        this.props.editCategory(this.state.category);
    }

    componentDidMount() {
        this.setState({category: this.props.category});
    }

    render() {
        //formClasses determines if an error message is displayed or not.
        var formClasses = (this.state.validated) ? 'ui small form': 'ui small form error';
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
                <div className="ui submit button" onClick={this.editCategory}>
                    Submit
                </div>
            </div>
        );
    }
}