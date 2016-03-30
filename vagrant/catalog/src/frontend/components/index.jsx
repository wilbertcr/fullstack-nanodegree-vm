import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import GoogleAuth2 from './GoogleAuth2'
import Sidebar from './Sidebar'
import ItemsContainer from './ItemsContainer'

export default class CatalogApp extends Component {

    constructor(props){
        super(props);
        this.state = {
            categories: [],
            items: []
        }
    }

    onChange(state){
        console.log(state);
    }

    componentDidMount(){

    }

    render(){
        return(
            <div className="root_container ui grid">
                <div className="sixteen column inverted row">
                    <GoogleAuth2 onChange={this.onChange}/>
                </div>
                <div className="left floated three wide column" style={{marginTop: '50px'}}>
                    <Sidebar/>
                </div>
                <div className="left floated left aligned thirteen wide column" style={{marginTop: '55px'}}>
                    <ItemsContainer/>
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

