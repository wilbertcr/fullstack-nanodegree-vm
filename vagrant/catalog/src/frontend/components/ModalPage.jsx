import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Modal from './Modal';

export default class ModalPage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() {

    }

    editCategory(category){
        this.props.editCategory(category);
    }

    handleClick(e){
        this.props.displayModal();
    }

    render() {
        var modal_classes = (this.props.modal_visible) ? 'ui dimmer modals page transition visible active' : 'ui dimmer modals page transition hidden';
        return (
            <div className={modal_classes} onClick={this.handleClick}>
                <Modal category={this.props.category}
                       modal_visible={this.props.modal_visible}
                        editCategory={this.editCategory}/>
            </div>
        );
    }
}