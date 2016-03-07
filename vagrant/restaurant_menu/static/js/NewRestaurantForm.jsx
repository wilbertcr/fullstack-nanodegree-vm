import React from 'react';

export default class NewRestaurantForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {name: ''};
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(e){
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
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                /><br/>
                <input className="redButton" type="submit" value="Submit"/>
            </form>
        );
    }
}