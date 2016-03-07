

var MenuItems = React.createClass({
    render: function() {
        var menuItemNodes = this.props.data.map(
            function(item,index){
                return(
                    <table key={item.id}>
                        <tbody>
                        <tr>
                            <td className="name left">{item.name}</td>
                            <td className="price right">&#36;{item.price}</td>
                        </tr>
                        <tr>
                            <td className="left description">{item.description}</td>
                            <td className="right"></td>
                        </tr>
                        <tr>
                            <td className="left">
                                <button className="editItemButton"
                                        onClick={this.props.editMenuItem}
                                        data-key={item.id}
                                        data-index={index}>edit
                                </button>
                            </td>
                            <td className="right">
                                <button className="deleteItemButton"
                                        onClick={this.props.deleteMenuItem}
                                        data-key={item.id}
                                        data-index={index}>delete
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                );
            }.bind(this)
        );
        return (
            <div className="menuItems">
                {menuItemNodes}
            </div>
        );
    }
});

var Menu = React.createClass({
    //Loads/refreshes menu items in display.
    loadItemsFromServer: function(){
        $.ajax({
            url: this.props.url,
            dataType:'json',
            cache: false,
            success: function(data){
                this.setState({data: data.MenuItems});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    //Stores the new item in the server and updates the
    //menu accordingly once the server has responded appropriately.
    handleNewItemSubmit: function(item){
        var restaurant = this.props.restaurant;
        var MenuItems = this.state.data;
        var endpoint = "/restaurants/"+restaurant.id+"/menu/new";
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: item,
            success: function(data){
                var NewItemWrapper = data['NewItem'];
                var NewItem = NewItemWrapper[0];
                var newMenuItems = MenuItems.concat([NewItem]);
                this.setState({data: newMenuItems});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });
    },
    getInitialState: function(){
        return{data: []};
    },
    componentDidMount:function(){
        this.loadItemsFromServer();
        setInterval(this.loadItemsFromServer,this.props.pollInterval);
    },
    deleteMenuItem: function(e){
        var key = parseInt(e.target.attributes.getNamedItem('data-key').value,10);
        var index = parseInt(e.target.attributes.getNamedItem('data-index').value,10);
        console.log("Erased menu item with key %d and index %d",key,index);
        this.setState({data: this.state.data.splice(index,1)});
        var restaurant = this.props.restaurant;
        var endpoint = "/restaurants/"+restaurant.id+"/"+key+"/delete";
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: key,
            success: function(data){
                this.setState({data: data.MenuItems});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });
    },
    render: function(){
        var restaurant = this.props.restaurant;
        return(
        <div className="Menu">
            <h2>{restaurant.name+"'s"} Menu</h2>
            <MenuItems data={this.state.data} deleteMenuItem={this.deleteMenuItem}/>
            <NewItemForm onNewItemSubmit={this.handleNewItemSubmit}/>
        </div>
        );
    }
});

var NewItemForm = React.createClass({
    getInitialState: function(){
        return{name: '', price: '', course:'', description:''}
    },
    handleNameChange:function(e){
        this.setState({name: e.target.value});
    },
    handleDescriptionChange:function(e){
        this.setState({description: e.target.value});
    },
    handlePriceChange:function(e){
        this.setState({price: e.target.value});
    },
    handleCourseChange:function(e){
        this.setState({course: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var name = this.state.name.trim();
        var description = this.state.description.trim();
        var price = this.state.price.trim();
        var course = this.state.course.trim();
        this.props.onNewItemSubmit({name: name, description: description, price: price, course: course});
        this.setState({name:'',description:'',price:'',course:''});
    },
    render: function(){
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
});


var NewRestaurantForm = React.createClass({
    getInitialState: function(){
        return{name: ''}
    },
    handleNameChange:function(e){
        this.setState({name: e.target.value});
    },
    handleSubmit: function(e){
        e.preventDefault();
        var name = this.state.name.trim();
        var data = {name: name};
        this.props.onNewRestaurantSubmit(data);
        this.state.name='';
    },
    render: function(){
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
});


var Restaurant = React.createClass({
    getInitialState: function(){
        return {comp: null};
    },
    displayMenu: function(){
        var restaurant = this.props.data;
        if(this.state.comp){
            $.ajax({
                url: "/restaurants/"+restaurant.id+"/menu/JSON",
                dataType:'json',
                cache: false,
                success: function(data){
                    this.state.comp.setState({data: data.MenuItems});
                    console.log("Refreshed menu.");
                }.bind(this),
                error: function(xhr, status, err){
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        } else {
            this.state.comp = ReactDOM.render(
                <Menu url={"/restaurants/"+restaurant.id+"/menu/JSON"} restaurant={restaurant} pollInterval={2000}/>,
                document.getElementById('centercolumn')
            );
            console.log("Rendering menu.");
        }

    },
    render: function(){
        var restaurant = this.props.data;
        return(
                <li>
                    <a key={restaurant.id}
                    onClick={this.displayMenu}>
                        {restaurant.name}
                    </a>
                    <button className="editItemSmallButton"
                        onClick={this.props.deleteRestaurant}
                        data-key={restaurant.id}
                        data-index={this.props.index}>edit
                    </button>
                    <button className="deleteItemSmallButton"
                        onClick={this.props.deleteRestaurant}
                        data-key={restaurant.id}
                        data-index={this.props.index}>delete
                    </button>
                </li>
        );

    }
});


var RestaurantList = React.createClass({
  getInitialState: function(){
    return{data: []};
  },
  componentDidMount: function(){
      $.ajax({
        url: this.props.url,
        dataType:'json',
        cache: false,
        success: function(data){
            this.setState({data: data.restaurants});
        }.bind(this),
        error: function(xhr, status, err){
            console.error(this.props.url, status, err.toString());
        }.bind(this)
      });

  },
  handleNewRestaurantSubmit: function(data){
        var restaurants = this.state.data;
        var endpoint = "restaurants/new"
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: data,
            success: function(data){
                this.setState({data: data.restaurants});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });

  },
  handleDeleteRestaurant: function(e){
        var key = parseInt(e.target.attributes.getNamedItem('data-key').value,10);
        var index = parseInt(e.target.attributes.getNamedItem('data-index').value,10);
        console.log("Erased restaurant with key %d and index %d",key,index);
        this.setState({data: this.state.data.splice(index,1)});
        var restaurant_id = key;
        var endpoint = "/restaurants/"+restaurant_id+"/delete";
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: key,
            success: function(data){
                this.setState({data: data.restaurants});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });
  },
  render: function() {
        var restaurantNodes = this.state.data.map(function(restaurant,index) {
          return (
            <Restaurant key={restaurant.id}
                index={index}
                data={restaurant}
                deleteRestaurant={this.handleDeleteRestaurant}/>
          );
        }.bind(this));
        return (
          <ul className="mainnav">
            {restaurantNodes}
            <NewRestaurantForm onNewRestaurantSubmit={this.handleNewRestaurantSubmit}/>
          </ul>
        );
    }
});


var EnclosingApp = React.createClass({
    getInitialState: function(){
      return{data: []};
    },
    render: function(){
        return(
            <div>
            <div id="leftcolumn">
                <div><RestaurantList url={"/restaurants/JSON"}/>
                </div>
            </div>
            <div id="centercolumn">
            </div>
            <div id="rightcolumn">
            </div>
            <div id="footer">&copy; Copyright with...</div>
            </div>
        );
    }
});


ReactDOM.render(
    <EnclosingApp/>,
    document.getElementById('mainbox')
);