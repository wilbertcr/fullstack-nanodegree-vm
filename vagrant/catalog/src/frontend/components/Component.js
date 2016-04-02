import React from 'react'

/**
 * Component autobinds(bind(this)) to all methods created by whoever extends this class.
 * @class Component
 * */
export default class Component extends React.Component {

    /**
     * @constructs Component
     * @param {Object} props - Object pass down to us
     * @param {boolean} [shouldAutoBind=] - Whether to autobind or not.
     * */
    constructor(props, shouldAutoBind=true) {
        super(props)

        if (shouldAutoBind) {
            this.autoBind()
        }
    }
    /**
     * Binds "this" to all methods passed in.
     * @param {Object[]} methods - Array of methods to which "this" will be bound.
     * */
    bindMethods(methods) {
        methods.forEach(method => {
            this[method] = this[method].bind(this)
        })
    }

    /**
     * Gets all the non-default methods and passes them down to {@link bindMethods}
     * */
    autoBind() {
        this.bindMethods(Object.getOwnPropertyNames(this.constructor.prototype).filter(prop => (typeof this[prop] === 'function') && (!Component.ignoreAutoBindFunctions.includes(prop))))
    }
}

/**
 * We will ignore the default methods as they are already autobound.
 * */
Component.ignoreAutoBindFunctions = [
    'constructor',
    'render',
    'componentWillMount',
    'componentDidMount',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount'
]