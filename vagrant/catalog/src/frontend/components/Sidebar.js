import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Category from './Category';
import ModalPageGeneric from './ModalPageGeneric'
import EditCategoryForm from './EditCategoryForm'
import AddCategoryForm from './AddCategoryForm'

/**
 * Sidebar container component.
 * @class Sidebar
 * */
export default class Sidebar extends Component {
    /**
     * @constructs Sidebar
     * @param {Object} props - Object passed down to us from our parent..
     * */
    constructor(props){
        super(props);
        this.state = {
            isModalVisible: false,
            //
            name: " "
        }
    }

    switchModalVisibility(){
        this.setState({...this.state,isModalVisible: !this.state.isModalVisible});
    }

    render(){

        this.reactElement = <AddCategoryForm
            {...this.props}
            switchModalVisibility={this.switchModalVisibility}
            addCategory={this.props.addCategory}
        />;
        return(
            <div className="ui small left vertical menu">
                {this.props.categories.map(
                    function(category,index){
                        return <Category key={category.id}
                                         index={index}
                                         category={category}
                                         loginStatus={this.props.loginStatus}
                                         deleteCategory={this.props.deleteCategory}
                                         editCategory={this.props.editCategory}
                                         displayCategory={this.props.displayCategory}/>;
                    }.bind(this)
                )}
                <div className="ui item"
                     style={{display: this.props.loginStatus.value ? 'block' : 'none'}}>
                    <div className="ui buttons">
                        <div className="medium ui icon blue basic button"
                             onClick={this.switchModalVisibility}>
                            <i className="add square icon"></i>
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