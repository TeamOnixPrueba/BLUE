
/* Funciones para cargar el versionamiento de BLUE ------------------------------- Inicio */

// the semi-colon before function invocation is a safety net against concatenated scripts and/or other plugins which may not be closed properly.

;(function() {
  "use strict";
  // Crea un arreglo con datos por defecto 
    var defaults = {
      url: 'https://blue.baccredomatic.com/blue_version_history.json',
	  data: '',
	  viewComponents: false,
	  viewRelease : false
	};
  // constructor
  function VersionBlue(element, options) {
    this.element = element;
    this.$element = $BLUEJQuery(element);
    
    // Carga las configuraciones e inicia el plugin
    this.versionBlueSettings = $BLUEJQuery.extend({}, defaults, options);
	this.versionBlueSettings.Id = element.id;
	this.Id = element.id;
    this.name = "versionBlue";
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  //pone a extender la funcion VersionBlue del prototipo creado para ella.
  $BLUEJQuery.extend(VersionBlue.prototype, {
    init: function() {
      // You already have access to the DOM element and the options via the instance, e.g. this.element and this.versionBlueSettings
      //this.$element = $BLUEJQuery(this.element).addClass(this.name);
      //funciones para crear la barra de brogreso 
	  //this.readTextFile( this.versionBlueSettings.url , this.printData());
	  this.readTextFile(this.versionBlueSettings.url);
	 // this.getComponentVersion("prueba");
      },
	run: function(){
		if(this.versionBlueSettings.viewComponents){
			this.createViewComponent();
		}
		if(this.versionBlueSettings.viewRelease){
			this.createViewRelease();
		}
		//else{
		//	this.createViewRelease();
		//}
	
    },
    destroy: function(){

    },
	createViewRelease: function(){
		$BLUEJQuery("#"+this.Id).addClass("position-relative");
		var plugin=this;
		var container = $BLUEJQuery("<div id='" + this.Id + "ReleaseContainer' class='bel-position-relative bel-card' ></div>");
		var options=[];
		$BLUEJQuery.each(this.versionBlueSettings.data.Versionamiento.Releases, function (ite, release){
		  var releaseVersion=plugin.calcVersionBlue(release.Pase);
		  options.push("<option value='"+releaseVersion+"'>"+releaseVersion+"</option>");
		});
		options.reverse();
			var select= "<div class='grid-row margin-bottom-s'><div class='col-3'><select onchange='componentSelectAct("+this.Id+")' id='"+this.Id+"Releases'>"+options.join('')+"</select></div></div>"
		$BLUEJQuery(container).append(select);
		
		
		this.$element.append(container);
		console.log(this);
		
		//this.printChangeComponent();
		
		var plugin=this;
		$BLUEJQuery("#"+this.Id+"Releases").blueSelect({
			disabled:false,
			language:"es",
			searcherMinQuantity: 6,
			scrollable : false
		});
	},
	createViewComponent: function(){
		$BLUEJQuery("#"+this.Id).addClass("position-relative");
		var container = $BLUEJQuery("<div id='" + this.Id + "ComponentContainer' class='bel-position-relative bel-card' ></div>");
		var select= "<div class='grid-row margin-bottom-s'><div class='col-6'><select onchange='componentSelectAct("+this.Id+")' id='"+this.Id+"Components'>"
		$BLUEJQuery.each(this.versionBlueSettings.data.Versionamiento.Componentes, function (ite, component){
		  select+="<option value='"+component.Nombre+"'>"+component.Nombre+"</option>";
		});
		select+="</select></div></div>";
		$BLUEJQuery(container).append(select);
		
		
		this.$element.append(container);
		this.printChangeComponent();
		
		var plugin=this;
		$BLUEJQuery("#"+this.Id+"Components").blueSelect({
			disabled:false,
			language:"es",
			searcherMinQuantity: 6,
			scrollable : false
		});
	},
	printChangeComponent: function(){
		$BLUEJQuery("#"+this.Id+"ContainerChange").remove();
		var plugin=this;
		var containerChange = $BLUEJQuery("<div id='" + this.Id + "ContainerChange' class='grid-container' ></div>");

		$BLUEJQuery.each(this.getChangeLogComponent($BLUEJQuery("#"+this.Id+"Components").val()), function (ite, change){
			
		  var Pase= "<div class='grid-row'><div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Pase: </p> <p class='bel-typography bel-typography-p'>"+change.Pase+"</p></div></div>" 
		  var Fecha= "<div class='grid-row'><div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Fecha: </p> <p class='bel-typography bel-typography-p'>"+change.Fecha+"</p></div></div>" 
		  var Version= "<div class='grid-row'><div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Versión: </p> <p class='bel-typography bel-typography-p'>"+change.Version+"</p></div></div>" 
		  var CambiosTitle="<div class='grid-row'><div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Cambios: </p></div></div>"
		  var CambiosList="<div class='grid-row'><div class='col-12'><ul class='bel-list'>";
		  
		  $BLUEJQuery.each(plugin.getListChangeHistory(change.Cambios), function (e, itemChange){
			  CambiosList=CambiosList+"<li class='bel-list__unordered-li'>"+itemChange+"</li>";
		  });
		 CambiosList=CambiosList+"</ul></div></div>";
		  
		  var changeHTML= "<div class='grid-row margin-bottom-s'>"+
		  "<div class='col-12'><div class='bel-card'>"+Pase+Fecha+Version+CambiosTitle+CambiosList+"</div></div></div>";
		  $BLUEJQuery(containerChange).append(changeHTML);
		});
		
		$BLUEJQuery("#"+this.Id+"ComponentContainer").append(containerChange);
		
	},
	getListChangeHistory: function (Cambios){
		var ChangesHistory=[];
		$BLUEJQuery.each(Cambios, function(iter1, cambio) {
          $BLUEJQuery.each(cambio.historias, function(iter2, historia) { 
		    $BLUEJQuery.each(historia.cambios, function(iter3, cambiohistoria) { 
			
		        ChangesHistory.push(cambiohistoria);
		     });
		  });
		});
			//console.log(changeComponent);
			return ChangesHistory;
	},
	readTextFile: function(url) {
		var plugin = this;
		var rawFile = new XMLHttpRequest();
		rawFile.overrideMimeType("application/json");
		rawFile.open("GET", url, true);
		rawFile.onreadystatechange = function() {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
				plugin.safeData(rawFile.responseText);
			}
		}
		rawFile.send(null);
	},
	safeData: function(text){
		this.versionBlueSettings.data = JSON.parse(text);
		if(this.versionBlueSettings.data){
			this.run();
		}
		else{
			this.destroy();
		}
	},
	calcVersionComponent: function(changeLog){
		var Y=0,Z=0;
		$BLUEJQuery.each(changeLog, function (ite, change){
			if(change.Z>0){
				Z=Z + parseInt(change.Z, 10);
			}
			if(change.Y>0){
				Y=Y + parseInt(change.Y, 10);
				Z=0;
			}
		});
		return Y+"."+Z;
	},
	getComponentVersion: function(component){
		var changeLogComponent= this.getChangeLogComponent(component);
		return this.calcVersionComponent(changeLogComponent);
	},
	getBlueVersion: function(){
		//var changeLogBlue= this.getChangeLogBlue();
		return this.calcVersionBlue();
	},
	calcVersionBlue: function(pase){
		var X=0,Y=0,Z=0;
		var stop=false;
		var plugin=this;
		$BLUEJQuery.each(this.versionBlueSettings.data.Versionamiento.Releases, function (ite, release){
			if(!stop){
				if(release.Z>0){
					Z=Z + parseInt(release.Z, 10);
				}
				if(release.Y>0){
					Y=Y + parseInt(release.Y, 10);
					Z=0;
				}
				if(release.X>0){
					X=X + parseInt(release.X, 10);
					Y=0;
					Z=0;
				}
				plugin.versionBlueSettings.data.Versionamiento.Releases[ite].Version = X+"."+Y+"."+Z;
			}
			if(release.Pase==pase){
				stop=true;
			}
		});
		
		return X+"."+Y+"."+Z;
	},
	//Obtiene el log de cambios de un componente en especifico
	getChangeLogComponent: function (component){
		var dataVersion= this.versionBlueSettings.data.Versionamiento;
		var Y=0,Z=0;
		var changeComponent=[];
		$BLUEJQuery.each(dataVersion.Releases, function(i, release) {
			$BLUEJQuery.each(release.Componentes, function(e, componente){
				
				if(componente.Nombre==component){
					if(componente.Z>0){
						Z=Z + parseInt(componente.Z, 10);
					}
					if(componente.Y>0){
						Y=Y + parseInt(componente.Y, 10);
						Z=0;
					}
					dataVersion.Releases[i].Componentes[e].Version=Y+"."+Z;
					var Componente=dataVersion.Releases[i].Componentes[e];
					Componente.Fecha = release.Fecha;
					Componente.Pase = release.Pase;
					changeComponent.push(Componente);
				}
				
			});
		});
			//console.log(changeComponent);
			return changeComponent;
	}
  });  
  $BLUEJQuery.fn.versionBlue = function(options) {
	return genericPlugin('versionBlue',options,arguments,VersionBlue,this)
  };
})($BLUEJQuery);

/* Funciones para la barra de progreso ---------------------------------- FIN */

function componentSelectAct(plugin){
	$BLUEJQuery("#"+plugin.id).versionBlue("printChangeComponent");

}
function genericPlugin(pluginName,options,args,GenericFunction,elemt){

	 if (options === undefined || typeof options === 'object') {
	      // Creates a new plugin instance, for each selected element, and
	      // stores a reference withint the element's data
	      return elemt.each(function() {
	        if (!$BLUEJQuery.data(this, 'plugin_' + pluginName)) {
	          $BLUEJQuery.data(this, 'plugin_' + pluginName, new GenericFunction(this, options));
	        }
	      });
	    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
	      // Cache the method call
	      // to make it possible
	      // to return a startValue
	      var returns;
	      elemt.each(function() {
	        var instance = $BLUEJQuery.data(this, 'plugin_' + pluginName);
	        if (instance instanceof GenericFunction && typeof instance[options] === 'function') {
	          // Call the method of our plugin instance,
	          // and pass it the supplied arguments.
	          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
	        }
	      });
	      return returns != undefined ? returns : elemt
	    }
	  };