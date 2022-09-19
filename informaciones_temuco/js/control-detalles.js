Vue.component("control-detalles", {
    template: `
        <div class="control-detalles">
            <div class="container-fluid">
                <div class="row control-titulo" @click="verOpciones">
                    <div class="col-12 p-1 d-flex justify-content-center align-items-center">
                        <label class="opciones">Menú</label>&nbsp&nbsp&nbsp
                        <img id="control-opciones-img" src="img/abajo.png" width="15" height="18" class="mb-1"/>
                    </div>
                </div>
                
                <div id="control-opciones" class="pt-2 pb-3" style="display:block">
                    <div class="row d-flex justify-content-center">
                        <div class="col-11 control-subtitulo d-flex justify-content-center align-items-center mb-2" 
                             @click="verFiltros">
                            <label class="opciones">Filtrar</label>&nbsp&nbsp&nbsp
                            <img id="control-filtros-img" src="img/abajo.png" width="12" height="15" class="mb-1"/>
                        </div>

                        <div id="control-filtros" class="col-11" style="display:block">
                            <div class="form-group row d-flex justify-content-center">
                                <label class="col-3 p-1 col-form-label">Fecha</label>
                                <div class="col-7">
                                    <input type="text" 
                                        class="mi-control form-control form-control-sm" 
                                        id="control-fecha"
                                        @change="cambiarFecha"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row d-flex justify-content-center">
                        <div class="col-11 control-subtitulo d-flex align-items-center justify-content-center mb-2" 
                             @click="verHistogramas">

                            <label class="opciones">Histogramas Transito</label>&nbsp&nbsp&nbsp
                            <img id="control-histogramas-img" src="img/abajo.png" width="12" height="15" class="mb-1"/>
                        </div>

                        <div id="control-histogramas" class="col-11" style="display:block">
                            <div class="d-flex justify-content-center">
                                <button class="pushy__btn pushy__btn--sm btn-control" @click="verHistogramasCalles">
                                    <img src="img/calles.png" width=50/><br> Calles
                                </button>&nbsp&nbsp

                                <button class="pushy__btn pushy__btn--sm btn-control" @click="verHistogramasCiudad">
                                    <img src="img/ciudad.png" width=50/><br> Ciudad
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    `,
    methods: {
        cambiarFecha: function(){
            let fecha = document.getElementById("control-fecha").value;
            fecha     = fecha.split("/");
            fecha     = fecha[2] +"-"+ fecha[1] +"-"+ fecha[0];

            this.$emit("fecha", fecha);
        },
        buscarFechaUltimoRegistro: function(){
            let fechaUltimoRegistro;

            //Se procede a obtener la fecha del ultimo registro
            $.ajax({
                url: "php/consulta_ultimo_registro.php",
                type: "POST",
                async: false,
                data: {},
                success: function(respuesta){
                    let fechaAux = respuesta.split("-");
                    fechaUltimoRegistro = fechaAux[2] +"/"+ fechaAux[1] +"/"+ fechaAux[0]; 
                }
            })

            //Al iniciar el control la primera vez
            //se dan respectivos valores de la ultima fecha
            //registrada al control del mapa.
            return fechaUltimoRegistro;
        },
        //Metodos de control para mostrar u ocultar
        //ciertos apartados del menú.
        verOpciones: function(){
            let apartado = document.getElementById("control-opciones");
            let imagen   = document.getElementById("control-opciones-img");

            if(apartado.style.display === "block"){
                apartado.style.display = "none";
                imagen.src = "img/arriba.png";
            } 
            else{
                apartado.style.display = "block"
                imagen.src = "img/abajo.png";
            };
        },
        verFiltros: function(){
            let apartado = document.getElementById("control-filtros");
            let imagen   = document.getElementById("control-filtros-img");

            if(apartado.style.display === "block"){
                apartado.style.display = "none";
                imagen.src = "img/arriba.png";
            } 
            else{
                apartado.style.display = "block"
                imagen.src = "img/abajo.png";
            };
        },
        verHistogramas: function(){
            let apartado = document.getElementById("control-histogramas");
            let imagen   = document.getElementById("control-histogramas-img");

            if(apartado.style.display === "block"){
                apartado.style.display = "none";
                imagen.src = "img/arriba.png";
            } 
            else{
                apartado.style.display = "block"
                imagen.src = "img/abajo.png";
            }
        },
        //Metodos para botones de histogramas
        verHistogramasCalles: function(){
            let divHistogramasCalles = document.getElementById("modal-calles");
            divHistogramasCalles.style.opacity = 1;
            divHistogramasCalles.style.visibility = "visible";
        },
        verHistogramasCiudad: function(){
            let fecha = document.getElementById("control-fecha").value;
            fecha     = fecha.split("/");
            fecha     = fecha[2] +"-"+ fecha[1] +"-"+ fecha[0];

            this.configurarCanvasGrafico(fecha);

            let divHistogramasCalles = document.getElementById("modal-ciudad");
            divHistogramasCalles.style.opacity = 1;
            divHistogramasCalles.style.visibility = "visible";
        },
        configurarCanvasGrafico: function(fecha){
            //Se obtiene de MySQL la lista de 24 horas de
            //velocidad promedio por hora
            let velocidadPromedio;
            $.ajax({
                url: "php/consulta_velocidad_promedio_ciudad.php",
                type: "POST",
                async: false,
                data: {
                    "fecha": fecha
                },
                success: function(respuesta){
                    velocidadPromedio = JSON.parse(respuesta); 
                }
            })

            //Se obtiene de MySQL la lista de 24 horas de
            //vehiculos por hora
            let numeroVehiculos;
            $.ajax({
                url: "php/consulta_numero_vehiculos_ciudad.php",
                type: "POST",
                async: false,
                data: {
                    "fecha": fecha
                },
                success: function(respuesta){
                    numeroVehiculos = JSON.parse(respuesta); 
                }
            })

            const labelHoras = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM",
                                "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
                                "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
                                "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

            if(this.graficoCiudad !== null){
                this.graficoCiudad.destroy()
            }
        
            //Grafico de Velocidad
            const canvasCiudad = document.getElementById('histograma-ciudad').getContext('2d');
            this.graficoCiudad = new Chart(canvasCiudad, {
                //Tipo de grafico e información a mostrar
                type: 'line',
                data: {
                labels: labelHoras,
                datasets: [
                    {
                        label: 'Velocidad Promedio',
                        data: velocidadPromedio,
                        borderWidth: 1,
                        borderColor: "rgb(26, 130, 101)",
                        backgroundColor: "rgba(26, 130, 101, 0.5)",
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 17
                    },
                    {
                        label: 'Número de Vehiculos',
                        data: numeroVehiculos,
                        borderWidth: 1,
                        borderColor: "rgb(214, 132, 17)",
                        backgroundColor: "rgba(214, 132, 17, 0.5)",
                        pointStyle: 'circle',
                        pointRadius: 10,
                        pointHoverRadius: 17
                    }
                ]
                },

                //Configuraciones de Color
                options: {
                    responsive: true,
                    scales: {
                        y: {
                        ticks: { color: '#ded9d9', beginAtZero: true }
                        },
                        x: {
                        ticks: { color: '#ded9d9', beginAtZero: true }
                        }
                    }
                }
            });
        }
    },
    data: function(){
        return{
            graficoCiudad: null
        }
    },
    mounted: function(){
        //Se carga el control de fecha para las dos ranuras de entrada
        const fechaInicio = new Pikaday({
            field: document.getElementById("control-fecha"),
            format: 'DD/MM/YYYY'
        });

        //Carga un valor por defecto a las cajas de entradas.
        document.getElementById("control-fecha").value = this.buscarFechaUltimoRegistro(); 
    }
})