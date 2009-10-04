(function(){
    
    var STARTPOINT = 256;
    
    //create "saw" global if not there
    if(window.saw === undefined){
        window.saw = {};
    }
    /**
     * Returns a pre-popuated dictionary to begin encoding
     * @private
     * @method getDic
     * @return {Object} result a hash table with ascii letters as keys
     */
    function getDic(){
        var result = {};
        for (var i=0; i < STARTPOINT; i++) {
            var ch = String.fromCharCode(i);
            result[ch] = i;
        };
        return result;
    }
    
    /**
     * Prepopulates translation table
     * @private
     * @method tTable
     * @return {Object} translation table (hash table)
     */
    function tTable(){
        var result = {};
        for (var i=0; i < STARTPOINT; i++) {
            var ch = String.fromCharCode(i);
            result[i] = ch;
        };
        return result;
    }
    
    
    //Define the object and public methods
    var LZW = {
        
        /**
         * Encodes the string as an LZW compressed binary stream...except
         * because we can't really use binary in javascript we are using the unicode
         * character specified by the decimal code output by the algorithm in each place
         *
         * @method encode
         * @static
         * @param {String} str The string to encode
         * @return {String} str The encoded string
         */ 
        encode:function(str){
            var index = STARTPOINT, //start at 256, the first 255 are the ascii set
            
            //initialize the dictionary
            dictionary = getDic(),
            //arr to hold output string
            outStr = [],
            
            //this will be the buffer
            s = '';

            var len = str.length, //for performance
            s = str[0]; //lets start
            
            for(var i=1; i < len; i++){
                var c = str[i];
                
                if(dictionary[s+c]){ //already in the dictionary
                    s = s+c;
                }else{ //need to add it to the dictionary
                    var code = ++index;
                    
                    outStr.push(String.fromCharCode(dictionary[s]));
                    dictionary[s+c] = code;
                    s = c;
                }
            }
            for(var c in s ){
                outStr.push(s[c]);
            }
            

        
            return outStr.join('');
        },
        
        decode:function(str){
            
            //init translation table
             var table = tTable(),
             
             //buffer will store the string we are working on
             buffer = '',
             
             //store the characters in an array as they are added
             outStr = [],
             
             //init first_code
             first_code = str[0].charCodeAt(0),
             
             //get string length for loop
             len = str.length,
             
             //counter so we know where to start after the base table
             counter = STARTPOINT-1,
             
             //this will be handy for the case where next_code does not exist in the table
             character = '';
             
             var decodearr= [];
             //main decode loop
             for (var i=0; i < len; i++) {
                 var next_code = str[i].charCodeAt(0);
                 if(!table[next_code]){ //handles the exception case
                     buffer = table[first_code];
                     buffer = buffer + character;
                 }else{
                     //add decoded char to buffer
                     buffer = table[next_code];
                 }
                 
                 //add buffer to output
                 outStr.push(buffer);
                 
                 
                 character = buffer[0];
                 //add new substring to table
                 table[++counter] = table[first_code] +
                                    character;
                                    
                 //time for the next char
                 first_code = next_code;
             };
             
             return outStr.join('');
        },
        
        /**
         * Utitilty method that returns the size of a unicode string in bytes
         * @method strSize
         * @param {String} str The string to evaluate
         * @return {Number} num the length of the string in bytes
         */
        strSize:function(str){

            return encodeURIComponent(str).replace(/%../g, 'x').length;
        }
        
    };
    
    window.saw.lzw = LZW;


}());