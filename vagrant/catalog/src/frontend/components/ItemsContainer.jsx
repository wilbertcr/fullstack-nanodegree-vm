import React from 'react';
import ReactDOM from 'react-dom';
import Component from './Component';
import Item from './Item';

export default class ItemsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMount() {

    }

    render() {
        return (
            <div className="ui cards container">
                {this.props.items.map(
                    function(item,index){
                        return <Item key={item.id}
                                index={index}
                                item={item}
                                login_status={this.props.login_status}
                                />;
                    }.bind(this)
                )}
            </div>
        );
    }
}