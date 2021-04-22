
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
	  (!this.versionBlueSettings.data) ? this.readTextFile(this.versionBlueSettings.url):	this.safeData(this.versionBlueSettings.data);
      },
	run: function(){
		if(this.versionBlueSettings.viewComponents){
			this.createViewComponent();
		}
		if(this.versionBlueSettings.viewRelease){
			this.createViewRelease();
		}	
    },
    destroy: function(){

    },
	createViewRelease: function(){
		
		var plugin = this;
		var container = $BLUEJQuery("<div id='" + this.Id + "ReleaseContainer' class='bel-card bel-grid-container'></div>");
		var options = [];
		$BLUEJQuery.each(this.versionBlueSettings.data.Versionamiento.Releases, function (ite, release){
		  var releaseVersion = plugin.calcVersionBlue(release.Pase);
		  (plugin.versionBlueSettings.data.Versionamiento.Releases.length -1) ==ite ? options.push("<option value='"+releaseVersion+"'>"+releaseVersion+" (Actual)</option>") : options.push("<option value='"+releaseVersion+"'>"+releaseVersion+"</option>");
		  
		});
		options.reverse();
		var select= "<div class='grid-row margin-bottom-s'><div class='col-12 margin-bottom-xs'><label class='bel-typography bel-typography-label'>Versión Blue</label></div><div class='col-3'><select onchange='releaseSelectAct("+this.Id+")' id='"+this.Id+"Releases'>"+options.join('')+"</select></div></div>"
		$BLUEJQuery(container).append(select);
		
		
		this.$element.append(container);
		this.printChangeRelease();
		
		$BLUEJQuery("#"+this.Id+"Releases").blueSelect({
			disabled:false,
			language:"es",
			searcherMinQuantity: 6,
			scrollable : false
		});
	},
	createViewComponent: function(){
		
		var container = $BLUEJQuery("<div id='" + this.Id + "ComponentContainer' class='bel-card bel-grid-container margin-bottom-m' ></div>");
		var select= "<div class='grid-row margin-bottom-s'><div class='col-12 margin-bottom-xs'><label class='bel-typography bel-typography-label'>Versión por componente</label></div><div class='col-4'><select onchange='componentSelectAct("+this.Id+")' id='"+this.Id+"Components'>"
		$BLUEJQuery.each(this.versionBlueSettings.data.Versionamiento.Componentes, function (ite, component){
		  select+="<option value='"+component.Nombre+"'>"+component.Nombre+"</option>";
		});
		select+="</select></div></div>";
		$BLUEJQuery(container).append(select);
		this.$element.append(container);
		this.printChangeComponent();
		
		$BLUEJQuery("#"+this.Id+"Components").blueSelect({
			disabled:false,
			language:"es",
			searcherMinQuantity: 6,
			scrollable : false
		});
	},
	printChangeComponent: function(){
		$BLUEJQuery("#"+this.Id+"ContainerChangeComponent").remove();
		var plugin = this;
		var containerChange = $BLUEJQuery("<div id='" + this.Id + "ContainerChangeComponent' class='grid-row' ></div>");
		$BLUEJQuery.each(this.getChangeLogComponent($BLUEJQuery("#"+this.Id+"Components").val()), function (ite, change){
		  VersionBlue
		  var VersionBlue = "<div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Versión Blue: </p> <p class='bel-typography bel-typography-p'>"+change.VersionBlue+"</p></div>" 
		  var Pase = "<div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Pase: </p> <p class='bel-typography bel-typography-p'>"+change.Pase+"</p></div>" 
		  var Fecha = "<div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Fecha: </p> <p class='bel-typography bel-typography-p'>"+change.Fecha+"</p></div>" 
		  var Version = "<div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Versión: </p> <p class='bel-typography bel-typography-p'>"+change.Version+"</p></div>" 
		  var CambiosTittle = "<div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Cambios: </p></div>"
		  var CambiosList = "<div class='col-12'><ul class='bel-list'>";
		  
		  $BLUEJQuery.each(plugin.getListChangeHistory(change.Cambios), function (e, itemChange){
			  CambiosList += "<li class='bel-list__unordered-li'>"+itemChange+"</li>";
		  });
		 CambiosList+= "</ul></div>";
		  $BLUEJQuery(containerChange).prepend("<div class='grid-row margin-bottom-s'><div class='col-12'><div class='bel-card'>"+VersionBlue+Pase+Fecha+Version+CambiosTittle+CambiosList+"</div></div></div>");
		});
		
		$BLUEJQuery("#"+this.Id+"ComponentContainer").append(containerChange);
		
	},
	printChangeRelease: function(){	
		$BLUEJQuery("#"+this.Id+"ContainerChangeRelease").remove();
		var plugin = this;
		var selectReleaseVersion = $BLUEJQuery("#"+this.Id+"Releases").val();
		var containerChangeRelease = $BLUEJQuery("<div id='" + this.Id + "ContainerChangeRelease' class='grid-row'></div>");
		$BLUEJQuery.each(this.versionBlueSettings.data.Versionamiento.Releases, function (ite, release){
		  	if(release.Version==selectReleaseVersion){
		     var Pase= "<div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Pase: </p> <p class='bel-typography bel-typography-p'>"+release.Pase+"</p></div>" 
		     var Fecha= "<div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Fecha: </p> <p class='bel-typography bel-typography-p'>"+release.Fecha+"</p></div>" 
		     var CambiosTittle="<div class='col-12 '><p class='bel-typography bel-typography-p font-weight-semibold'>Cambios: </p></div>"
		     var CambiosList="<div class='col-12'><ul class='bel-list'>";
		  
		     $BLUEJQuery.each(release.CambiosBlue, function (e, cambiosBlue){
				$BLUEJQuery.each(cambiosBlue.cambios, function (e, cambio){
					CambiosList= (cambio) ? CambiosList+"<li class='bel-list__unordered-li'>"+cambio+"</li>" : "";
				});
		    });
		    CambiosList=CambiosList+"</ul></div>";
		   var containerTable="";
		   if(release.Componentes.length>0){
		    var table="<table id='"+plugin.Id+"TableComponent'>";
            var header="<thead><tr><th>Componente</th><th>Versión</th><th>Historias</th><th>Descripción</th></tr></thead>"
			table += header;
            var tbody="<tbody>";

		    $BLUEJQuery.each(release.Componentes, function (e, component){
                $BLUEJQuery.each(plugin.getChangeLogComponent(component.Nombre), function (e, changesComponent){
                    if(release.Pase==changesComponent.Pase){
					   tbody+="<tr><td><p class='bel-typography bel-typography-p'>"+changesComponent.Nombre+"</p></td><td><p class='bel-typography bel-typography-p'>"+
					   changesComponent.Version+"</p></td><td>"+plugin.buildListIdStory(changesComponent.Cambios)+
					   "</td><td>"+plugin.buildListDescriptionStory(changesComponent.Cambios)+"</td>";
				    }
				});	
		    });
		    table+=tbody+"</tbody></table>";
			containerTable = "<div class='col-12'><div class='bel-card'>"+table+"</div></div>";
		    }
		    $BLUEJQuery(containerChangeRelease).append(Pase).append(Fecha).append(CambiosTittle).append(CambiosList).append(containerTable);
		    }
		});
		$BLUEJQuery("#"+plugin.Id+"ReleaseContainer").append(containerChangeRelease);
		$BLUEJQuery("#"+plugin.Id+"TableComponent").blueTable({
          toggleable:false,
          extensible:true,
          rowHover:true,
          extensibleLabel: "Ver m&aacute;s",
          collapseLabel: "Ver menos",
          tdWidth:[20, 20, 10, 50],
          thAlign:["left", "left", "left", "left", "center"],
          tdAlign:["left", "left", "left", "left", "right"],
		  itemPerPage:5
        });
		
	},
	buildListDescriptionStory: function (arrayChanges){
		var StoryDescription = "";
		$BLUEJQuery.each(arrayChanges, function (e, changes){
			$BLUEJQuery.each(changes.historias, function (i, stories){
				$BLUEJQuery.each(stories.cambios, function (i, cambio){
			   StoryDescription+="<p class='bel-typography bel-typography-p bel-list__unordered-li display-block'>"+cambio+"</p>";
			});
			});
		});
		return StoryDescription;
	},
	buildListIdStory: function (arrayChanges){
		var StoryIds="";
		$BLUEJQuery.each(arrayChanges, function (e, changes){
			$BLUEJQuery.each(changes.historias, function (i, stories){
			   StoryIds+="<a class='bel-typography bel-typography-link font-weight-semibold display-block cursor-pointer' href='"+stories.linkJira+"' target="_blank">"+stories.id+"</a>";
			});
		});
		return StoryIds;
	},
	getListChangeHistory: function (Changes){
		var ChangesStory = [];
		$BLUEJQuery.each(Changes, function(iter1, change) {
          $BLUEJQuery.each(change.historias, function(iter2, story) { 
		    $BLUEJQuery.each(story.cambios, function(iter3, ChangeStory) { 			
		        ChangesStory.push(ChangeStory);
		    });
		  });
		});
		return ChangesStory;
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
		(this.versionBlueSettings.data) ? this.run() : this.destroy();
	},
	calcVersionComponent: function(changeLog){
		var Y = 0, Z = 0;
		$BLUEJQuery.each(changeLog, function (ite, change){
			if(change.Z>0){
				Z += parseInt(change.Z, 10);
			}
			if(change.Y>0){
				Y+= parseInt(change.Y, 10);
				Z = 0;
			}
		});
		return Y+"."+Z;
	},
	getComponentVersion: function(component){
		return this.calcVersionComponent(this.getChangeLogComponent(component));
	},
	getBlueVersion: function(){
		return this.calcVersionBlue();
	},
	calcVersionBlue: function(anRelease){
		var X = 0, Y = 0, Z = 0;
		var stop = false;
		var plugin = this;
		$BLUEJQuery.each(this.versionBlueSettings.data.Versionamiento.Releases, function (ite, release){
			if(!stop){
				if(release.Z > 0){
					Z=Z + parseInt(release.Z, 10);
				}
				if(release.Y > 0){
					Y=Y + parseInt(release.Y, 10);
					Z=0;
				}
				if(release.X > 0){
					X = X + parseInt(release.X, 10);
					Y = 0;
					Z = 0;
				}
				plugin.versionBlueSettings.data.Versionamiento.Releases[ite].Version = X+"."+Y+"."+Z;
			}
			if(release.Pase== anRelease){
				stop = true;
			}
		});
		
		return X+"."+Y+"."+Z;
	},
	//Obtiene el log de cambios de un componente en especifico
	getChangeLogComponent: function (component){
		var dataVersion = this.versionBlueSettings.data.Versionamiento;
		var Y = 0 ,Z = 0;
		var plugin=this;
		var changeComponent = [];
		$BLUEJQuery.each(dataVersion.Releases, function(i, release) {
			$BLUEJQuery.each(release.Componentes, function(e, componente){
				if(component.toUpperCase() == (componente.Nombre).toUpperCase()){
					if(componente.Z > 0){
						Z=Z + parseInt(componente.Z, 10);
					}
					if(componente.Y>0){
						Y=Y + parseInt(componente.Y, 10);
						Z=0;
					}
					dataVersion.Releases[i].Componentes[e].Version=Y+"."+Z;
					dataVersion.Releases[i].Componentes[e].VersionBlue= plugin.calcVersionBlue(dataVersion.Releases[i].Pase);
					var Componente=dataVersion.Releases[i].Componentes[e];
					Componente.Fecha = release.Fecha;
					Componente.Pase = release.Pase;
					changeComponent.push(Componente);
				}
			});
		});
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
function releaseSelectAct(plugin){
	$BLUEJQuery("#"+plugin.id).versionBlue("printChangeRelease");
}
function genericPlugin(pluginName,options,args,GenericFunction,elemt){
	 if (options === undefined || typeof options === 'object') {
	      return elemt.each(function() {
	        if (!$BLUEJQuery.data(this, 'plugin_' + pluginName)) {
	          $BLUEJQuery.data(this, 'plugin_' + pluginName, new GenericFunction(this, options));
	        }
	      });
	    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
	      var returns;
	      elemt.each(function() {
	        var instance = $BLUEJQuery.data(this, 'plugin_' + pluginName);
	        if (instance instanceof GenericFunction && typeof instance[options] === 'function') {
	          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
	        }
	      });
	      return returns != undefined ? returns : elemt
	    }
	  };