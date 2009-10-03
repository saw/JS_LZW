(function(){
        
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
        
        var prefix_code = [];
        var append_character = [];
        function decode(str){
            
            var next_code,
                new_code,
                old_code,
                character,
                counter,
                string,
                out_str;
            next_code = 256;
            counter = 0;
            //old_code = str[0];
            character = old_code;
            out_str = old_code;
            for(var c in str){
                new_code = str[c];
                string = decode_string(new_code);
                out_str+= string;
                
                if(next_code < 100000){
                    prefix_code[next_code] = old_code;
                    append_character[next_code] = character;
                    next_code++;
                }
                old_code = new_code;
            }
            
            return out_str;
        }
        
        function decode_string(str){
            var i = 0;
            var buffer = '';
            var code = str.charCodeAt(0);
            while(code > 255){
                buffer += append_character[code];
                code = prefix_code[code];
            }
            
            buffer = code;
            return buffer;
        }
        
        function size(str){

            return encodeURIComponent(str).replace(/%../g, 'x').length;
        }