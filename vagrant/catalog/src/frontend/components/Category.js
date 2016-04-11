import React from 'react';
import Component from './Component';
import ModalPageGeneric from './ModalPageGeneric'
import EditCategoryForm from './EditCategoryForm'

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
            isModalVisible: false,
            active: false,
        };
        this.reactComponent = <element></element>;
    }

    deleteCategory(){
        this.props.deleteCategory(this.props.category.id);
    }

    displayCategory(){
        this.setState({...this.state,active: true});
        this.props.displayCategory(this.props.category.id);
        this.props.setActiveCategory(this.props.category.id)
    }


    /**
     *
     * */
    switchModalVisibility(){
        console.log("Modal is now:"+this.state.isModalVisible ? 'visible': 'hidden');
        this.setState({...this.state,isModalVisible: !this.state.isModalVisible});
    }

    setActiveCategory(){

    }

    componentDidMount(){

    }

    render(){
        this.reactElement = <EditCategoryForm
            {...this.props}
            switchModalVisibility={this.switchModalVisibility}
        />;
        var classes = this.props.activeCategory==this.props.category.id ?
            "blue left active item":
            "blue left item";
        return(
            <a className={classes}>
                <i className="trash red icon"
                   style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                   onClick={this.deleteCategory}>
                </i>
                <i className="edit blue icon"
                      style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                      onClick={this.switchModalVisibility}>
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
                                  isVisible={this.state.isModalVisible}
                                  switchModalVisibility={this.switchModalVisibility}
                                  editCategory={this.props.editCategory}
                                  reactComponent={this.reactElement}
                />
           </a>
        );
    }
}