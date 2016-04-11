import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import EditItemForm from './EditItemForm';
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
        this.state = {
            isModalVisible: false
        }
    }

    switchModalVisibility(){
        this.setState({...this.state,isModalVisible: !this.state.isModalVisible});
    }

    componentWillMount(){

    }



    render() {


        this.reactElement = <EditItemForm
            {...this.props}
            switchModalVisibility={this.switchModalVisibility}
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
                                 onClick={this.switchModalVisibility}>
                                <i className="edit icon"></i>
                            </div>
                            <div className="ui basic red icon button"
                                 tabIndex="1">
                                <i className="trash icon"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalPageGeneric isVisible={this.state.isModalVisible}
                                  switchModalVisibility={this.switchModalVisibility}
                                  reactComponent={this.reactElement}
                />
            </div>
        );
    }
}
