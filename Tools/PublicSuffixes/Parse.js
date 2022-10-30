
import * as Paths from './Paths.js'
import { toAscii } from '../../Source/Encoding/Punycode.js'


const 
    { readTextFile , writeTextFile } = Deno ,
    { stringify } = JSON ;


export default async function parse (){
    
    const text = await readTextFile(Paths.list);

    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .filter((line) => ! line.startsWith('//'));
    
    const tree = { nodes : {} };
    
    for ( let line of lines ){
        
        let parent = tree;
        
        let exception;
        
        if(line.startsWith('!')){
            line = line.substring(1);
            exception = true;
        }
        
        const labels = line
            .split('.')
            .map(toAscii);
        
        exception &&= labels.shift();
        
        labels.reverse();
        
        for ( const label of labels )
            if(label === '*'){
                parent.exceptions ??= [];
                break
            } else {
                const nodes = parent.nodes ??= {};
                nodes[label] ??= {};
                parent = nodes[label];
            }
        
        if(exception){
            parent.exceptions ??= [];
            parent.exceptions.push(exception);
        }
    }
    
    const js = [ 
        '' , '' ,
        `export default ${ stringify(tree,null,4) }` ,
        '' , ''
    ]
        
    await writeTextFile(Paths.parsed,js.join('\n'));
}