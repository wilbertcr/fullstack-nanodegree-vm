//Menu items can delete themselves by calling a
//function(deleteMenuItem) in their parent(Menu)
//and sending the key(or item.id) to it.
//Not only will this delete the item from the underlying
//data array, but also from the DB, asynchronously via ajax.
import React from 'react';

export default class MenuItems extends React.Component {
    render() {
        var menuItemNodes = this.props.data.map(function (item, index) {
            return React.createElement(
                "table",
                { key: item.id },
                React.createElement(
                    "tbody",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "name left" },
                            item.name
                        ),
                        React.createElement(
                            "td",
                            { className: "price right" },
                            "$",
                            item.price
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "left description" },
                            item.description
                        ),
                        React.createElement("td", { className: "right" })
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            { className: "left" },
                            React.createElement(
                                "button",
                                { className: "editItemButton",
                                    onClick: this.props.editMenuItem,
                                    "data-key": item.id,
                                    "data-index": index },
                                "edit"
                            )
                        ),
                        React.createElement(
                            "td",
                            { className: "right" },
                            React.createElement(
                                "button",
                                { className: "deleteItemButton",
                                    onClick: this.props.deleteMenuItem,
                                    "data-key": item.id,
                                    "data-index": index },
                                "delete"
                            )
                        )
                    )
                )
            );
        }.bind(this));
        return React.createElement(
            "div",
            { className: "menuItems" },
            menuItemNodes
        );
    }
}

//# sourceMappingURL=MenuItems-compiled.js.map