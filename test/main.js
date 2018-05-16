'use strict';
import * as templates from '../es6templates.js';

var main = document.querySelector('main');
var view;
var target;

var dataset = [
    {
        id: '001',
        link: './test1',
        title: 'Test item',
        symbol: '$',
        price: '100'
    },
    {
        id: '002',
        link: './test2',
        title: 'Test item2',
        symbol: '$',
        price: '1002'
    },
    {
        id: '003',
        link: './test3',
        title: 'Test item3',
        symbol: '$',
        price: '1003'
    },
    {
        id: '004',
        link: './test4',
        title: 'Test item4',
        symbol: '$',
        price: '1004'
    }
];

//Defining middlewares
templates.middlewares['toEur'] = function(raw){
    return raw.replace('item.symbol', `'EUR'`)
};

//fetching tpl
templates.include('./tpl-ul-test.html', dataset).then(tpl => main.innerHTML += tpl);
//using middleware
templates.include('./tpl-ul-test.html', dataset, 'toEur').then(tpl => main.innerHTML += tpl);