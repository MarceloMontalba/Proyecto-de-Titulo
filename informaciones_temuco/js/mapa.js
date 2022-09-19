const {LMap, LTileLayer, LTooltip, LPolyline, LMarker} = Vue2Leaflet;

/*Componentes de Leaflet que sera asignados a componentes creados localmente*/
Vue.component("lienzo", LMap);
Vue.component("tipo-mapa", LTileLayer);
Vue.component("cuadro", LTooltip);
Vue.component("poligono", LPolyline);

Vue.component("mapa",{
    template: `
        <lienzo class="mapa" ref="mapa" :zoom= zoom :center= posicion :options= opciones>
            <tipo-mapa :url="url"></tipo-mapa>


            <!--
            <div v-for="calle in buscarAltoTrafico('2018-06-11')">
                <poligono :lat-lngs="[calle[3]]">
                    <cuadro :options="{permanent: true}">
                        <center>
                            <b>{{calle[2]}}</b>
                            <br>
                                {{convertirMilisegundosHoras(calle[0])}} - 
                                {{convertirMilisegundosHoras(calle[1])}}
                        </center>
                    </cuadro>
                </poligono>
            -->
                    

            </div>

        </lienzo>
    `,
    data: function(){
        return{
            /*Configuraciones del mapa utilizado en leaflet*/
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 15,
            posicion: {
                lat: -38.73965, 
                lng: -72.59842
            },
            opciones:{
                attributionControl: false,
                zoomControl: false
            }
        }
    },
    props: ["fecha"],
    methods: {
        convertirMilisegundosHoras: function(milisegundos){
            horas    = parseInt(milisegundos/3600000)           
            minutos  = parseInt((milisegundos - horas*3600000)/60000)
            segundos = parseInt((milisegundos - horas*3600000 - minutos*60000)/1000)
            
            //Se convertira cada variable a tipo cadena.
            //Si solo tienen un digito se les antepone un 0.
            horas    = String(horas).length>1? String(horas) : "0" + String(horas)
            minutos  = String(minutos).length>1? String(minutos) : "0" + String(minutos)
            segundos = String(segundos).length>1? String(segundos) : "0" + String(segundos)
            
            //Se retorna la hora en formato HH:MM:SS
            return String(horas)+":"+String(minutos)+":"+String(segundos)
        },
        buscarAltoTrafico: function(fecha){
            //Se crea un diccionario con todas las calles disponibles en la base de datos.
            //Todas se inicializan con un numero de vehiculos 0.
            let diccionarioCalles;
            $.ajax({
                url: "php/consulta_calles.php",
                type: "POST",
                async: false,
                success: function(respuesta){
                    diccionarioCalles = JSON.parse(respuesta);
                }
            });

            let lugaresCongestionados = [];

            //Se analizan las 24 horas
            let horas = 0;
            while(horas<24){
                //Parte desde el minuto 0 y va saltando 15 minutos hasta cumplir
                //una hora (Todo en milisegundos). Se analizan tramos de 15 minutos.
                
                //milisegundo_inicio parte con 0 milisegundos, pero cuando se cumpla una hora
                //se debe pasar a la siguente, como ejemplo inicialmente de 00:00:00 se pasa a
                //01:00:00, es por ello que se suma el numero de horas * 36000000 milisegundos.
                //Esto mismo aplica para la misma suma realizada en el ciclo for.
                
                let transito = [];
                let milisegundoInicio = 0 + horas*3600000;
                for(let milisegundoFin=900000+horas*(3600000); milisegundoFin<4500000+horas*(3600000); milisegundoFin+=900000){        
                    //flujos almacena el volumen de vehiculos en las distintas calles cada 15 minutos.
                    let flujos = [];
                    $.ajax({
                        url: "php/consulta_vehiculos_tramo.php",
                        type: "POST",
                        async: false,
                        data:{
                            "fecha"       : fecha,
                            "horaInicial" : milisegundoInicio,
                            "horaFinal"   : milisegundoFin
                        },
                        success: function(respuesta){
                            flujos = JSON.parse(respuesta);
                        }
                    });
                  
                    let calles = Object.assign({}, diccionarioCalles);

                    //Se recorre cada una de las calles registradas en el tramo de tiempo X
                    //para registrar ese valor en el diccionario de calles.
                    flujos.forEach(calleRegistrada =>{
                        calles[calleRegistrada[0]] = parseInt(calleRegistrada[1]);
                    })
                    
                    transito.push([milisegundoInicio, milisegundoFin, calles]);
                    milisegundoInicio = milisegundoFin;
            
                }
                
                //El arreglo transito tiene 4 diccionarios que son 4 tramos de tiempo de 
                //15 minutos. En donde cada diccionario tiene cada calle registrada en la bd
                //con el valor correspondiente de vehiculos en dicho tramo de tiempo.
                
                //Es aqui donde se utiliza la teoria de flujo vehicular en cada calle.
                for(let nombreCalle in transito[0][2]){
                    //Se obtiene el volumne horario de la calle
                    let Q = 0;
                    transito.forEach(tramo =>{
                        Q += tramo[2][nombreCalle];
                    })
                    
                    //Solo las calles que fuerón transsitadas en algun tramo de hora se analizarán
                    if(Q !== 0){
                        let flujoPromedio = Q/transito.length;

                        transito.forEach(tramo => {
                            if(tramo[2][nombreCalle]>flujoPromedio){
                                let posicionCalle;
                                $.ajax({
                                    url: "php/consulta_posicion_calle.php",
                                    type: "POST",
                                    async: false,
                                    data:{
                                        "nombreCalle" : nombreCalle,
                                        "horaInicio"  : tramo[0],
                                        "horaFinal"   : tramo[1]
                                    },
                                    success: function(respuesta){
                                        posicionCalle = JSON.parse(respuesta);
                                    }
                                });

                                lugaresCongestionados.push([tramo[0], tramo[1], nombreCalle, posicionCalle]);
                            }  
                        })
                    }
                }

                horas += 1
            }
            return lugaresCongestionados;
        }
    }
})