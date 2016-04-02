import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import GoogleAuth2 from './GoogleAuth2'
import Sidebar from './Sidebar'
import ItemsContainer from './ItemsContainer'
import apiCall from './apiCall'

/**
 * Main container.
 * @class CatalogApp
 * */
export default class CatalogApp extends Component {
    /**
     * @constructs CatalogApp
     * @param {Object} props - Object passed down to us from our parent..
     * */
    constructor(props){
        super(props);
        /**
         *Represents login status
         * @type {Object}
         * @property {{value: true, name: "LoggedIn"}} STATUS.LoggedIn - User is logged in.
         * @property {{value: false, name: "LoggedOut"}} STATUS.LoggedOut - User is logged out.
         * */
        this.STATUS = {
            LoggedIn : {value: true, name: "LoggedIn"},
            LoggedOut : {value: false, name: "LoggedOut"}
        };
        /**
         *Represents the current state.
         * @type {Object}
         * @property {categories[]} state.categories - The categories available.
         * @property {items[]} state.items - The items currently in display..
         * @property {STATUS} state.login_status - The current login status.
         * @property {integer} state.categoryId - The categoryId for which items are in display.
         * */
        this.state = {
            categories: [],
            items: [],
            loginStatus: this.STATUS.LoggedOut,
            categoryId: 0
        };
    }

    /**
     * Listener triggered by GoogleAuth2 when a change in login state occurs.
     * @param {STATUS} state - The current login status.
     * */
    onSessionChange(state){
        console.log("Update in login status received.")
        console.log(state);
        this.setState({...this.state,
            loginStatus: state.value ? this.STATUS.LoggedIn : this.STATUS.LoggedOut});
    }

    /**
     * Sets state such that the objects in the category passed in are displayed.
     * @param {Object} category - category we want to display.
     * */
    displayCategory(category){
        this.setState({...this.state, items: category.items,categoryId: category.id});
    }

    /**
     * deletes category with id equal to the one passed in.
     * @param {integer} id - categoryId of the category we wish to delete.
     * */
    deleteCategory(id){

    }

    /**
     * Appends the category to the list of categories.
     * @param {Object} category - category we wish to append.
     * */
    addCategory(category){

    }

    /**
     * Updates category to match the one passed in.
     * @param {Object} category - category we wish to edit.
     * */
    editCategory(category){
        console.log("Editing.");
        var index;
        for(let i=0;i<this.state.categories.length;i++){
            if(category.id===this.state.categories[i].id){
                index = i;
                break;
            }
        }
        var newCategory = category;
        this.setState({data: {...this.state.categories.slice(0,index),
                              newCategory,
                              ...this.state.categories.slice(index+1)}
        });

        /**
         * @todo Implement backend functionality.
         * */
        /*
        var endpoint = "/categories/edit/"+category.id;
        $.ajax({
            url: endpoint,
            dataType: 'json',
            type: 'POST',
            data: category,
            success: function(data){
                this.setState({categories: data.categories});
            }.bind(this),
            error: function(xhr,status,err){
                console.error(endpoint,status,err.toString());
            }.bind(this)
        });
        */
    }

    /**
     * Loads categories from server.
     * */
    loadCategories(){
        apiCall({
            url: '/categories/json',
            dataType:'json',
            cache: false,
            success: function(data){
                this.setState({categories: data.categories});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.state.restaurantListURL, status, err.toString());
            }.bind(this)
        });
    }

    componentDidMount(){
        this.loadCategories();
    }

    render(){
        return(
            <div className="root_container ui grid">
                <div className="sixteen column inverted row">
                    <GoogleAuth2 onSessionChange={this.onSessionChange}/>
                </div>
                <div className="left floated three wide column" style={{marginTop: '50px'}}>
                    <Sidebar categories={this.state.categories}
                             loginStatus={this.state.loginStatus}
                             displayCategory={this.displayCategory}
                             deleteCategory={this.deleteCategory}
                             addCategory={this.addCategory}
                             editCategory={this.editCategory}/>
                </div>
                <div className="left floated left aligned thirteen wide column" style={{marginTop: '55px'}}>
                    <ItemsContainer items={this.state.items}
                                    loginStatus={this.state.loginStatus}/>
                </div>
            </div>
        );
    }
}

$( document ).ready(function() {
    ReactDOM.render(
        <CatalogApp/>,
        document.getElementById("root")
    );
});

