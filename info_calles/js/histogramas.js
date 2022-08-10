Vue.component('histogramas', {
    template: `
        <div class="pantalla-histogramas">
            <div class="ventana-histogramas container">
                <div class="d-flex justify-content-end mr-2 mt-3">
                    <button class="btn btn-sm btn-danger cerrar" @click="cerrarPantallaHistogramas">x</button>
                </div>
                
                <div v-if="tipoHistogramas === 0">
                    <div class="control-fecha-histograma d-flex justify-content-center">
                        <button class="btn btn-outline-success btn-resta-year" type="button" @click="cambiarYear(1,0)">
                            <
                        </button>
                                            
                        <span class="texto-fecha">
                            {{this.year}}
                        </span>
                                            
                        <button class="btn btn-outline-success btn-suma-year" type="button" @click="cambiarYear(0,1)">
                            >
                        </button>
                    </div>

                    <!--Espacio en el que se grafica-->
                    <div class="container">
                        <div class="row d-flex justify-content-center">
                            <div class="col-10 col-lg-6 mt-3">
                                <canvas id="graficoVelocidad"/>
                            </div>
                            
                            <div class="col-10 col-lg-6 mt-3">
                                <canvas id="graficoNumeroVehiculos"/>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-center mt-3">
                        <button class="btn btn-outline-primary" @click="verMeses">Ver detalles</button>
                    </div>
                </div>

                <detalles-meses v-if="tipoHistogramas === 1" :year="this.year" @histogramasSeleccionados="regresar"></detalles-meses>
            </div>
        </div>
    `,
    data: function(){
        return{
            year: new Date().getFullYear(),
            tipoHistogramas: 0,
            banderaRegreso: false,
			anteriorGrafico: null,
            anteriorGrafico2: null
        }
    },
    mounted: function(){
        this.cambiarYear(0,0);
    },
    methods: {
        //Metodo para cambiar el año que se estará visualizando.
        cambiarYear: function(restarYear, sumarYear){
            this.year += -restarYear + sumarYear;

            //Se controla que el contador de año no baje de 0,
            //ni tampoco supere el año actual.
            this.year = this.year < 0 ? 0 : this.year;
            this.year = this.year > new Date().getFullYear() ? new Date().getFullYear() : this.year;

            let botonRestarYear = document.querySelector(".btn-resta-year");
            let botonSumarYear  = document.querySelector(".btn-suma-year"); 

            //Los botones se vuelven visibles o invisibles dependiendo
            //si el año es 0 o esta en el año actual respectivamente.
            botonRestarYear.style.visibility = this.year === 0 ? "hidden" : "inherit";
            botonSumarYear.style.visibility  = this.year === new Date().getFullYear() ? "hidden" : "inherit";
            
            //Se actualizan los graficos
            this.mostrarVelocidadPromedio();
            this.mostrarNumeroVehiculos();
        },
       
        //Metodo utilizado para mostrar la velocidad promedio de cada mes del año.
        mostrarVelocidadPromedio: function(){
            let resultado = [];

            //resultado se convierte en un array que tiene el contador de vehiculos
            //los datos de velocidad de todos los meses.
            $.ajax({
				url: "php/consulta_promedio_velocidad.php",
				type: "POST",
				async: false,
				data: { "histograma" : 1,
						"year":this.year},
				success: function(respuesta){
                    let contadorMes = 0;
                    let contadorPosicion = -1;

					JSON.parse(respuesta).forEach(fila =>{
                        let contadorMesActual = parseInt(fila[0].substring(5,7));

                        if(contadorMes === contadorMesActual){
                            resultado[contadorPosicion].push([fila[0],parseInt(fila[1])])
                        }
                        else{
                            contadorMes += 1;
                            
                            while (contadorMes<contadorMesActual){
                                resultado.push(new Array());
                                contadorMes +=1;
                                contadorPosicion +=1;
                            }

                            resultado.push(new Array([fila[0],parseInt(fila[1])]));
                            contadorPosicion += 1;
                        }
					})

                    while(resultado.length < 12){
                        resultado.push(new Array());
                    }
				}
			})


            promedioVelocidad = [];
            //en el array promedio velocidad se almacena la velocidad
            //promedio de cada mes del año
            resultado.forEach(mes => {
                let contador = 0;

                if(mes.length>0){
                    mes.forEach(auto => {
                        contador+= auto[1];
                    })
                
                    contador /= mes.length;
                }

                promedioVelocidad.push(contador); 
            })
            
            //Se grafica el promedio de velocidades
            if(this.anteriorGrafico != null){
				this.anteriorGrafico.destroy()
			}

			this.anteriorGrafico = new Chart("graficoVelocidad", {
				type: "line",
				data: {
					labels: ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
					datasets: [{
				    	data: promedioVelocidad,
				    	borderColor: "rgb(117, 45, 2)",
						backgroundColor: "rgb(117, 58, 2)",
						label: "Velocidad Anual Promedio(Km)",
					}]
				}
			});
        },

        //Funcion que grafica el numero de vehiculos
        //circundantes en Temuco mes a mes.
        mostrarNumeroVehiculos: function(){
            let resultado = [];

            //"resultado" se convierte en un array que tiene el
            //contador de vehiculos mes a mes.
            $.ajax({
				url: "php/consulta_numero_vehiculos.php",
				type: "POST",
				async: false,
				data: { "histograma" : 1,
                        "year" : this.year},
				success: function(respuesta){
					let contadorMes = 0;
                    let contadorPosicion = -1;

					JSON.parse(respuesta).forEach(fila =>{
                        let contadorMesActual = parseInt(fila[1]);

                        if(contadorMes === contadorMesActual){
                            resultado[contadorPosicion] += 1;
                        }
                        else{
                            contadorMes += 1;
                            
                            while (contadorMes<contadorMesActual){
                                resultado.push(0);
                                contadorMes +=1;
                                contadorPosicion +=1;
                            }

                            resultado.push(1);
                            contadorPosicion += 1;
                        }
					})

                    while(resultado.length < 12){
                        resultado.push(0);
                    }
				}
			})
            
            //Se grafica el numero de vehiculos
            if(this.anteriorGrafico2 != null){
				this.anteriorGrafico2.destroy()
			}

			this.anteriorGrafico2 = new Chart("graficoNumeroVehiculos", {
				type: "line",
				data: {
					labels: ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
					datasets: [{
				    	data: resultado,
				    	borderColor: "rgb(117, 45, 2)",
						backgroundColor: "rgb(117, 58, 2)",
						label: "Número de vehiculos",
					}]
				}
			});
        },

        //Metodo que mostrara cada uno de los meses de dicho año
        verMeses: function(){
            this.tipoHistogramas = 1;
        },

        //Metodo que volvera a mostrar los histogramas anuales
        //al obtener la respuesta del componente de detalles_meses
        //de querer volver
        regresar: function(respuesta){
            this.tipoHistogramas = respuesta;
            this.banderaRegreso  = true;
        },

        cerrarPantallaHistogramas: function(){
            this.$emit("verHistogramas", 0);
        }
    },
    updated: function(){
        if(this.banderaRegreso === true){
            this.cambiarYear(0,0);
            this.banderaRegreso = false;
        }
    }
})