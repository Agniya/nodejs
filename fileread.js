/*???????????????
missing-glyph - split по \n
Copyright - data.slice(data.indexOf('Copyright'),data.indexOf('</metadata>'))
*/

//модуль fs
var fs = require("fs");
//модуль sys  для вывода инфо в консоль
var sys = require("sys");
	
var http = require('http');
http.createServer(function (req, res) {
   fs.open("fontello.svg", "r+", 0644, function(err, file_handle) {
    // Читаем 10 килобайт с начала файла, в ascii
    fs.read(file_handle, 10000, null, 'ascii', function(err, data) {
		//SVG - объект
		var svgObj = {};
		
		//copyright
		if(data.match(/Copyright/)){
			var copyright = data.slice(data.indexOf('Copyright'),data.indexOf('</metadata>'));	
		};		
		svgObj['copyright'] = copyright;
			
		var fontFace = {};
		//font-face 
		if(data.match(/font-face/)){
			var fFace = data.substring(data.indexOf('font-face'),data.indexOf('/>'));	
			var arr = fFace.split(/\s/);
			for(var i = 1; i <= arr.length-1; i++){
				var key = arr[i].substring(0,arr[i].indexOf('='));
				var value = arr[i].slice(arr[i].indexOf('=')+1);
				if(key !== ""){
					fontFace[key] = value;
				};
			};					
		};
		//var font = JSON.stringify(fontFace);
		svgObj['font-face'] = fontFace;
		
		//missing-glyph
		var missingGlyphObj = {};
		if(data.match(/missing-glyph/)){
			var missGlyph = data.slice(data.search(/<missing-glyph/)+'missing-glyph'.length+2,data.search(/<glyph/));	
			var arr = missGlyph.split(/\n/);
			for(var i = 0; i <= arr.length-1; i++){
				var key = arr[i].substring(0,arr[i].indexOf('='));
				var value = arr[i].slice(arr[i].indexOf('=')+1,arr[i].indexOf('/>'));
				if(key !== ""){
					missingGlyphObj[key] = value;
				};
			};					
		};
		//var missingGlyph = JSON.stringify(missingGlyphObj);	
		svgObj['missing-glyph'] = missingGlyphObj;
		
		//glyph
		if(data.match(/glyph/)){
			var Glyph = data.slice(data.search(/<glyph/));
			var glyphObj = {};
			var arr = Glyph.split('<glyph');
			for(var i = 0; i<= arr.length-1; i++){
				var innerStr = arr[i];
				if(innerStr !== ""){
					var name = innerStr.match(/glyph-name=\S*\s*/); 
					glyphObj[name] = innerStr;
				}
			};			
		};
		//var GlyphObject = JSON.stringify(glyphObj);	
		svgObj['glyph'] = glyphObj;
		
		var SVGObject = JSON.stringify(svgObj);
		sys.puts(SVGObject);	
		fs.close(file_handle);
        });
	});
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
	
