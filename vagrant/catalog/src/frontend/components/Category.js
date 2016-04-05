import React from 'react';
import { RIEToggle, RIEInput, RIENumber, RIETags } from 'riek';
import Component from './Component';
import ModalPage from './ModalPage';
import ModalPageGeneric from './ModalPageGeneric'
import EditCategoryForm from './EditCategoryForm'

export default class Category extends Component{

    constructor(props) {
        super(props);
        this.state = {name:'',
            isModalVisible: false
        };
        this.reactComponent = <element></element>;
    }

    editCategory(category){
        this.props.editCategory(category);
    }


    deleteCategory(){
        console.log("Showing modal");
        console.log(this.state.modal_ref);
        this.props.deleteCategory(this.props.category.id);
    }

    displayCategory(){
        this.props.displayCategory(this.props.category);
    }


    /**
     *
     * */
    switchModalVisibility(){
        console.log("Modal is now:"+this.state.isModalVisible ? 'visible': 'hidden');
        this.setState({...this.state,isModalVisible: !this.state.isModalVisible});
    }

    componentDidMount(){

    }

    render(){
        {console.log({...this.props,switchModalVisibility: this.switchModalVisibility})}
        this.EditCategoryForm = <EditCategoryForm {...this.props} switchModalVisibility={this.switchModalVisibility}/>;
        return(
            <a className="blue left item">
                <i className="edit icon"
                      style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                      onClick={this.switchModalVisibility}>
                </i>
                <i className="erase icon"
                      style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                      onClick={this.displayDeleteModal}>
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
                                  editCategory={this.editCategory}
                                  reactComponent={this.EditCategoryForm}
                />
           </a>
        );
    }
}