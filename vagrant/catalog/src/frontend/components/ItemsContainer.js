import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Item from './Item';
import AddItemForm from './AddItemForm'
import ModalPageGeneric from './ModalPageGeneric'

/**
 * Main container.
 * @class ItemsContainer
 * */
export default class ItemsContainer extends Component {
    /**
     * @constructs ItemsContainer
     * @param {Object} props - Object passed down to us from our parent..
     * */
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
        };
        this.reactComponent = <element></element>;
    }

    switchModalVisibility(){
        this.setState({...this.state,isModalVisible: !this.state.isModalVisible});
    }

    componentDidMount(){

    }

    render() {

        var addItemButton = function(){
            if(this.props.categoryId !== 0) {
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