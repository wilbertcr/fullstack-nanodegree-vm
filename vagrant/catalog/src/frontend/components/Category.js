import React from 'react';
import { RIEToggle, RIEInput, RIENumber, RIETags } from 'riek';
import Component from './Component';
import ModalPage from './ModalPage';

export default class Category extends Component{

    constructor(props) {
        super(props);
        this.state = {name:'',
            editing: false,
            edit_modal_visible: false};
        this.props = {data: {}};
    }

    updateName(name){
        this.props.category.name = name;
        this.setState({...this.state});
        console.log(this.props.category.name);
    }

    editCategory(category){
        this.props.editCategory(category);
        this.setState({...this.state,edit_modal_visible: !this.state.edit_modal_visible});
    }

    deleteCategory(){
        console.log("Showing modal");
        console.log(this.state.modal_ref);
        this.props.deleteCategory(this.props.category.id);
    }

    displayCategory(){
        this.props.displayCategory(this.props.category);
    }

    handleEdit(e){
        if(!this.state.editing){
            this.setState({editing: true});
        } else {
            this.setState({editing: false});
        }
        console.log();
    }

    displayDeleteModal(){

    }

    displayEditModal(){
        if(this.props.loginStatus.value){
            this.setState({...this.state,edit_modal_visible: !this.state.edit_modal_visible});
            console.log("Modal is s now:"+this.state.edit_modal_visible);
        }
    }

    render(){
        return(
            <a className="blue left item">
                <i className="edit icon"
                      style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                      onClick={this.displayEditModal}>
                </i>
                <i className="erase icon"
                      style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                      onClick={this.displayDeleteModal}>
                </i>
                <div className="ui blue circular label">{this.props.category.items.length}</div>
                <div className="ui text"
                     onClick={this.displayCategory}>
                    {this.props.category.name}
                </div>
                <ModalPage category={this.props.category}
                           modal_visible={this.state.edit_modal_visible}
                           displayModal={this.displayEditModal}
                           editCategory={this.editCategory} />
           </a>
        );
    }
}