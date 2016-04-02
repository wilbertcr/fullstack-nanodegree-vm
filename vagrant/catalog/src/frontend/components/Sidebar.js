import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Category from './Category';

export default class Sidebar extends Component {

    constructor(props){
        super(props);
    }

    addCategory(data){
        this.props.addCategory(data);
    }

    deleteCategory(id){
        this.props.deleteCategory(id);
    }

    editCategory(category){
        this.props.editCategory(category);
    }

    displayCategory(category){
        this.props.displayCategory(category);
    }    

    render(){

        return(
            <div className="ui left vertical menu">
                {this.props.categories.map(
                    function(category,index){
                        return <Category key={category.id}
                                         index={index}
                                         category={category}
                                         login_status={this.props.loginStatus}
                                         deleteCategory={this.deleteCategory}
                                         editCategory={this.editCategory}
                                         displayCategory={this.displayCategory}/>;
                    }.bind(this)
                )}
            </div>
        );
    }
}