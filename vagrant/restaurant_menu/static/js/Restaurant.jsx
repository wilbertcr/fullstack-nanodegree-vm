import React from 'react';
import Component from './Component';
import { RIEToggle, RIEInput, RIENumber, RIETags } from 'riek';
import Menu from './Menu';

export default class Restaurant extends Component{

    constructor(props) {
        super(props);
        this.state = {name:'',editing: false};
        this.props = {data: {}};
    }

    editRestaurant(data){
        var name = data.name;
        var id = this.props.restaurant.id;
        var index = this.props.index;
        var restaurant = {name: name, index: index, id: id}
        this.props.editRestaurant(restaurant);
        this.setState({editing: false});
    }

    deleteRestaurant(){
        this.props.deleteRestaurant(this.props.restaurant.id);
    }

    displayMenu(){
        this.props.displayMenu(this.props.restaurant);
    }

    handleEdit(e){
        if(!this.state.editing){
            this.setState({editing: true});
        } else {
            this.setState({editing: false});
        }
    }

    render(){
        var restaurant = this.props.restaurant;
        var name;
        if(this.state.editing===true){
            name = <RIEInput
                        value={restaurant.name}
                        propName="name"
                        change={this.editRestaurant}
                        className="InLineEdit"
                    />;
        } else {
            name = restaurant.name;
        }
        return(
            <li>
                <div>
                    <span className="fa fa-pencil-square-o"
                          onClick={this.handleEdit}>
                    </span>
                        &nbsp;
                    <span className="fa fa-trash"
                          onClick={this.deleteRestaurant}>
                        &nbsp;&nbsp;
                    </span>
                    <a className="navbarLink"
                         onClick={this.displayMenu}>
                        {name}
                    </a>
                </div>
            </li>
        );
    }
}