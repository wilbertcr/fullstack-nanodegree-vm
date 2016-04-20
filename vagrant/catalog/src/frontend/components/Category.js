import React from 'react';
import Component from './Component';
import ModalPageGeneric from './ModalPageGeneric'
import EditCategoryForm from './EditCategoryForm'
import DeleteCategoryForm from './DeleteCategoryForm'

/**
 * Represents the modal itself.
 * @class Category
 * */
export default class Category extends Component{
    /**
     * @constructs Category
     * @param {Object} props - Object passed down to us from our parent.
     * @param {{id: number, name: string, picture: string}} props.category - A category in the categories array here {@link CatalogApp#state}.
     * @param {STATUS} props.loginStatus - See {@link CatalogApp#STATUS}
     * @param {Object} props.displayCategory - See {@link CatalogApp#displayCategory}
     * @param {Object} props.setActiveCategory - See {@link Sidebar#setActiveCategory}
     * */
    constructor(props) {
        super(props);
        /** @member {Object} A State object composed of the state variables
         * @property {string} state.name - The name of the category
         * @property {boolean} state.isEditModalVisible - If true, edit modal is visible.
         * @property {boolean} state.isDeleteModalVisible - If true, delete modal is visible.
         * */
        this.state = {
            name:"",
            isEditModalVisible: false,
            isDeleteModalVisible: false,
        };
        /** @member {Object} The React element we will display inside the "Edit" modal. Also see {@link Category#render}*/
        this.EditReactElement = <element></element>;
        /** @member {Object} The React element we will display inside the "Delete" modal. Also see {@link Category#render}*/
        this.DeleteReactElement = <element></element>;
    }

    displayCategory(){
        /**
         * Triggered when a category is clicked.
         * */
        //Someone up the chain will display the items of this category and that someone
        //needs to know the category id we want to display.
        this.props.displayCategory(this.props.category.id);
        //We need to tell the world that this category is now the one being displayed.
        this.props.setActiveCategory(this.props.category.id)
    }

    switchEditModalVisibility(){
        /**
         * Changes the visibility of the "Edit" Modal.
         * */
        this.setState({...this.state,isEditModalVisible: !this.state.isEditModalVisible});
    }

    switchDeleteModalVisibility(){
        /**
         * Changes the visibility of the "Delete" Modal.
         * */
        this.setState({...this.state,isDeleteModalVisible: !this.state.isDeleteModalVisible});
    }

    render(){

        this.EditReactElement = <EditCategoryForm
            {...this.props}
            switchModalVisibility={this.switchEditModalVisibility}
        />;

        this.DeleteReactElement = <DeleteCategoryForm
            {...this.props}
            switchModalVisibility={this.switchDeleteModalVisibility}
        />;

        var classes = this.props.activeCategory==this.props.category.id ?
            "blue left active item":
            "blue left item";

        return(
            <a className={classes}>
                <i className="trash red icon"
                   style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                   onClick={this.switchDeleteModalVisibility}>
                </i>
                <i className="edit blue icon"
                      style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                      onClick={this.switchEditModalVisibility}>
                </i>
                <div className="ui blue circular label"
                     onClick={this.displayCategory}>
                    {this.props.category.items.length}
                </div>
                <div className="ui text"
                     onClick={this.displayCategory}>
                    {this.props.category.name}
                </div>
                <ModalPageGeneric category={this.props.category}
                                  isVisible={this.state.isEditModalVisible}
                                  switchModalVisibility={this.switchEditModalVisibility}
                                  editCategory={this.props.editCategory}
                                  reactComponent={this.EditReactElement}
                />
                <ModalPageGeneric category={this.props.category}
                                  isVisible={this.state.isDeleteModalVisible}
                                  switchModalVisibility={this.switchDeleteModalVisibility}
                                  deleteCategory={this.props.deleteCategory}
                                  reactComponent={this.DeleteReactElement}
                />
           </a>
        );
    }
}