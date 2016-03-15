import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import RestaurantList from './RestaurantList';
import Menu from './Menu';

export default class RestaurantsApp extends Component {

    constructor(props){
        super(props);
        this.state = {
            restaurantListURL: "/restaurants/JSON",
            initialized: false,
            id: 0,
            name: "",
            menuItems: [],
            restaurants: [],
        }
        console.log("test");
    }


    displayMenu(restaurant){
        let endpoint = "/restaurants/"+restaurant.id+"/menu/JSON";
        $.ajax({
            url: endpoint,
            dataType:'json',
            cache: false,
            success: function(data){
                let prevState = this.state;
                let newState = {...this.state,
                            menuItems: data.MenuItems,
                            initialized: true,
                            name: restaurant.name,
                            id: restaurant.id};
                this.setState(newState);
            }.bind(this),
            error: function(xhr, status, err){
                console.error(url, status, err.toString());
            }.bind(this)
        });
    }

    addMenuItem(item){
        var endpoint = "/restaurants/"+this.state.id+"/menu/new";
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: item,
            success: function(data){
                var newItem = data['NewItem'];
                var menuItems = [newItem,...this.state.menuItems];
                this.setState({menuItems: menuItems});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });
    }

    deleteMenuItem(item){
        console.log("Deleting item with id: %d",item.id);
        let restaurantId = this.state.id;
        let itemId = item.id;
        let menuItems = [...this.state.menuItems];
        for(let i=0; i< menuItems.length; i++){
            if(menuItems[i].id = itemId){
                menuItems.splice(i,1);
                this.setState({menuItems: menuItems});
                break;
            }
        }
        let endpoint = "/restaurants/"+restaurantId+"/delete/"+itemId;
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: [],
            success: function(data){
                this.setState({menuItems: data.MenuItems});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });
    }

    addRestaurant(restaurant){
        var endpoint = "restaurants/new"
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

    deleteRestaurant(id){
        console.log("Erasing data with id: %d",id);
        var restaurants = [...this.state.restaurants];
        for(let i = 0; i < restaurants.length; i++){
            if(restaurants[i].id === id){
                restaurants.splice(i,1);
                if(id!==this.state.id){
                    this.setState({restaurants: restaurants});
                } else {
                    this.setState({restaurants: restaurants,
                        initialized: false,
                        name: "",
                        menuItems: [],
                        id: 0});
                }
                break;
            }
        }
        var endpoint = "/restaurants/delete/"+id;
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: id,
            success: function(data){
                this.setState({restaurants: restaurants});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });
    }

    loadRestaurants(){
        $.ajax({
            url: this.state.restaurantListURL,
            dataType:'json',
            cache: false,
            success: function(data){
                this.setState({restaurants: data.restaurants});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(restaurantListURL, status, err.toString());
            }.bind(this)
        });
    }

    componentDidMount(){
        this.loadRestaurants();
        setInterval(this.loadRestaurants,120000);
    }

    render(){
        var menu;
        menu = <Menu initialized = {this.state.initialized}
                     name={this.state.name}
                     id={this.state.id}
                     menuItems={this.state.menuItems}
                     addMenuItem={this.addMenuItem}
                     deleteMenuItem={this.deleteMenuItem}/>;
        return(
            <div>
                <div id="leftcolumn">
                    <RestaurantList restaurants={this.state.restaurants}
                                    displayMenu={this.displayMenu}
                                    deleteRestaurant={this.deleteRestaurant}
                                    addRestaurant={this.addRestaurant}/>
                </div>
                <div id="centercolumn">
                    {menu}
                </div>
                <div id="rightcolumn">
                </div>
                <div id="footer">&copy; Copyright with...</div>
            </div>
        );
    }
}

$( document ).ready(function() {
    ReactDOM.render(
        <RestaurantsApp/>,
        document.getElementById("mainbox")
    );
});

