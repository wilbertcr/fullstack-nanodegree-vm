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
     * */
    constructor(props) {
        super(props);
        this.state = {name:'',
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            active: false,
        };
        this.EditReactElement = <element></element>;
        this.DeleteReactElement = <element></element>;
    }

    displayCategory(){
        this.setState({...this.state,active: true});
        this.props.displayCategory(this.props.category.id);
        this.props.setActiveCategory(this.props.category.id)
    }


    /**
     *
     * */
    switchEditModalVisibility(){
        console.log("Modal is now:"+this.state.isEditModalVisible ? 'visible': 'hidden');
        this.setState({...this.state,isEditModalVisible: !this.state.isEditModalVisible});
    }

    switchDeleteModalVisibility(){
        console.log("Modal is now:"+this.state.isDeleteModalVisible ? 'visible': 'hidden');
        this.setState({...this.state,isDeleteModalVisible: !this.state.isDeleteModalVisible});
    }

    setActiveCategory(){

    }

    componentDidMount(){

    }

    render(){
        console.log("working");
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