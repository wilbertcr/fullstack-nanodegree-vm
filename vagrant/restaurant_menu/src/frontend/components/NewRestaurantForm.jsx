import React from 'react';
import Component from './Component';


export default class NewRestaurantForm extends Component{
    constructor(props){
        super(props);
        this.state = {name: ''};
    }

    handleNameChange(e) {
        this.setState({name: e.target.value});
    }
    handleSubmit(e){
        e.preventDefault();
        this.props.onNewRestaurantSubmit({name: this.state.name.trim()});
        this.state.name='';
    }

    render(){
        return(
            <form className="newRestaurantForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="New Restaurant"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                /><br/>
                <button className="redButton" type="submit">
                    <i className="fa fa-paper-plane"></i>
                </button>
            </form>
        );
    }
}