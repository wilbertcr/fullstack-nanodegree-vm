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
        /**
         *Represents the current state.
         * @type {Object}
         * @property {Object[]} state.node - A reference to the modal container here.
         * @property {{styles: {top: number, left: number}}} - Used to center the container modal.
         * */
        this.state = {
            node: null,
            styles: {
                top: 0,
                left: 0
            }
        };
    }

    /**
     * Click handler. We don't want clicks propagating up, as they would hide the entire modal.
     * So here we stop propagation of clicks.
     * @param e - The click event.
     * */
    handleClick(e){
        e.stopPropagation();
    }

    componentDidMount(){
        this.state.node = this.modalRef;
    }

    render() {
        var top = (window.innerHeight-$(this.state.node).height())/2;
        var modalClasses = (this.props.isVisible)? 'ui small modal transition visible active': 'ui modal transition hidden';
        //modalClasses determine which classes to use depending on the visibility state.
        return (
            <div className={modalClasses}
                 onClick={this.handleClick}
                 style={{top: top}}
                 ref={(ref) => this.modalRef=ref}>
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