import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';

export default class Sidebar extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }


    componentDidMount(){

    }

    render(){
        return(
            <div className="ui left vertical menu">
                <a className="active item">
                    Item
                    <div className="ui blue pointing left label">1</div>
                </a>
                <a className="blue item">
                    Item
                    <div className="ui blue pointing left label">1</div>
                </a>
            </div>
        );
    }
}