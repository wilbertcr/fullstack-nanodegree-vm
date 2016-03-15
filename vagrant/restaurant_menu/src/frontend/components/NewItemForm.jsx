import React from 'react';
import Component from './Component';


export default class NewItemForm extends Component{
    constructor(props){
        super(props);
        this.state = {name: '',price:'',course:'',description:''};
    }
    handleNameChange(e){
        e.preventDefault();
        this.setState({name: e.target.value});
    }
    handleDescriptionChange(e){
        e.preventDefault();
        this.setState({description: e.target.value});
    }
    handlePriceChange(e){
        e.preventDefault();
        this.setState({price: e.target.value});
    }
    handleCourseChange(e){
        e.preventDefault();
        this.setState({course: e.target.value});
    }
    handleSubmit(e){
        e.preventDefault();
        var name = this.state.name.trim();
        var description = this.state.description.trim();
        var price = this.state.price.trim();
        var course = this.state.course.trim();
        this.props.onNewItemSubmit({name: name, description: description, price: price, course: course});
        this.setState({name:'',description:'',price:'',course:''});
    }
    render(){
        return(
            <form className="newItemForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={this.state.name}
                    onChange={this.handleNameChange}
                /><br/>

                <input
                    type="text"
                    placeholder="Description"
                    value={this.state.description}
                    onChange={this.handleDescriptionChange}
                /><br/>

                <input
                    type="text"
                    placeholder="Price"
                    value={this.state.price}
                    onChange={this.handlePriceChange}
                /><br/>

                <input
                    type="text"
                    placeholder="Course"
                    value={this.state.course}
                    onChange={this.handleCourseChange}
                /><br/>
                <input className="redButton" type="submit" value="Submit"/>
            </form>
        );
    }
}