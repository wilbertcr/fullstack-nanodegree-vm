import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import NewRestaurantForm from './NewRestaurantForm';
import Restaurant from './Restaurant';


export default class RestaurantList extends Component{
    constructor(props) {
        super(props);
    }

    addRestaurant(data){
        this.props.addRestaurant(data);
    }

    deleteRestaurant(id){
        this.props.deleteRestaurant(id);
    }

    editRestaurant(restaurant){
        var name = restaurant.name;
        var id= restaurant.id;
        var index = restaurant.index;
        var newRestaurant = {name: name, id: id};
        this.setState({data: this.props.restaurants.splice(index,1,newRestaurant)});
        var endpoint = "/restaurants/edit/"+id;
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: restaurant,
            success: function(data){
                this.setState({restaurants: data.restaurants});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });

    }

    displayMenu(restaurant){
        this.props.displayMenu(restaurant);
    }

    render() {
        return (
            <div>
                <ul className="mainnav">
                    {this.props.restaurants.map(
                        function(restaurant,index) {
                            return <Restaurant key={restaurant.id}
                                               index={index}
                                               restaurant={restaurant}
                                               deleteRestaurant={this.deleteRestaurant}
                                               editRestaurant={this.editRestaurant}
                                               displayMenu={this.displayMenu}
                            />;
                        }.bind(this)
                    )}
                </ul>
                <NewRestaurantForm onNewRestaurantSubmit={this.addRestaurant}/>
            </div>
        );
    }
}