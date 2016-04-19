import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import ModalGeneric from './ModalGeneric';

/**
 * Represents the background of the modal.
 * See bottom of file for required props.
 * @class ModalPage
 * */
export default class ModalPageGeneric extends Component {
    /**
     * @constructs Item
     * @param {Object} props - Object passed down to us from our parent.
     * */
    constructor(props) {
        super(props);
    }

    /**
     * Prevents default behavior and prevents
     * event e from propagating up the node tree.
     * */
    stopEvent(e){
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        var modal_classes = (this.props.isVisible) ? 'ui dimmer modals page transition visible active' : 'ui dimmer modals page transition hidden';
        return (
            <div className={modal_classes}
                 onClick={this.props.switchModalVisibility}
                 onDrop={this.stopEvent}
                 onDragOver={this.stopEvent}>
                <ModalGeneric {...this.props}/>
            </div>
        );
    }
}


/**
 * isVisible: This is supposed to be a state in the element that this modal page is enclosed in.
 * switchModalVisibility: Is supposed to be the following function
 *    switchModalVisibility(){
 *       this.setState({...this.state,isVisible: !this.state.isVisible});
 *   }
 * */
ModalPageGeneric.propTypes = {
    isVisible: React.PropTypes.bool.isRequired,
    switchModalVisibility: React.PropTypes.func.isRequired,
    reactComponent: React.PropTypes.element.isRequired
}