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
            categoryId: 0,
            nonce: $('#root').data("state")
        };
    }

    updateNonce(nonce){
        this.setState({...this.state, nonce: nonce});
    }

    /**
     * Listener triggered by GoogleAuth2 when a change in login state occurs.
     * @param {STATUS} state - The current login status.
     * */
    onSessionChange(state){
        console.log("Update in login status received.");
        console.log(state);
        this.setState({...this.state,
            loginStatus: state.value ? this.STATUS.LoggedIn : this.STATUS.LoggedOut});
    }

    /**
     * Sets state such that the objects in the category passed in are displayed.
     * @param {integer} id - category id of the category we want to display.
     * */
    displayCategory(id){
        var index;
        /**
         * We need the category's index in the categories array.
         * */
        for(let i=0;i<this.state.categories.length;i++){
            if(id===this.state.categories[i].id){
                index = i;
                break;
            }
        }
        var category = this.state.categories[index];
        var items = category.items;
        this.setState({...this.state, items: items,categoryId: id});
    }

    /**
     * Appends the category to the list of categories.
     * @param {string} name - name of the category we wish to append.
     * */
    addCategory(name){
        console.log("Add category: ");
        console.log(name);
        var newCategory = {
            id: 0,
            name: name,
            picture: "",
            items: []
        };
        var categories = this.state.categories;
        var newCategories = [...categories,newCategory];
        var index = newCategories.length-1;
        var prevState = {...this.state};
        var nextState = {...this.state,categories: newCategories};
        this.setState(nextState);
        /**
         *We're sending the new category to the backend for processing.
         * */
        var endpoint = "/categories/new?state=";
        apiCall({
            url: endpoint+this.state.nonce,
            dataType: 'json',
            type: 'POST',
            data: newCategory,
            success: function(data) {
                /**
                 * This is the state we wish to move to, but we need confirmation that
                 * it is consistent with the DB before we can set this in stone.
                 * */
                newCategory.id = data.category.id;
                var nextState = {
                    ...this.state,
                    categories : [
                        ...this.state.categories.slice(0,index),
                        newCategory
                    ]
                };
                /**
                 * We're going to be optimistic, and change the state before contating the
                 * backend.
                 * */
                this.setState(nextState);
            }.bind(this),
            error: function(xhr,status,err){
                this.setState(prevState);
                console.error(endpoint,status,err.toString());
            }.bind(this)
        },this);

    }

    /**
     * Updates category to match the one passed in.
     * @param {Object} newCategory - category we wish to edit.
     * */
    editCategory(newCategory){
        console.log("Editing.");
        var index;
        /**
         * We need the category's index in the categories array.
         * */
        for(let i=0;i<this.state.categories.length;i++){
            if(newCategory.id===this.state.categories[i].id){
                index = i;
                break;
            }
        }
        /**
         * Let's keep the previous state, in case something goes wrong.
         * */
        var prevState = {...this.state};
        /**
         * This is the state we wish to move to, but we need confirmation that
         * it is consistent with the DB before we can set this in stone.
         * */
        var nextState = {
            ...this.state,
            categories : [
                ...this.state.categories.slice(0,index),
                newCategory,
                ...this.state.categories.slice(index+1)
            ]
        };
        /**
         * We're going to be optimistic, and change the state before contating the
         * backend.
         * */
        this.setState(nextState);

        /**
         *We're sending the edited category to the backend for processing.
         * */
        var endpoint = "/categories/edit/"+newCategory.id+"?state=";
        apiCall({
            url: endpoint+this.state.nonce,
            dataType: 'json',
            type: 'POST',
            data: newCategory,
            //If things go wrong, we just go back to the previous state :)
            error: function(xhr,status,err){
                this.setState(prevState);
                console.error(endpoint,status,err.toString());
            }.bind(this)
        },this);
    }


    /**
     * deletes category with id equal to the one passed in.
     * @param {integer} id - categoryId of the category we wish to delete.
     * */
    deleteCategory(id){
        var index;
        /**
         * We need the category's index in the categories array.
         * */
        for(let i=0;i<this.state.categories.length;i++){
            if(id===this.state.categories[i].id){
                index = i;
                break;
            }
        }
        /**
         * Let's keep the previous state, in case something goes wrong.
         * */
        var prevState = {...this.state};
        /**
         * This is the state we wish to move to, but we need confirmation that
         * it is consistent with the DB before we can set this in stone.
         * */
        var nextState = {
            ...this.state,
            categories : [
                ...this.state.categories.slice(0,index),
                ...this.state.categories.slice(index+1)
            ]
        };
        /**
         * Unless this category's items are being displayed right now, if that's the case
         * then we want them to disappear since their parent category is being deleted.
         * */
        if(id===this.state.categoryId){
            nextState = {
                ...nextState,
                items:[],
                categoryId:0
            }
        }
        /**
         * We're going to be optimistic, and change the state before contating the
         * backend.
         * */
        this.setState(nextState);
        /**
         *We're sending the request to the backend..
         * */
        var endpoint = "/categories/delete/"+id+"?state=";
        apiCall({
            url: endpoint+this.state.nonce,
            dataType: 'json',
            type: 'DELETE',
            error: function(xhr,status,err){
                this.setState(prevState);
                console.error(endpoint,status,err.toString());
            }.bind(this)
        },this);

    }




    /**
     * Loads categories from server.
     * */
    loadCategories(){
        apiCall({
            url: '/categories/json?state='+this.state.nonce,
            dataType:'json',
            cache: false,
            success: function(data){
                this.setState({categories: data.categories});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.state.restaurantListURL, status, err.toString());
            }.bind(this)
        },this);
    }

    componentDidMount(){
        this.loadCategories();
    }

    addItem(Item){
        console.log("AddItem");
        console.log(Item);
    }

    editItem(item){
        var catIndex;
        var itemIndex;
        for(let i=0;i<this.state.categories.length;i++){
            if(item.categoryId===this.state.categories[i].id){
                catIndex=i;
                var prevCategory = this.state.categories[i];
                for(let j=0;j<prevCategory.items.length;j++){
                    if(item.id===prevCategory.items[j].id){
                        itemIndex = j;
                    }
                }
            }
        }
        var prevCategories = this.state.categories;
        var nextCategories = [...this.state.categories];
        var prevItem =  nextCategories[catIndex].items[itemIndex];
        var nextItem = {...nextCategories[catIndex].items[itemIndex]};
        nextItem.picture = item.picture;
        nextItem.name = item.name;
        nextItem.description = item.description;
        nextItem.price = item.price;
        nextItem.file = item.file;

        /**
         * Does the item contains a new picture? Or just changes
         * to the text?
         * */
        if(item.newPicture){
            /**
             * If the item does contain a new picture.
             * */
            //We're gong to extract the file.
            let file = nextItem.file;
            console.log(file);
            var fd = new FormData();
            fd.append("picture_file", file);
            var filePath = "/static/images/"+file.name;
            var url1 = filePath+"?state=";
            //File is in the server now, so we can update the picture.
            nextCategories[catIndex].items[itemIndex] = nextItem;
            this.setState({
                categories: nextCategories,
                items: nextCategories[catIndex].items}
            );
            apiCall({
                url: url1+this.state.nonce,
                type: 'POST',
                data: fd,
                contentType: false,
                processData: false,
                success: function(data){
                    console.log(data);
                }.bind(this),
                error: function (xhr, status, err) {
                    //If something goes wrong.
                    // Let's go back to the previous state.
                    this.setState({
                        categories: prevCategories,
                        items: prevCategories[catIndex].items}
                    );
                    //And communicate the error.
                    //Something production ready would do
                    //something to the UI to make the user aware of this.
                    console.error("Error uploading picture.");
                    console.error(xhr, status, err.toString());
                }.bind(this)
            },this).then(function(){
                nextItem.file = "";
                nextCategories[catIndex].items[itemIndex] = nextItem;
                this.setState({
                    categories: nextCategories,
                    items: nextCategories[catIndex].items}
                );
                var url2 = "/items/edit/"+item.id+"?state=";
                console.log(url2);
                console.log(nextItem);
                apiCall({
                    url: url2+this.state.nonce,
                    dataType: 'json',
                    type: 'POST',
                    data: nextItem,
                    error: function(xhr,status,err){
                        //If things go bad, we go back to
                        //the previous state.
                        console.log("going back to previous state.");
                        console.log(prevItem);
                        prevCategories[catIndex].items[itemIndex] = prevItem;
                        this.setState({...this.state,
                            categories: prevCategories,
                            items:prevCategories[catIndex].items}
                        );
                    }.bind(this)
                },this);
            }.bind(this));
        } else {
            //If it is just changes to the text
            //Let's be optimistic and update the item.
            nextCategories[catIndex].items[itemIndex] = nextItem;
            this.setState({
                categories: nextCategories,
                items: nextCategories[catIndex].items}
            );
            var url1 = "/items/edit/"+item.id+"?state=";
            apiCall({
                url: url2+this.state.nonce,
                dataType: 'json',
                type: 'POST',
                data: item,
                error: function(xhr,status,err){
                    //If things go bad, we go back to
                    //the previous state.
                    console.log("going back to previous state.");
                    console.log(prevItem);
                    prevCategories[catIndex].items[itemIndex] = prevItem;
                    this.setState({...this.state,
                        categories: prevCategories,
                        items:prevCategories[catIndex].items}
                    );
                }.bind(this)
            },this);
        }
    }

    deleteItem(id){
        console.log("deleteItem");
        console.log(id);
    }

    render(){
        return(
            <div>
                <GoogleAuth2 onSessionChange={this.onSessionChange}
                             nonce={this.state.nonce}
                             updateNonce={this.updateNonce}/>
                <div className="root_container ui stackable padded grid"
                     style={this.state.loginStatus.value ? {paddingTop: '54px'}: {} }>
                    <div className="row">
                        <div className="left floated left two wide column">
                            <Sidebar categories={this.state.categories}
                                     loginStatus={this.state.loginStatus}
                                     displayCategory={this.displayCategory}
                                     deleteCategory={this.deleteCategory}
                                     addCategory={this.addCategory}
                                     editCategory={this.editCategory}/>
                        </div>
                        <div className="left floated left aligned thirteen wide column">
                            <ItemsContainer items={this.state.items}
                                            loginStatus={this.state.loginStatus}
                                            categoryId={this.state.categoryId}
                                            addItem={this.addItem}
                                            editItem={this.editItem}
                                            deleteItem={this.deleteItem}/>
                        </div>
                    </div>
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
