import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Category from './Category';

/**
 * Sidebar container component.
 * @class Sidebar
 * */
export default class Sidebar extends Component {
    /**
     * @constructs Sidebar
     * @param {Object} props - Object passed down to us from our parent..
     * */
    constructor(props){
        super(props);
    }

    addCategory(category){
        this.props.addCategory(category);
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
                                         loginStatus={this.props.loginStatus}
                                         deleteCategory={this.deleteCategory}
                                         editCategory={this.props.editCategory}
                                         displayCategory={this.displayCategory}/>;
                    }.bind(this)
                )}
            </div>
        );
    }
}