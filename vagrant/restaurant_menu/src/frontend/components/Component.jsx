import React from 'react'

export default class Component extends React.Component {
    constructor(props, shouldAutoBind=true) {
        super(props)

        if (shouldAutoBind) {
            this.autoBind()
        }
    }

    bindMethods(methods) {
        methods.forEach(method => {
            this[method] = this[method].bind(this)
        })
    }

    autoBind() {
        this.bindMethods(Object.getOwnPropertyNames(this.constructor.prototype).filter(prop => (typeof this[prop] === 'function') && (!Component.ignoreAutoBindFunctions.includes(prop))))
    }
}
Component.ignoreAutoBindFunctions = [
    'constructor',
    'render',
    'componentWillMount',
    'componentDidMount',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
]