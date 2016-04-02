import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import EditCategoryForm from './EditCategoryForm';

export default class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    //We don't want a click on the form to
    //hide the modal, so we prevent them from
    //propagating.
    handleClick(e){
        e.stopPropagation();
    }

    //Called then edit is finalized.
    editCategory(category){
        this.props.editCategory(category);
    }

    render() {
        //modalClasses determine if the modal is visible of hidden.
        var modalClasses = (this.props.modal_visible)? 'ui small modal transition visible active': 'ui modal transition hidden';
        return (
            <div className={modalClasses}
                onClick={this.handleClick}>
                <div className="header">
                    Edit Category
                </div>
                <div className="content">
                    <EditCategoryForm category={this.props.category}
                                      editCategory={this.editCategory}/>
                </div>
            </div>
        );
    }
}