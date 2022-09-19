Vue.component("menu-histogramas-calles", {
    template: `
        <div id="modal-calles">
            <div class="contenedor">
                <header>Calles Registradas de Temuco</header>
                <button @click="cerrarMenuHistogramasCalles" class="pushy__btn pushy__btn--sm pushy__btn--red">x</button>

                <div class="container">
                    <div class="row">
                        <div class="col-8 p-3">
                            <input class="mi-input form-control form-control-sm" 
                                   placeholder="Ingresar nombre de la calle..."
                                   v-model="calleBuscada" />
                        </div>
                    </div>
                </div>

                <div class="contenido" id="contenido-menu-calles">
                    <table class="w-100 m-0">                     
                        <tr v-for="calle in verListaCalles()" @click="verHistogramas(calle)">
                            <td>{{calle}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return{
            calleBuscada: "",
            graficoCalle: null
        }
    },
    methods: {
        cerrarMenuHistogramasCalles: function(){
            let divMenuCalles = document.getElementById("modal-calles");
            divMenuCalles.style.opacity = 0;
            divMenuCalles.style.visibility = "hidden";
        },
        verListaCalles: function(){
            let calles;

            $.ajax({
                url: "php/consulta_calles.php",
                type: "POST",
                async: false,
                data: {
                    "diccionario": 0,
                    "calle-deseada": this.calleBuscada
                },
                success: function(respuesta){
                    calles = JSON.parse(respuesta); 
                }
            })

            //Se setea la barra scroll a la parte más alta del div
            let contenedor = document.getElementById("contenido-menu-calles");
            if(contenedor!==null){
                contenedor.scrollTop = 0;
            }

            return calles;
        },
        verHistogramas: function(calle){
            let fecha = document.getElementById("control-fecha").value;
            fecha     = fecha.split("/");
            fecha     = fecha[2] +"-"+ fecha[1] +"-"+ fecha[0];

            this.configurarCanvasGrafico(calle, fecha);
            this.$emit("calle", calle);

            //Se hace invisible esta ventana y
            //se hace visible la ventana de histogramas.
            let divMenuCalles = document.getElementById("modal-calles");
            divMenuCalles.style.opacity = 0;
            divMenuCalles.style.visibility = "hidden";

            let divHistogramasCalles = document.getElementById("modal-histogramas-calles");
            divHistogramasCalles.style.opacity = 1;
            divHistogramasCalles.style.visibility = "visible";
        },
        configurarCanvasGrafico: function(calle, fecha){
            //Se obtiene de MySQL la lista de 24 horas de
            //velocidad promedio por hora
            let velocidadPromedio;
            $.ajax({
                url: "php/consulta_velocidad_promedio.php",
                type: "POST",
                async: false,
                data: {
                    "fecha": fecha,
                    "calle": calle
                },
                success: function(respuesta){
                    velocidadPromedio = JSON.parse(respuesta); 
                }
            })
            console.log(velocidadPromedio)
            //Se obtiene de MySQL la lista de 24 horas de
            //vehiculos por hora
            let numeroVehiculos;
            $.ajax({
                url: "php/consulta_numero_vehiculos.php",
                type: "POST",
                async: false,
                data: {
                    "fecha": fecha,
                    "calle": calle
                },
                success: function(respuesta){
                    numeroVehiculos = JSON.parse(respuesta); 
                }
            })

            const labelHoras = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM",
                                "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
                                "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
                                "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];

            if(this.graficoCalle !== null){
                this.graficoCalle.destroy()
            }
        
            //Grafico de Velocidad
            const canvasCalle = document.getElementById('histograma-calle').getContext('2d');
            this.graficoCalle = new Chart(canvasCalle, {
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
    }
})