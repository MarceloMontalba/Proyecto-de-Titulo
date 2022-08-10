Vue.component("detalles-meses", {
	props: ["year"],
    template: `
        <div>
			<button class="btn btn-regresar ml-5" @click="regresar">
				Regresar
			</button>

            <div class="control-fecha-histograma">
				{{year}}
			</div>

			<div class="container">
				<div class="row justify-content-center">
					<button class="btn btn-sm btn-outline-warning btn-secundario btn-restar-mes" 
							type="button" @click="cambiarMes(1,0)"><</button>
					
					<span class="texto-mes">
						{{this.mesTexto[this.mes]}}
					</span>
					
					<button class="btn btn-sm btn-outline-warning btn-secundario btn-sumar-mes" 
							type="button" @click="cambiarMes(0,1)">></button>
				</div>

				<div class="row d-flex justify-content-center mt-1 contenido-histogramas">
					<!--Canvas que muestran los graficos correspondientes al mes-->
					
					<div class="col-12 col-xl-7 pb-5">
						<canvas id="graficoVelocidad"/>
					</div>

					<div class="col-12 col-xl-7 pb-5">
						<canvas id="graficoNumeroVehiculosDias"/>
					</div>

					<div class="col-12 col-xl-7">
						<canvas id="mi-grafico3"/>
					</div>
				</div>
			</div>

        </div>
    `,
    data: function(){
        return{
			mes: new Date().getMonth(),
			mesTexto:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio",
					  "Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
			anteriorGrafico: null,
			anteriorGrafico2: null,
			anteriorGrafico3: null
        }
    },
    mounted: function(){
		this.cambiarMes(0, 0);
	},
    methods: {
		cambiarMes: function(restarMes, sumarMes){
			this.mes += -restarMes + sumarMes;

			//Se controla el limite menor y mayor
			//de los meses del año.
			this.mes = this.mes < 0? 0: this.mes;
			this.mes = this.mes >11? 11: this.mes;

			let botonRestarMes = document.querySelector(".btn-restar-mes");
			let botonSumarMes  = document.querySelector(".btn-sumar-mes");

			//Dependiendo si se supera el limite menor o mayor de meses
			//los respectivos botones de resta o de suma aparecen o desaparecen.
			botonRestarMes.style.visibility = this.mes === 0 ? "hidden" : "inherit";
			botonSumarMes.style.visibility  = this.mes === 11? "hidden" : "inherit";

			//Se actualizan los graficos respectivos del mes
			this.mostrarVelocidadPromedio();
			this.mostrarNumeroVehiculos();
			this.mostrarPromedioVehiculosHoras();
		},

		mostrarVelocidadPromedio: function(){
			let resultado = [];
			
			/*La matriz resultado almacenara las velocidades corresponientes
			a cada uno de los dias del mes de la forma:
			[
				[velocidad, velocidad, velocidad],				//Dia 1
				[velocidad,velocidad],							//Dia 2
				[velocidad, velocidad, velocidad, velocidad],	//Dia 3
				......
			]
			*/
			$.ajax({
				url: "php/consulta_promedio_velocidad.php",
				type: "POST",
				async: false,
				data: { "histograma" : 2,
						"year" : this.year,
						"mes" : this.mes+1},
				success: function(respuesta){
					let velocidadesDias = [];
					let posicionVelocidadesDias = -1;
					let diaAnterior = 0;

					JSON.parse(respuesta).forEach(fila =>{
						let diaActual = parseInt(fila[1].substring(8,10));
						
						if(diaAnterior === diaActual){
							velocidadesDias[posicionVelocidadesDias].push(parseInt(fila[0]));
						}
						else{
							while(diaAnterior < diaActual-1){
								velocidadesDias.push([0]);
								posicionVelocidadesDias += 1;
								diaAnterior +=1;
							}

							velocidadesDias.push([parseInt(fila[0])]);
							posicionVelocidadesDias += 1;
							diaAnterior += 1;
						}
					})

					resultado = velocidadesDias; 
				}
			})

			let numeroDias = new Date(this.year, this.mes + 1, 0).getDate()

			//al terminar de almacenar todos los datos, si existen dias en que no hubo movimiento
			//despues del ultimo dia donde se tuvo registro, se añade un 0 en cada uno de ellos
			//hasta llenar el numero de dias correspondiente al mes.
			while(resultado.length < numeroDias){
				resultado.push([0]);
			}
			
			//Se almacenan los promedios de cada dia en promedioVelocidades
			promedioVelocidades = [];
			resultado.forEach(dia => {
				let contador = 0;

				dia.forEach(velocidadAuto => {
					contador += velocidadAuto;
				})

				promedioVelocidades.push(contador/dia.length);
			})
			
			//Se crean los labels que serán utilizados en el grafico
			let labelVelocidadPromedio = [];
			for(let i = 0 ; i < promedioVelocidades.length; i++){
				labelVelocidadPromedio.push("Dia "+String(i+1));
			}

			//Se grafica el promedio de velocidades
			if(this.anteriorGrafico != null){
				this.anteriorGrafico.destroy()
			}

			this.anteriorGrafico = new Chart("graficoVelocidad", {
				type: "line",
				data: {
					labels: labelVelocidadPromedio,
					datasets: [{
				    	data: promedioVelocidades,
				    	borderColor: "rgb(117, 45, 2)",
						backgroundColor: "rgb(117, 58, 2)",
						label: "Velocidad Promedio por dia (Km)",
					}]
				}
			});
		},

		mostrarNumeroVehiculos: function(){
			let resultado = [];
			
			$.ajax({
				url: "php/consulta_numero_vehiculos.php",
				type: "POST",
				async: false,
				data: { "histograma" : 2,
						"year" : this.year,
						"mes" : this.mes + 1},
				success: function(respuesta){
					let numeroVehiculosDias = [];
					let posicionNumeroVehiculosDias = -1;
					let diaAnterior = 0;

					JSON.parse(respuesta).forEach(vehiculo =>{
						let diaActual = parseInt(vehiculo[1].substring(8, 10));

						if(diaAnterior === diaActual){
							numeroVehiculosDias[posicionNumeroVehiculosDias] += 1;
						}

						if(diaAnterior !== diaActual){
							while(diaAnterior < diaActual-1){
								numeroVehiculosDias.push(0);
								posicionNumeroVehiculosDias += 1;
								diaAnterior +=1;
							}

							numeroVehiculosDias.push(1);
							posicionNumeroVehiculosDias += 1;
							diaAnterior +=1;
						}
					});

					resultado = numeroVehiculosDias; 
				}
			})

			let numeroDias = new Date(this.year, this.mes + 1, 0).getDate()

			//al terminar de almacenar todos los datos, si existen dias en que no hubo movimiento
			//despues del ultimo dia donde se tuvo registro, se añade un 0 en cada uno de ellos
			//hasta llenar el numero de dias correspondiente al mes.
			while(resultado.length < numeroDias){
				resultado.push(0);
			}
			
			//Se crean los labels que serán utilizados en el grafico
			let labelNumeroVehiculosDias = [];
			for(let i = 0 ; i < resultado.length; i++){
				labelNumeroVehiculosDias.push("Dia "+String(i+1));
			}

			//Se grafica el numero de vehiculos por dia
			if(this.anteriorGrafico2 != null){
				this.anteriorGrafico2.destroy()
			}

			this.anteriorGrafico2 = new Chart("graficoNumeroVehiculosDias", {
				type: "line",
				data: {
					labels: labelNumeroVehiculosDias,
					datasets: [{
				    	data: resultado,
				    	borderColor: "rgb(117, 45, 2)",
						backgroundColor: "rgb(117, 58, 2)",
						label: "Numero de Vehiculos por dia",
					}]
				}
			});

		},

		mostrarPromedioVehiculosHoras: function(){
			let resultado= [];
			//En la matriz resultado cada uno de los arrays almacenados
			//son una hora especifica y dentro tienen filas que representan un
			//vehiculo que estuvo en determinada fecha y en esa puntual hora.

			$.ajax({
				url: "php/consulta_vehiculos_hora.php",
				type: "POST",
				async: false,
				data: {"year": this.year, 
					   "mes" : this.mes+1
				},
				success: function(respuesta){
					let indexAnterior = -1;

					JSON.parse(respuesta).forEach(fila => {
						if(parseInt(fila[2]) === indexAnterior){
							resultado[indexAnterior].push(fila);
						}
						else{
							indexAnterior += 1;
							resultado.push(new Array(fila));
						}
					})
				}
			})

			//En la matriz acumuladorVehiculosHoras se almacena el conteo de
			//vehiculos por dia del mes en cada una de sus horas (00 - 24Hrs)
			//su estructura es la siguiente:
			/*[
				[n_autos_dia1, n_autos_dia2, n_autos_dia3, n_autos_dia4],	//Hora 00
				[n_autos_dia1, n_autos_dia2, n_autos_dia3],					//Hora 01
				[n_autos_dia1, n_autos_dia2, n_autos_dia3, n_autos_dia4],	//Hora 02
				[n_autos_dia1, n_autos_dia2],								//Hora 03
			  ]
			*/
			let acumuladorVehiculosHora = [];
			resultado.forEach(hora =>{
				let fechasUsadas = [];
				let acumuladorGlobal = []; 

				hora.forEach(auto =>{
					if(fechasUsadas.indexOf(auto[1]) === -1){
						let fechaActual = auto[1];
						let acumulador = 0;
						
						hora.forEach(autoPrimo => {
							if(autoPrimo[1] === fechaActual){
								acumulador += 1;
							}
						})	

						acumuladorGlobal.push(acumulador);
						fechasUsadas.push(fechaActual);
					}
				})

				acumuladorVehiculosHora.push(acumuladorGlobal);
				fechasUsadas = [];
			})


			//Para los dias que no transitaron vehiculos se les añade un 0 en cada uno de ellos
			let numeroDias = new Date(this.year, this.mes+1, 0).getDate();			
			for(let i = 0; i < acumuladorVehiculosHora.length; i++){
				if(acumuladorVehiculosHora[i].length < numeroDias){
					let diferencia = numeroDias - acumuladorVehiculosHora[i].length;
					for(let x = 0; x < diferencia; x++){
						acumuladorVehiculosHora[i].push(0);
					}
				}
			}

			let promedioVehiculosHoras = [];
			acumuladorVehiculosHora.forEach(hora =>{
				let acumulador = 0;

				hora.forEach(dia =>{
					acumulador += dia;
				})

				promedioVehiculosHoras.push(acumulador/hora.length);
			})

			if(this.anteriorGrafico3 != null){
				this.anteriorGrafico3.destroy()
			}
		
			this.anteriorGrafico3 = new Chart("mi-grafico3", {
				type: "bar",
				data: {
					labels: ["12 AM","1 AM","2 AM","3 AM","4 AM","5 AM",
							"6 AM","7 AM","8 AM","9 AM","10 AM","11 AM",
							"12 PM","1 PM","2 PM","3 PM","4 PM","5 PM",
							"6 PM","7 PM","8 PM","9 PM","10 PM","11 PM",],
					datasets: [{
				    	data: promedioVehiculosHoras,
						borderColor: "rgb(140, 57, 1)",
						borderWidth: "2",
						backgroundColor: "rgba(140, 57, 1, 0.5)",
						label: "Promedio de Vehiculos en movimiento",
					}]
				}
			});
		},

        regresar: function(){
            this.$emit("histogramasSeleccionados", 0);
        }
    }
})