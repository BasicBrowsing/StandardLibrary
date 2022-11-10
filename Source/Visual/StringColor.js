

const { subtle } = crypto;


async function colorFrom ( string ){
    
    const encoder = new TextEncoder;
    
    const bytes = encoder
        .encode(string);
        
    const hash = await 
        subtle.digest('SHA-256',bytes);
        
    return [ ... new Uint8Array(hash) ]
        .slice(0,3);
}


export async function rgbFrom ( string ){
    
    const [ r , g , b ] = await 
        colorFrom(string);
    
    return { r , g , b };
}


export async function hexFrom ( string ){
    
    const digits = await 
        colorFrom(string);
        
    const hex = digits
        .map((digit) => digit
            .toString(16)
            .padStart(2,'0'))
        .join('');
        
    return `0x${ hex }`
}
