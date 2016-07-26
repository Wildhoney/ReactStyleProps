import React, { Component, PropTypes, cloneElement } from 'react';
import { decamelize } from 'humps';

/**
 * @author Adam Timberlake
 * @class Interpose
 * @extends Component
 */
export default class Interpose extends Component {

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
        map: PropTypes.object.isRequired,
        children: PropTypes.node.isRequired,
        tagName: PropTypes.string
    };

    /**
     * @constant defaultProps
     * @type {Object}
     */
    static defaultProps = {
        tagName: 'span'
    };

    /**
     * @constant attributes
     * @type {Array}
     */
    static attributes = [
        { attr: 'id', symbol: '#' },
        { attr: 'className', symbol: '.' }
    ];

    /**
     * @method componentWillMount
     * @return {void}
     */
    componentWillMount() {
        this.styleElement = document.createElement('style');
    }

    /**
     * @method transform
     * @param {Object} props
     * @return {String}
     */
    transform(props) {

        const { children } = this.props;

        // Determine the selector name based on the node's attributes.
        const selector = Interpose.attributes.reduce((accumulator, model) => {
            const hasAttr = children.props[model.attr];
            return hasAttr ? `${accumulator}${model.symbol}${children.props[model.attr]}` : accumulator;
        }, children.type);

        return `
            ${selector} { ${Object.keys(props).map(key => {
                const name = decamelize(key, { separator: '-' });
                return `--${name}: ${props[key]}; `;
            }).join('')}}
        `.trim();

    }

    /**
     * @method render
     * @return {XML}
     */
    render() {

        return cloneElement(this.props.children, { ref: childElement => {

            if (childElement) {

                this.styleElement.setAttribute('type', 'text/css');
                this.styleElement.innerHTML = this.transform(this.props.map);
                childElement.insertBefore(this.styleElement, childElement.childNodes[0]);

            }

        } });

    }
}
