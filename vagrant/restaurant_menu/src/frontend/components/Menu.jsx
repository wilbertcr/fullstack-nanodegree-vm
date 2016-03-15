import React from 'react';
import Component from './Component';
import MenuItem from './MenuItem';
import NewItemForm from './NewItemForm';

export default class Menu extends Component{
    constructor(props){
        super(props);
        this.state = {data: []};
    }

    //Stores the new item in the server and updates the
    //menu accordingly once the server has responded appropriately.
    handleNewItemSubmit(item){
        this.props.addMenuItem(item);
    }

    //@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/edit', methods=['POST'])
    editMenuItem(item){
        var restaurantId = this.props.id;
        var itemId = item.id;
        var endpoint = "/restaurants/"+restaurantId+"/"+itemId+"/edit";
        $.ajax({
            url: endpoint,
            dataType:'json',
            type: 'post',
            data: item,
            cache: false,
            success: function(menuItem){
                console.log("Success!");
            }.bind(this),
            error: function(xhr, status, err){
                console.error(restaurantListURL, status, err.toString());
            }.bind(this)
        });
    }


    deleteMenuItem(item){
        console.log("Menu item:");
        console.log(item);
        this.props.deleteMenuItem(item);
    }

    render() {
        let name = this.props.initialized ? this.props.name+"'s" : "";
        return(
            <div className="Menu">
                <h2>{name} Menu</h2>
                <div>
                    {this.props.menuItems.map(
                        function(item,index){
                            return <MenuItem key={item.id}
                                             item={item}
                                             index = {index}
                                             editMenuItem={this.editMenuItem}
                                             deleteMenuItem={this.deleteMenuItem}/>;
                        }.bind(this)
                    )}
                </div>
                <NewItemForm onNewItemSubmit={this.handleNewItemSubmit}/>
            </div>
        );
    }
}
