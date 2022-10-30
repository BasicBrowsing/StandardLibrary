
import { toAscii } from '../../Encoding/Punycode.js'



class FormatError extends Error {
    
    constructor ( ...args ){
        super( ...args );
    }
}


const invalidLabel = /[^a-z0-9-]/i;


/**
 *  @brief Throw an error if the format of
 *         the hostname label is incorrect.
 *
 *  @returns the length of the valid label.
 */

function validateLabel ( label ){
    
    const { length } = label;
    
    if(length < 1)
        throw new FormatError(`Hostname labels must be at least 1 char long.`)
    
    if(length > 63)
        throw new FormatError(`Hostname labels can only contain up to 63 chars.`)
        
    if(invalidLabel.test(label))
        throw new FormatError(`Hostname labels can only contain a-Z 0-9 and -`)
    
    if(label.startsWith('-'))
        throw new FormatError(`Hostname labels cannot start with a -`)
        
    if(label.endsWith('-'))
        throw new FormatError(`Hostname labels cannot end with a -`)
        
    return length;
}


/**
 *  @brief Throw an error if the format 
 *         of the hostname is incorrect.
 *
 *  @returns the ( encoded ) labels 
 *           of the valid hostname.
 */

export function parseString ( hostname ){
    
    const labels = hostname
        .split('.');
        
    if(labels.length < 2)
        throw new FormatError(`Hostnames must contain a domain name.`)

    
    const parts = labels
        .map(toAscii);
    
    
    let total = 0;
    
    for ( const part of parts )
        total += validateLabel(part);
    
    if(total > 253)
        throw new FormatError(`Hostnames can only contain up to 253 chars.`)
    
    
    return { labels , parts }
}