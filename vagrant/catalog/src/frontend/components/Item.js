import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import EditItemForm from './EditItemForm';
import DeleteItemForm from './DeleteItemForm'
import ModalPageGeneric from './ModalPageGeneric'
/**
 * Represents an item in a category.
 * @class Item
 * */
export default class Item extends Component {
    /**
     * @constructs Item
     * @param {Object} props - Object passed down to us from our parent.
     * @param {{name: string, price: string, description: string, picture: string }} props.item
     * @param {STATUS} props.loginStatus - See {@link CatalogApp#STATUS}
     * */
    constructor(props) {
        super(props);
        /**
         *Represents login status
         * @type {Object}
         * @property {{value: true, name: "LoggedIn"}} STATUS.LoggedIn - User is logged in.
         * @property {{value: false, name: "LoggedOut"}} STATUS.LoggedOut - User is logged out.
         * */
        this.STATUS = {
            LoggedIn : {value: true, name: "LoggedIn"},
            LoggedOut : {value: false, name: "LoggedOut"}
        };
        /** @member {Object} A State object composed of the state variables
         * @property {boolean} state.isEditModalVisible - If true, the "Edit" modal is visible, if false the "Edit" modal is hidden.
         * @property {boolean} state.isDeleteModalVisible - If true, the "Delete" modal is visible, if false the "Delete" modal is hidden.
         * */
        this.state = {
            isEditModalVisible: false,
            isDeleteModalVisible: false,
        };

        /** @member {Object} The React element we will display inside the "Edit" modal.*/
        this.EditReactElement = <element></element>;
        /** @member {Object} The React element we will display inside the "Delete" modal.*/
        this.DeleteReactElement = <element></element>;
    }

    /**
     * Changes visibility of "Edit" modal
     * */
    switchEditModalVisibility(){
        this.setState({...this.state,isEditModalVisible: !this.state.isEditModalVisible});
    }

    /**
     * Changes visibility of "Delete" modal
     * */
    switchDeleteModalVisibility(){
        this.setState({...this.state,isDeleteModalVisible: !this.state.isDeleteModalVisible});
    }

    render() {

        this.EditReactElement = <EditItemForm
            {...this.props}
            switchModalVisibility={this.switchEditModalVisibility}
        />;
        this.DeleteReactElement = <DeleteItemForm
            {...this.props}
            switchModalVisibility={this.switchDeleteModalVisibility}
        />;
        return (
            <div className="item">
                <div className="ui small circular bordered image">
                    <img src={this.props.item.picture}></img>
                </div>
                <div className="content">
                    <a className="header">
                        Name: {this.props.item.name}
                    </a>
                    <div className="meta">
                        Price: ${this.props.item.price}
                    </div>
                    <div className="description">
                        Description: {this.props.item.description}
                    </div>
                    <div className="extra"
                         style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}>
                        <div className="ui two butons">
                            <div className="ui basic blue icon button"
                                 tabIndex="0"
                                 onClick={this.switchEditModalVisibility}>
                                <i className="edit icon"></i>
                            </div>
                            <div className="ui basic red icon button"
                                 tabIndex="1"
                                 onClick={this.switchDeleteModalVisibility}>
                                <i className="trash icon"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalPageGeneric isVisible={this.state.isEditModalVisible}
                                  switchModalVisibility={this.switchEditModalVisibility}
                                  reactComponent={this.EditReactElement}
                />
                <ModalPageGeneric isVisible={this.state.isDeleteModalVisible}
                                  switchModalVisibility={this.switchDeleteModalVisibility}
                                  reactComponent={this.DeleteReactElement}
                />
            </div>
        );
    }
}
