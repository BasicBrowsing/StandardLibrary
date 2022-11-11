
const { round , max , min } = Math;

const expandRange = ( factor ) =>
    factor * 255;
    
const limitRange = ( channel ) =>
    max(0,min(255,channel));


/**
 *  Adapted from https://gist.github.com/mjackson/5311256
 */

function hueToRGB ( p , q , t ){
    
    if(t < 0)
        t += +1;
    
    if(t > 1)
        t += -1;
    
    switch ( true ){
    case t < 1 / 6 :
        return p + ( q - p ) * 6 * t
    case t < 1 / 2 :
        return q
    case t < 2 / 3 :
        return p + ( q - p ) * 6 * ( 2 / 3 - t )
    default :
        return p
    }
}


function parseHSL ( hue , saturation , lightness ){
    
    if(saturation == 0)
        return Array(3)
            .fill(lightness);
            
    const q = (lightness < 0.5)
        ? lightness * ( 1 + saturation )
        : lightness + 1 - lightness * saturation ;
        
    const p = 2 * lightness - q;
    
    return [
        hueToRGB(p,q,hue + 1 / 3) ,
        hueToRGB(p,q,hue) ,
        hueToRGB(p,q,hue - 1 / 3)
    ]
}


export function fromHLS ( ...args ){
    return parseHSL( ...args )
        .map(expandRange)
        .map(round)
        .map(limitRange);
}
