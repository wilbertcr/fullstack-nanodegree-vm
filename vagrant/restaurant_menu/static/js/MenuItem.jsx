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
        this.state = {editing:false};
    }

    editMenuItem(e){
        var key = parseInt(e.target.attributes.getNamedItem('data-key').value,10);
        var index = parseInt(e.target.attributes.getNamedItem('data-index').value,10);
        console.log("Editing menu item withs key %d and index %d",key,index);
        if(!this.state.editing){
            this.setState({editing: true});
        } else {
            this.setState({editing: false});
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

    componentDidMount(){
        this.setState({item: this.props.item})
    }

    render() {
        var line;
        var item = this.props.item;
        if(this.state.editing===true){
            line = <RIEInput
                value={item.name}
                propName="name"
                change={this.handleNameChange}
            />;
        } else {
            line = item.name;
        }
        return (
            <div className="menuItem" key={item.id}>
                <table>
                    <tbody>
                    <tr>
                        <td className="name left">
                            {line}
                        </td>
                        <td className="price right">&#36;{this.props.item.price}</td>
                    </tr>

                    <tr>
                        <td className="left description">{this.props.item.description}</td>
                        <td className="right"></td>
                    </tr>
                    <tr>
                        <td className="left">
                            <button className="editItemButton"
                                    onClick={this.editMenuItem}
                                    data-key={this.props.item.id}
                                    data-index={this.props.index}>edit
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