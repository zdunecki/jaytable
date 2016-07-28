const APP = "JayTable";

class JayTable {
  constructor(file,createbtn) {

  	this.events = {};
  }

   on(name, event){
    	this.events[name] = event;
   }

   emit(event,response){

   		if(!this.events.hasOwnProperty(event))
   			return;
   
    	this.events[event].call(this,event,response);
   }

   destroy(event){
        delete this.events[event];  
   }

  jay(json){
  	try{
	  const jayTableService = new JayTableService(json);
	  jayTableService.jTableIsValid().then(()=>{
	  	return jayTableService.convertToJayTable();
	  	}).then((JayTable)=>{
	  		const exporter = new jayExporter(JayTable);
	  		return exporter.exportToHTML();
	  	}).then((tablecode)=>{
	  		this.emit('jaysuccess',tablecode);
	  	}).catch(err=>{
	  		this.emit('jayfailure');
	  	})
	  	}catch(e){
	  		console.log(e);
	  	}
  }
  uploadjay(file,createbtn){
  	this.file = file;
  	this.createbtn = createbtn;
  	console.log(this.file);

  	this.file.addEventListener("change",()=>{
  		const uploadService = new UploadService();
  		uploadService.upload(this.file.files[0]).then((res)=>{
  			this.uploadData = res;
  			this.emit('uploadsuccess',res);
  		}).catch(err=>{
  			this.emit('uploadfailure');
  		})
  	})

  	this.createbtn.addEventListener("click",()=>{
	  	try{
	  		const jsonTableParse = JSON.parse(this.uploadData);
	  		const jayTableService = new JayTableService(jsonTableParse);

	  		jayTableService.jTableIsValid().then(()=>{
	  			return jayTableService.convertToJayTable();
	  		}).then((JayTable)=>{
	  			const exporter = new jayExporter(JayTable);
	  			return exporter.exportToHTML();
	  		}).then((tablecode)=>{
	  			this.emit('jaysuccess',tablecode);
	  		}).catch(err=>{
	  			this.emit('jayfailure');
	  		})

	  	}catch(e){
	  		console.log(e);
	  	}
  	})
  }
}

class UploadService{
	upload(file){
		const fileType = ['json'];
		const extension = file.name.split('.').pop().toLowerCase(),
		isSuccess = fileType.indexOf(extension) > -1;

		return new Promise((resolve, reject) => {

			if(isSuccess){
				const reader = new FileReader();
				 reader.onload = function (e) {
	                resolve(e.target.result);
	            }
	            reader.readAsBinaryString(file);
			}else{
				reject("Bad format validation, make sure you upload json file!")
			}

	    })
	}
}

class JayTableService{
	constructor(jsonTable){
		this.jsonTable = jsonTable;
	}

	proCheckRules(elements,action,condition){
	  if(elements == undefined){// element doesn't exists
          return false;
        }
        else {  //element find but need check
          if(action){  //if we need condiction as a function
            return action();
          }
          else{  //if we dont need function condition, just statement
              if(condition){
                return true;
              }
              else {
                return false;
              }
          }

        }
	}
	jTableIsValid(){
		this.firstKey = Object.keys(this.jsonTable)[0];
        this.twiceKey = Object.keys(this.jsonTable)[1];
        //elements
        this.keys = Object.keys(this.jsonTable);
        this.elem2 = this.jsonTable[this.firstKey];
        this.elem3 = this.jsonTable[this.twiceKey];

        const valid = this.checkRules();
        return new Promise((resolve, reject) => {
        	valid ? resolve(this.jsonTable) : reject("ERROR, not JayTable format. Look at documentation for more help.");
	    })
	}

	checkRules(){
		//rules
        this.rule1 = this.keys != undefined && this.keys.length == 2;  // need keys and only 2
        this.rule2 = this.elem2 != undefined && this.elem2.length == 1;
        this.rule3 = this.checkRule3;
        // VALIDATION
        const VALIDATION1 = this.proCheckRules(this.keys,null,this.rule1);
        const VALIDATION2 = this.proCheckRules(this.elem2,null,this.rule2);
        const VALIDATION3 = this.rule3();
  // return true or false for checkRules function
        const valid = VALIDATION1 && VALIDATION2 && VALIDATION3 == true;
        return valid ? true:false;
	}

	checkRule3(){
        var validation3_arr =[];
        var validation3_arr2 =[];
 
        const VALIDATION3 = this.proCheckRules(this.elem3,()=>{
        var validation3_length = this.elem3.length;

        var colsKeys =[];

        for(var i=0; i<validation3_length; i++){
            let rule = Object.keys(this.elem3[i]).length == 1;
            rule ? validation3_arr.push(rule) : null;
            let cols = Object.keys(this.elem3[i]);
            colsKeys.push(cols[0]);
         }

        for(i=0; i<colsKeys.length; i++){
            let statement = colsKeys[i] == colsKeys[i+1];
            if(i == colsKeys.length-1){
              null;
            }else{
              statement ? validation3_arr2.push(statement) : null;
            }
        }
       const endrule = validation3_arr.length == validation3_length && validation3_arr2.length == validation3_length-1;
           return endrule ? true:false; //return true or false for VALIDATION3
       }); 
          return VALIDATION3;
	}

