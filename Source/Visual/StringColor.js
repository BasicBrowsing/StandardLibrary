
import { fromHLS } from '../Encoding/RGB.js'


const { subtle } = crypto;


async function hueFrom ( string ){
    
    const encoder = new TextEncoder;
    
    const bytes = encoder
        .encode(string);
        
    const hash = await 
        subtle.digest('SHA-256',bytes);
        
    const hue = [ ... new Uint8Array(hash) ]
        .slice(0,2)
        .reduce((a,b) => a ^ b);
    
    return (hue % 360) / 360;
}

async function colorFrom ( string , saturation = 0.4 , lightness = 0.4 ){
    
    const hue = await hueFrom(string);
    
    return fromHLS(hue,saturation,lightness);
}


export async function rgbFrom ( ...args ){
    
    const [ r , g , b ] = await colorFrom( ...args );

    return { r , g , b }
}


export async function hashFrom ( ...args ){
    
    const digits = await colorFrom( ...args );
        
    const hex = digits
        .map((digit) => digit
            .toString(16)
            .padStart(2,'0'))
        .join('');
        
    return `#${ hex }`
}
