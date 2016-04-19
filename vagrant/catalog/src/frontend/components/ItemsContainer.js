import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Item from './Item';
import AddItemForm from './AddItemForm'
import ModalPageGeneric from './ModalPageGeneric'

/**
 * Items container
 * @class ItemsContainer
 * */
export default class ItemsContainer extends Component {
    /**
     * @constructs ItemsContainer
     * @param {Object} props - Object passed down to us from our parent..
     * @param {STATUS} props.loginStatus - See {@link CatalogApp#STATUS}
     * @param {number} props.categoryId - See {@link CatalogApp#state}
     * @param {Object[]} props.items - See {@link CatalogApp#state}
     * */
    constructor(props) {
        super(props);
        /**
         * @member {Object} A state object composed of the state variables.
         * @property {boolean} state.isModalVisible - If true, modal is visible.
         * */
        this.state = {
            isModalVisible: false
        };
        /** @member {Object} The React element we will display inside the "addItem" modal. Also see {@link ItemsContainer#render}*/
        this.reactComponent = <element></element>;
    }

    /**
     * Switches the visibility of addItemForm's modal.
     * */
    switchModalVisibility(){
        this.setState({...this.state,isModalVisible: !this.state.isModalVisible});
    }

    render() {
        var addItemButton = function(){
            if(this.props.categoryId !== 0) {
                //If a category has been selected.
                this.reactElement = <AddItemForm
                    addItem={this.props.addItem}
                    categoryId={this.props.categoryId}
                    switchModalVisibility={this.switchModalVisibility}
                />;
                return (
                    <div className="item"
                         style={{display: this.props.loginStatus.value ? 'block' : 'none'}}>
                        <div className="content">
                            <div className="extra">
                                <div className="ui buttons" style={{display: 'flex'}}>
                                    <div className="huge ui icon blue basic button"
                                         onClick={this.switchModalVisibility}>
                                        <i className="add square icon"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ModalPageGeneric isVisible={this.state.isModalVisible}
                                          switchModalVisibility={this.switchModalVisibility}
                                          reactComponent={this.reactElement}
                        />
                    </div>);
            } else {
                //If no category has been selected
                return <div></div>;
            }
        }.bind(this);
        return (
            <div className="container segment">
                <div className="ui one doubling divided items">
                    {this.props.items.map(
                        function(item,index){
                            return <Item key={item.id}
                                         index={index}
                                         item={item}
                                {...this.props}
                            />;
                        }.bind(this)
                    )}
                    {addItemButton()}
                </div>
            </div>
        );
    }
}