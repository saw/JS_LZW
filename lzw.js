     
        var dictionary = function(){
            
            var result = {};
            for (var i=0; i < 256; i++) {
                var ch = String.fromCharCode(i);
                result[ch] = i;
            };
            return result;            
        };
        
        
        var dic = false;
        function getDic(){
            
            return dictionary();
            
        }
        
        function encode(str){
          var index = 256;    
          var dictionary = getDic();
          var outStr = [];
          var s = '';
          
          var len = str.length;
          s = str[0];
          for(var i=1; i < len; i++){
              var c = str[i];
              if(dictionary[s+c]){
                  s = s+c;
              }else{
                  //console.log(ch + 'sec');
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
        };
        
        function tTable(){
            var result = {};
            for (var i=0; i < 256; i++) {
                var ch = String.fromCharCode(i);
                result[i] = ch;
            };
            return result;
        }
        
  
        function decode(str){
            
            var table = tTable(),
            buffer = '',
            outStr = [];
           
           // outStr.push(str[0]);
            var first_code = str[0].charCodeAt(0);
            var len = str.length;
            var counter = 255;
            var character = '';
            for (var i=0; i < len; i++) {
                var next_code = str[i].charCodeAt(0);
                
                if(!table[next_code]){
                    buffer = table[first_code];
                    buffer = buffer + character;
                }else{
                    buffer = table[next_code];
 
                }
                
                outStr.push(buffer);
                character = buffer[0];
                table[++counter] = table[first_code] +
                                   character;

                first_code = next_code;
            
                
            };
            
            return outStr.join('');
 
        }
        
        
        function size(str){

            return encodeURIComponent(str).replace(/%../g, 'x').length;
        }