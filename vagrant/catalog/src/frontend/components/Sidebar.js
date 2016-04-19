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
     * @param {Object[]} props.categories - See {@link CatalogApp#state}
     * @param {STATUS} props.loginStatus - See {@link CatalogApp#STATUS}
     * */
    constructor(props){
        super(props);
        /** @member {Object} A State object composed of the state variables
         * @property {boolean} state.isModalVisible - If true, the modal is visible, if false, the modal is hidden.
         * @property {number} state.activeCategory - The id of the active category.
         * */
        this.state = {
            isModalVisible: false,
            activeCategory: 0
        }
    }

    switchModalVisibility(){
        /**
         * Changes the visibility of the modal.
         * */
        this.setState({...this.state,isModalVisible: !this.state.isModalVisible});
    }

    setActiveCategory(id){
        /**
         * This function is passed to all categories. When clicked, a category will pass its
         * id to this function and that way we'll know which category is being displayed at all times.
         * */
        this.setState({activeCategory: id})
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
                                         activeCategory={this.state.activeCategory}
                                         setActiveCategory={this.setActiveCategory}
                                         loginStatus={this.props.loginStatus}
                                         deleteCategory={this.props.deleteCategory}
                                         editCategory={this.props.editCategory}
                                         displayCategory={this.props.displayCategory}/>;
                    }.bind(this)
                )}
                <div className="ui item"
                     style={{display: this.props.loginStatus.value ? 'block' : 'none'}}>
                    <div className="ui buttons" style={{display: 'flex'}}>
                        <div className="medium ui icon blue basic button"
                             onClick={this.switchModalVisibility}>
                            <i className="add square icon"></i>
                        </div>
                    </div>
                    <ModalPageGeneric isVisible={this.state.isModalVisible}
                                      switchModalVisibility={this.switchModalVisibility}
                                      reactComponent={this.reactElement}
                    />
                </div>
            </div>
        );
    }
}