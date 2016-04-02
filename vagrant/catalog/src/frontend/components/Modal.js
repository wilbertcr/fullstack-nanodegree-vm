import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import EditCategoryForm from './EditCategoryForm';

/**
 * Represents the modal itself.
 * @class Modal
 * */
export default class Modal extends Component {
    /**
     * @constructs Modal
     * @param {Object} props - Object passed down to us from our parent.
     * */
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    /**
     * Click handler. We don't want clicks propagating up, as they would hide the entire modal.
     * So here we stop propagation of clicks.
     * @param e - The click event.
     * */
    handleClick(e){
        e.stopPropagation();
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
                <div className="image content">
                </div>
                <div className="content">
                    <EditCategoryForm category={this.props.category}
                                      editCategory={this.props.editCategory}/>
                </div>
            </div>
        );
    }
}