const {LMap, LTileLayer, LMarker, LTooltip} = Vue2Leaflet

Vue.component("componente-mapa", LMap)
Vue.component("componente-tipo", LTileLayer)
Vue.component("componente-marcador", LMarker)
Vue.component("componente-titulo", LTooltip)

Vue.component("mapa",{
	props: ["marcadores"],
	data(){
		return{
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			zoom: 15,
			posicion: {
				lat: -38.73965,
				lng: -72.59842
			},
			opciones:{
				attributionControl : false,
				zoomControl: false
			}
		}
	},
	methods:{
		actualizarZoom: function(dato){

			if(this.zoom+dato > 12 && this.zoom+dato < 19){
				this.zoom = this.zoom + dato
			}
		}
	},
	computed: {
		centrarMapa: function(){
			if(this.marcadores.length>0){
				this.posicion.lat = this.marcadores[0][1]
				this.posicion.lng = this.marcadores[0][2]
			}

			return(this.posicion)
		}
	},
	template: `
		<div>
			<componente-mapa id="mapa" ref="mapa"
				:zoom = "zoom"
				:center = "centrarMapa"
				:options = "opciones"
			>
				<componente-tipo :url="url"></componente-tipo>

				<componente-marcador v-for="marcador in marcadores" 
				                     :lat-lng="{lat: marcador[1], lng: marcador[2]}">
					<componente-titulo>
						<center>
							{{marcador[0]}}
						</center>
					</componente-titulo>
				</componente-marcador>

			</componente-mapa>

			<div id="zoom">
				<button class="mi-boton-zoom aparece" @click="actualizarZoom(1)">+</button>
				<button class="mi-boton-zoom aparece" @click="actualizarZoom(-1)">-</button>
			</div>
		</div>
	`
})

