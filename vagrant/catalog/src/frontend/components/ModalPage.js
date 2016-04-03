import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Modal from './Modal';

/**
 * Represents the background of the modal.
 * @class ModalPage
 * */
export default class ModalPage extends Component {
    /**
     * @constructs Item
     * @param {Object} props - Object passed down to us from our parent.
     * */
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var modal_classes = (this.props.modal_visible) ? 'ui dimmer modals page transition visible active' : 'ui dimmer modals page transition hidden';
        return (
            <div className={modal_classes} onClick={this.props.switchModalVisibility}>
                <Modal category={this.props.category}
                       modal_visible={this.props.modal_visible}
                       editCategory={this.props.editCategory}
                       switchModalVisibility={this.props.switchModalVisibility}/>
            </div>
        );
    }
}