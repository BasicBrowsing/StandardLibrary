

const
    regex_sections = /^Mozilla\/5\.0 \((.+?)\) (.+)/i ,
    regex_chrome = /^.+? \(.+?\) (.+?) (.+?)$/i;


const isFirefox = ( browser ) =>
    browser.startsWith('Gecko');

const trim = ( string ) =>
    string.trim();


/**
 *  Crude useragent parsing only used for visualization!
 *  Only parses the most commonly used browser useragents.
 *
 *  Mozilla/5.0 ( <System> ) <Browser>
 *  
 *  Check the following for more information:
 *  https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 */
 
export default function parse ( useragent ){
    
    let [ system , browser ] = useragent
        .match(regex_sections)
        .splice(1,2);

    system = system
        .split(';')
        .map(trim);
    
    if(isFirefox(browser))
        return matchFirefox(system,browser);
        
    return matchChrome(system,browser);
}


/**
 *  Mozilla/5.0 (platform) AppleWebKit/webkitVersion (KHTML, like Gecko) Chrome/chromeVersion Safari/safaiVersion
 *
 *  In relevant / recent browser:
 *  -   webkitVersion = safaiVersion
 */

function matchChrome ( system , browser ){
    
    const [ version , appleWebKit ] = browser
        .match(regex_chrome)
        .splice(1,2)
        .map((string) => string
            .split('/')
            .at(1));
            
    const type = 'Chrome';
    
    return { appleWebKit , version , system , type }
}


/**
 *  Mozilla/5.0 (platform; rv:geckoVersion) Gecko/geckoTrail Firefox/firefoxVersion
 *  
 *  In relevant / recent browser:
 *  -   geckoVersion = firefoxVersion
 *  -   geckoTrail is fixed
 */

function matchFirefox ( system , browser ){
    
    const version = system
        .splice(-1,1)
        .at(0)
        .split(':')
        .at(1);
            
    const type = 'Firefox';
    
    return { version , system , type }
}
