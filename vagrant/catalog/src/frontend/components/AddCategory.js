import React from 'react';
import { RIEToggle, RIEInput, RIENumber, RIETags } from 'riek';
import Component from './Component';
import ModalPage from './ModalPage';

export default class AddCategory extends Component{

    constructor(props) {
        super(props);
        this.state = {
            edit_modal_visible: false
        };
    }


    switchModalVisibility(){
        if(this.props.loginStatus.value){
            this.setState({...this.state,edit_modal_visible: !this.state.edit_modal_visible});
            console.log("Modal is now:"+this.state.edit_modal_visible);
        }
    }

    render(){
        return(
            <a className="blue left item">
                <i className="edit icon"
                      style={{display: this.props.loginStatus.value ? 'inline-block' : 'none'}}
                      onClick={this.switchModalVisibility}>
                </i>
                <ModalPage modal_visible={this.state.edit_modal_visible}
                           switchModalVisibility={this.switchModalVisibility}
                           editCategory={this.editCategory} />
           </a>
        );
    }
}