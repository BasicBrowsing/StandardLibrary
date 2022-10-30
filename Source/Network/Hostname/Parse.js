
import { parseString } from './Format.js'
import Suffixes from '../PublicSuffixes.js'


export function parse ( hostname ){
    
    const { labels , parts } = 
        parseString(hostname);
    
    parts.reverse();
    
    const suffixStack = [];
    let parent = Suffixes;
    
    for ( const label of parts ){
        
        // Exceptions
        
        if('exceptions' in parent)
            if(parent.exceptions.includes(label))
                break
        
        // Subnodes
        
        if('nodes' in parent)
            if(parent.nodes.hasOwnProperty(label)){
                suffixStack.push(label);
                parent = parent.nodes[label];
                continue
            }
            
        // Wildcards
        
        if('exceptions' in parent){
            suffixStack.push(label);
            break
        }

        break
    }
    
    let { length } = suffixStack;
    
    if(length === 0)
        length = 1;
    
    suffixStack.reverse();
    
    const domainIndex = 
        labels.length - length - 1;
    
    const domainName = 
        labels[domainIndex];
    
    const subDomain = labels
        .slice(0,domainIndex)
        .join('.');
        
    const domain = labels
        .slice(-length - 1)
        .join('.');
        
    const suffix = suffixStack
        .join('.');
    
    const info = { domainName , domain , suffix }
    
    if(subDomain.length)
        info.subDomain = subDomain;
    
    return info
}