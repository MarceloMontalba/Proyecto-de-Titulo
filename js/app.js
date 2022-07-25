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
	template: `
		<div>
			<componente-mapa id="mapa" ref="mapa"
				:zoom = "zoom"
				:center = "posicion"
				:options = "opciones"
			>
				<componente-tipo :url="url"></componente-tipo>
				<componente-marcador v-for="marcador in marcadores" 
				                     :lat-lng="{lat: marcador.lat, lng:marcador.lon}">
					<componente-titulo>
						<center>
							<b>{{marcador.hora}}</b><br>
							{{marcador.fecha}}
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

const app = new Vue({
	el: "#app",
	data(){
		return{
			listaAutos: [],
			listaPuntos: []
		}
	},
	mounted(){
		/* Llenar lista de ids de vehiculos al iniciar la pagina*/
		var resultado = []
		$.ajax({
			url: "php/consulta_id.php",
			type: "POST",
			async: false,
			success: function(respuesta){
				JSON.parse(respuesta).forEach(elemento =>{
					resultado.push(elemento.id);
		        })
		    }
		})

		this.listaAutos = resultado;
	},
	methods:{
		verMarcadores: function(id){
			var resultado = []
			$.ajax({
				url: "php/consulta_posiciones.php",
				type: "POST",
				data: {idAuto: id},
				async: false,
				success: function(respuesta){
					JSON.parse(respuesta).forEach(elemento =>{
						resultado.push(elemento)
			        })
			    }
			})
			this.listaPuntos = resultado
		}
	},
	template:`
		<div>
			<div id="menu">
				<ul>
					<li><img class="logo" draggable="false" src="icons/logo.png"></li>
					<li><label class="aparece">ID Vehiculo:</label></li>
					<li>
						<div class="cajaselect aparece lista-autos">
							<span class="seleccionado"></span>
							
							<ul class="listaselect">
							    <li v-for="auto in listaAutos" @click="verMarcadores(auto)">
							    	<a href="#">{{auto}}</a>
							    </li>
						  </ul>
						  <span class="trianguloinf"></span>
						</div>
					</li>
				</ul>
			</div>
			
			<mapa v-bind:marcadores="this.listaPuntos"></mapa>
		</div>
	`
})