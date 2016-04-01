import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import GoogleAuth2 from './GoogleAuth2'
import Sidebar from './Sidebar'
import ItemsContainer from './ItemsContainer'

export default class CatalogApp extends Component {

    constructor(props){
        super(props);
        this.STATUS = {
            LoggedIn : {value: true, name: "LoggedIn"},
            LoggedOut : {value: false, name: "LoggedOut"}
        }
        this.state = {
            categories: [],
            items: [],
            login_status: this.STATUS.LoggedOut,
            categoryId: 0
        }
    }

    onSessionChange(state){
        console.log("Update in login status received.")
        console.log(state);
        this.setState({...this.state,
            login_status: state.value ? this.STATUS.LoggedIn : this.STATUS.LoggedOut});
    }

    displayCategory(category){
        this.setState({...this.state, items: category.items,categoryId: category.id});
    }

    deleteCategory(id){

    }

    addCategory(data){

    }

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

    loadCategories(){
        $.ajax({
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
                             login_status={this.state.login_status}
                             displayCategory={this.displayCategory}
                             deleteCategory={this.deleteCategory}
                             addCategory={this.addCategory}
                             editCategory={this.editCategory}/>
                </div>
                <div className="left floated left aligned thirteen wide column" style={{marginTop: '55px'}}>
                    <ItemsContainer items={this.state.items}
                                    login_status={this.state.login_status}/>
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

