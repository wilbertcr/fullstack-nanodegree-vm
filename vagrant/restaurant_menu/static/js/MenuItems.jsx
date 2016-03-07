//Menu items can delete themselves by calling a
//function(deleteMenuItem) in their parent(Menu)
//and sending the key(or item.id) to it.
//Not only will this delete the item from the underlying
//data array, but also from the DB, asynchronously via ajax.
import React from 'react';

export default class MenuItems extends React.Component{
    render() {
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
        )
    }
}