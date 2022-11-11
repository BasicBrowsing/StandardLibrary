
    
export const byClass = ( name ) =>
    document.getElementsClassName(name);

export const byTag = ( name ) =>
    document.getElementsByTagName(name);

export const byId = ( id ) =>
    document.getElementById(id);


export const queryAll = ( selector ) =>
    document.querySelectorAll( selector );

export const query = ( selector ) =>
    document.querySelector(selector);
    
    
export const create = ( type ) =>
    document.createElement(type);

export const div = () =>
    create('div');

export const img = () =>
    create('img');