Vue.component("menu-mapa",{
	data(){
		return{
			seleccionado: -1,
			todoCalles: [],
			buscaCalle: "",
			marcadoresCalle: [],
			fecha: new Date().getFullYear(),
			anteriorGrafico: null
		}
	},
	methods: {
		abrirGrafico: function(grafico,restaYear,sumaYear){
			this.promedioVelocidades = []
			if(restaYear == 0 && sumaYear == 0){
				this.fecha = new Date().getFullYear()
			}

			this.fecha += -restaYear+sumaYear
			
			if(grafico == 1){
				var resultado = []

				$.ajax({
					url: "php/consulta_promedio_velocidad.php",
					type: "POST",
					async: false,
					data: {"year":this.fecha},
					success: function(respuesta){
						JSON.parse(respuesta).forEach(elemento =>{
							if(elemento["AVG(velo)"] != null){
								resultado.push(parseFloat(elemento["AVG(velo)"]))
							}
							else{
								resultado.push(0)
							}
						})
				    }
				})

				if(this.anteriorGrafico != null){
					this.anteriorGrafico.destroy()
				}

				this.anteriorGrafico = new Chart("mi-grafico", {
				  type: "line",
				  data: {
				  	labels: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
				    datasets: [{
				      data: resultado,
				      borderColor: "red",
				      fill: false
				    }]
				  },
				  options: {
				  	legend: {display: false}
				  }
				});

			}

			document.getElementById("graficos").style.display = "flex"
		},
		cerrarGrafico: function(){
			document.getElementById("graficos").style.display = "none"
		},

		buscarCalleEspecifica: function(calle){
			var buscar = calle+", Temuco, Provincia de Cautín, Región de la Araucanía, Chile" 
			var resultados = []
			
			$.ajax({
				url: 'http://nominatim.openstreetmap.org/search?format=json&limit=5&q='+buscar,
				dataType: 'json',
				async: false,
				success: function(respuesta){
					respuesta.forEach(elemento => {
					nombre = ""
					
					for (i=0 ;i < elemento.display_name.indexOf(", Temuco"); i++){
						nombre += elemento.display_name[i]
					}

					resultados.push([nombre, elemento.lat, elemento.lon])
					})
				}
			})

			this.marcadoresCalle = resultados
		}
	},
	computed:{
		mostrarCalles: function(){
			if(this.seleccionado === 0){
				document.getElementById("menu-2").style.display = "none"
				document.getElementById("cabecera1").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera2").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera3").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera4").style.backgroundColor = "rgba(0,0,0,0)"
			}

			if(this.seleccionado === 1){
				document.getElementById("menu-2").style.display = "block"
				document.getElementById("cabecera1").style.backgroundColor = "rgba(254, 140, 1, 0.6)"
				document.getElementById("cabecera2").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera3").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera4").style.backgroundColor = "rgba(0,0,0,0)"

				var resultado = [];
				this.todoCalles = [];

				$.ajax({
					url: "php/consulta_calle.php",
					type: "POST",
					async: false,
					data: {"calle":this.buscaCalle},
					success: function(respuesta){
						try{
							JSON.parse(respuesta).forEach(elemento =>{
								resultado.push(elemento);
						    })
						}
						catch{
							console.log("No han habido coincidencias...")
						}	
				    }
				})

				this.todoCalles = resultado
			}

			if(this.seleccionado === 2){
				document.getElementById("menu-2").style.display = "block"
				document.getElementById("cabecera1").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera2").style.backgroundColor = "rgba(254, 140, 1, 0.6)"
				document.getElementById("cabecera3").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera4").style.backgroundColor = "rgba(0,0,0,0)"
			}
			if(this.seleccionado === 3){
				document.getElementById("menu-2").style.display = "block"
				document.getElementById("cabecera1").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera2").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera3").style.backgroundColor = "rgba(254, 140, 1, 0.6)"
				document.getElementById("cabecera4").style.backgroundColor = "rgba(0,0,0,0)"
			}

			if(this.seleccionado === 4){
				document.getElementById("menu-2").style.display = "block"
				document.getElementById("cabecera1").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera2").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera3").style.backgroundColor = "rgba(0,0,0,0)"
				document.getElementById("cabecera4").style.backgroundColor = "rgba(254, 140, 1, 0.6)"
			}
		}
	},
	template:`
		<div>
			<div id="menus">
				<div id="menu">
					<ul>
						<li><img class="logo" draggable="false" src="icons/logo.png"></li>
						<li id="cabecera1">
							<div class="seccion" @mouseover="seleccionado = 1">
								<img src="icons/icon1.png" draggable="false" class="icono">
								<img src="icons/text1.png" draggable="false" class="texto-encabezado">
							</div>
						</li>
						<li id="cabecera2">
							<div class="seccion" @mouseover="seleccionado = 2">
								<img src="icons/icon2.png" draggable="false" class="icono">
								<img src="icons/text2.png" draggable="false" class="texto-encabezado">
							</div>
						</li>
						<li id="cabecera3">
							<div class="seccion" @mouseover="seleccionado = 3">
								<img src="icons/icon3.png" draggable="false" class="icono">
								<img src="icons/text3.png" draggable="false" class="texto-encabezado">
							</div>
						</li>
						<li id="cabecera4"> 
							<div class="seccion" @mouseover="seleccionado = 4">
								<img src="icons/icon4.png" draggable="false" class="icono">
								<img src="icons/text4.png" draggable="false" class="texto-encabezado">
							</div>
						</li>
					</ul>
				</div>

				<div id="menu-2">
					<div v-if="this.seleccionado == 1">
						<input class="buscar-calle" v-model="buscaCalle" placeholder="Buscar calle en Temuco..."/>

						<div class="lista-calles">
							<ul>
								<div v-for='(calle,index) in todoCalles'>
									<li class='seccion-calles' v-if='index%2!=0' @click='buscarCalleEspecifica(calle.nombre)'>{{calle.nombre}}</li>
									<li class='seccion-calles pinta' v-else @click='buscarCalleEspecifica(calle.nombre)'>{{calle.nombre}}</li>
								</div>
							</ul>
						</div>
					</div>
					
					<div class="seleccionado-3" v-if="this.seleccionado == 3">
						<div class="apartado-histograma" @click="abrirGrafico(1,0,0)">
							<img class="img-histograma" src="icons/icons_city/2.png"/>
							<img class="img-histograma" src="icons/icons_city/1.png"/>
							<span class="texto-histograma">VELOCIDAD PROMEDIO DE LA CIUDAD</span>
						</div>

						<div class="apartado-histograma">
							<img class="img-histograma" src="icons/icons_street/2.png"/>
							<img class="img-histograma" src="icons/icons_street/1.png"/>
							<span class="texto-histograma">VELOCIDAD PROMEDIO DE LAS CALLES</span>
						</div>
					</div>
		
					<div v-html="mostrarCalles"></div>
				</div>
			</div>

			<div id="graficos">
				<div id="hoja-graficos">
					<div id="pinta-grafico">
						
						<div class="control-fecha-histograma">
							<button class="btn btn-success btn-fecha" type="button" @click="abrirGrafico(1,1,0)">
								<i class="fa fa-arrow-left" aria-hidden="true"></i>
							</button>
							
							<span class="texto-fecha">
								{{this.fecha}}
							</span>
							
							<button class="btn btn-success btn-fecha" type="button" @click="abrirGrafico(1,0,1)" v-if="this.fecha< (new Date().getFullYear())">
								<i class="fa fa-arrow-right" aria-hidden="true"></i>
							</button>
						</div>

						<canvas id="mi-grafico"/>
					</div>

					<div class="mis-botones-graficos">
						<button class="btn btn-primary btn-grafico" type="button">
							<i class="fa fa-print" aria-hidden="true"></i> Imprimir
						</button>
						<button class="btn btn-danger btn-grafico" @click="cerrarGrafico" type="button">
							<i class="fa fa-times" aria-hidden="true"></i> Cerrar
						</button>
					</div>
				</div>
			</div>

			<div @mouseover="seleccionado = 0">
				<mapa v-bind:marcadores="marcadoresCalle"></mapa>
			</div>
		</div>
	`
})

const app = new Vue({
	el: "#app",
	template:`
		<menu-mapa></menu-mapa>
	`
})