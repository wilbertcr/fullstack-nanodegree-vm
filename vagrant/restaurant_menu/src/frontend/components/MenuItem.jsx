//Menu items can delete themselves by calling a
//function(deleteMenuItem) in their parent(Menu)
//and sending the key(or item.id) to it.
//Not only will this delete the item from the underlying
//data array, but also from the DB, asynchronously via ajax.
import React from 'react';
import Component from './Component';
import { RIEToggle, RIEInput, RIENumber, RIETags } from 'riek';

export default class MenuItem extends Component{
    constructor(props){
        super(props);
        this.state = {editing:false,
                      editButtonState: "Edit"};
    }

    editMenuItem(e){
        if(!this.state.editing){
            this.setState({editing: true,editButtonState: "Done"});
        } else {
            this.setState({editing: false,editButtonState: "Edit"});
        }
    }

    deleteMenuItem(){
        console.log("Menu item:");
        console.log(this.props.item);
        this.props.deleteMenuItem(this.props.item);
    }

    handleNameChange(data){
        this.props.item.name = data.name;
        this.props.editMenuItem(this.props.item);
    }

    handlePriceChange(data){
        this.props.item.price = data.price;
        this.props.editMenuItem(this.props.item);
    }

    handleDescriptionChange(data){
        this.props.item.description = data.description;
        this.props.editMenuItem(this.props.item);
    }


    render() {
        var item = this.props.item;
        var name;
        var price;
        var description;
        if(this.state.editing===true){
            name = <RIEInput
                value={item.name}
                propName="name"
                change={this.handleNameChange}
                className="InLineEdit"
                classEditing="EditingName"
                />;
            price = <RIENumber
                value={item.price}
                propName="price"
                change={this.handlePriceChange}
                className="InLineEdit"
                classEditing="EditingPrice"
            />;
            description = <RIEInput
                value={item.description}
                propName="description"
                change={this.handleDescriptionChange}
                className="InLineEdit"
                classEditing="EditingDescription"
            />;
        } else {
            name = item.name;
            price = item.price;
            description = item.description;
        }
        return (
            <div className="menuItem" key={item.id}>
                <table>
                    <tbody>
                    <tr>
                        <td className="name left">
                            {name}
                        </td>
                        <td className="price right">
                            &#36;{price}
                        </td>
                    </tr>

                    <tr>
                        <td className="left description">
                            {description}
                        </td>
                        <td className="right"></td>
                    </tr>
                    <tr>
                        <td className="left">
                            <button className="editItemButton"
                                    onClick={this.editMenuItem}
                                    data-key={this.props.item.id}
                                    data-index={this.props.index}>
                                {this.state.editButtonState}
                            </button>
                        </td>
                        <td className="right">
                            <button className="deleteItemButton"
                                    onClick={this.deleteMenuItem}>delete
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}