	convertToJayTable(){
		return new Promise((resolve, reject) => {
			 if(this.jsonTable){
				this.a = Object.keys(this.jsonTable)[0];
		            
		        this.titles = this.jsonTable[Object.keys(this.jsonTable)[0]];
		        
		        this.table = this.jsonTable[Object.keys(this.jsonTable)[1]];

		        this.DataKeys = Object.keys(this.jsonTable); // return first and twice array of jsonTable  
		            
		        //converter this.ables 
		        this.theadString = this.DataKeys[0] // return string our first array name;
		        this.tableString = this.DataKeys[1] // return string our twice array name;
		        this.tr = this.table[0];
		        this.trSting = Object.keys(this.tr).toString();
		        this.td = this.tr[this.trSting]
		        this.tdString = Object.keys(this.td[0]).toString();
		        this.td_leng = this.td.length;
		        const convertedJayTable = this.changeStructure();
		        resolve(convertedJayTable);

			}else{
				reject("ERROR WITH CONVERT");
			}
	    })

	}

	changeStructure(){

        function check(element,action){
            element == undefined ? action() : null;   // change structure Data if elements aren't naming 'thead','table','tr' and 'td'
        }
        // change structure Data -> thead
        check(this.jsonTable.thead, ()=>{
          this.jsonTable.thead = this.jsonTable[this.theadString];
            delete this.jsonTable[this.theadString];
        })     
        // change structure Data -> table
         check(this.jsonTable.table,()=>{
           this.jsonTable.table = this.jsonTable[this.tableString];
             delete this.jsonTable[this.tableString];
         });
        // change structure to table->tr
         check(this.table[0].tr,()=>{
            for(var i=0; i<this.table.length; i++){
            //console.log((elements[i]['tr']));
             this.table[i].tr = this.table[i][this.trSting];
             delete this.table[i][this.trSting];
            }
          });
          // change structure to tr -> td
          check(this.table[0].tr[0].td,()=>{
            for(var i=0; i<this.table.length; i++){
              for(var c=0; c<this.td_leng;c++){
                   this.table[i].tr[c].td = this.table[i].tr[c][this.tdString];
                   delete this.table[i].tr[c][this.tdString];
               }
             }
           });
          return this.jsonTable;
	}
}

class jayExporter {
	constructor(table){
		this.table = table;
	}
	HTMLcreator(){

  		if(this.table){
		  	var jayThead = this.table.thead[0];
		  	var jayTbody = this.table.table;

		  	var spaceNode = document.createTextNode(" ");

		  	function space(){
		  		return spaceNode.cloneNode();
		  	};

		  	var table = document.createElement("table");
		  	var thead = document.createElement("thead");
		  	var thead_tr = document.createElement("tr");
		  	var tbody = document.createElement("tbody");

			
			// append elements;

			table.appendChild(space());
		  	table.appendChild(thead);
		  	table.appendChild(space());

		  	thead.appendChild(space());
		  	thead.appendChild(thead_tr);
		  	thead.appendChild(space());

		  	table.appendChild(tbody);
		    table.appendChild(space());

		  	jayThead.map(function(v,i){
		  		var th = document.createElement("th");
		  		var th_txt = document.createTextNode(v.title);
		  		
		  		thead_tr.appendChild(space());
		  			thead_tr.appendChild(th);
		  		thead_tr.appendChild(space());

		  		th.appendChild(space());
		  			th.appendChild(th_txt);
		  		th.appendChild(space());

		  	});

		  	jayTbody.map(function(v,i){
		  			var tbody_tr = document.createElement("tr");

		  			tbody.appendChild(space());
		  				tbody.appendChild(tbody_tr);
		  			tbody.appendChild(space());

		  		v.tr.map(function(v,i){
		  		  	var td = document.createElement("td");
		  		  	var td_txt = document.createTextNode(v.td);

		  		  	td.appendChild(space());
		  		  		td.appendChild(td_txt);
		  		  	td.appendChild(space());

		  		  	tbody_tr.appendChild(space());
		  		  		tbody_tr.appendChild(td);
		  		  	tbody_tr.appendChild(space());
		  		});
		  	});

		  	var tableString = table.outerHTML;

		  	return tableString;
  	}
	  	else {
	  		console.error("Error with ExportTableService");
	  	}
	}
	exportToHTML(){
		const createHTML = this.HTMLcreator();
		return new Promise((resolve, reject) => {
			createHTML ? resolve(createHTML) : reject("Error from jayExporter");
	    })
	}
}
