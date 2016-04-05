import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';


/**
 * Represents the modal itself.
 * @class Modal
 * */
export default class ModalGeneric extends Component {
    /**
     * @constructs Modal
     * @param {Object} props - Object passed down to us from our parent.
     * */
    constructor(props) {
        super(props);
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
        console.log(this.props.reactComponent.props);

        var modalClasses = (this.props.isVisible)? 'ui small modal transition visible active': 'ui modal transition hidden';
        return (
            <div className={modalClasses}
                onClick={this.handleClick}>
                {this.props.reactComponent}
            </div>
        );
    }
}

ModalGeneric.propTypes = {
    isVisible: React.PropTypes.bool.isRequired,
    switchModalVisibility: React.PropTypes.func.isRequired,
    reactComponent: React.PropTypes.element.isRequired
}