# jaytable
from json to table

##Usage

```javascript
var demo = new JayTable();
```
### Build by JSON

```javascript
demo.jay(jsonfile)
```
### or with upload 
```html
<input type="file" id="jaytableFile"/>
<button id="createJayTable">Click</button>
```
```javascript
var file = document.getElementById("jaytableFile");
var btn = document.getElementById("createJayTable");
demo.uploadjay(file,btn)
```

###Events
```javascript
demo.on('uploadsuccess',function(event,data){
//some stuff on upload success
});

demo.on('uploadfailure',function(event){
//some stuff on upload fail
});

demo.on('jaysuccess',function(event,data){
//some stuff on success convert json 
});

demo.on('jayfailure',function(event){
//some stuff on fail convert json 
});
```
