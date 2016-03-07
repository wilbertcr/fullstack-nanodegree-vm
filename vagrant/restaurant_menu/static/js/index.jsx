import React from 'react';
import ReactDOM from 'react-dom';
import RestaurantList from './RestaurantList';

export default class RestaurantsApp extends React.Component {
    render(){
        return(
            <div>
                <div id="leftcolumn">
                    <div><RestaurantList url={"/restaurants/JSON"}/>
                    </div>
                </div>
                <div id="centercolumn">
                </div>
                <div id="rightcolumn">
                </div>
                <div id="footer">&copy; Copyright with...</div>
            </div>
        );
    }
}


ReactDOM.render(
    <RestaurantsApp/>,
    document.getElementById("mainbox")
);
