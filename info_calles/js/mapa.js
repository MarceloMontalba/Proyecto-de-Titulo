const {LMap, LTileLayer, LMarker, LTooltip, LPolyline} = Vue2Leaflet;

/*Componentes de Leaflet que sera asignados a componentes creados localmente*/
Vue.component("componente-mapa", LMap);
Vue.component("componente-tipo", LTileLayer);
Vue.component("componente-marcador", LMarker);
Vue.component("componente-titulo", LTooltip);
Vue.component("componente-linea", LPolyline);

Vue.component("mapa",{
    template: `
        <componente-mapa class="mapa" ref="mapa" :zoom= zoom :center= posicion :options= opciones>
            <componente-tipo :url="url"></componente-tipo>
            
            <div v-for="tramo in this.puntos">
                <componente-linea :lat-lngs="[[tramo.lat1, tramo.lon1],
                                              [tramo.lat2, tramo.lon2]]" 
                                color="#7d0a0a">
                </componente-linea>
            </div>

        </componente-mapa>
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
            },
            puntos: []
        }
    },
    mounted: function(){
        let fechaUltimoRegistro;

        //Se procede a obtener la fecha del ultimo registro
        $.ajax({
            url: "php/consulta_ultimo_registro.php",
            type: "POST",
            async: false,
            data: {},
            success: function(respuesta){
                // Se almacena en el formato MM/DD/YYYY
                fechaUltimoRegistro = respuesta.slice(5,7)+"/"+respuesta.slice(8,10)+"/"+respuesta.slice(0,4);
                fechaUltimoRegistro = new Date(fechaUltimoRegistro)
            }
        })
        
        //Un dia en milisegundos
        let diaMilisegundos = 1000 * 60 * 60 * 24;
        fechaUltimoRegistroMilisegundos = fechaUltimoRegistro.getTime();

        //Se obtiene la fecha de 2 semanas atras
        let fechaLimite = new Date(fechaUltimoRegistroMilisegundos - (14 * diaMilisegundos));

        //Se convierten fechas a formato utilizado en MySQL: YYYY-MM-DD
        let yearAux = String(fechaUltimoRegistro.getFullYear());
        let mesAux  = String(fechaUltimoRegistro.getMonth());
        let diaAux  = String(fechaUltimoRegistro.getDate());

        fechaUltimoRegistro = yearAux + "-";
        fechaUltimoRegistro += mesAux.length < 2 ? "0"+ (parseInt(mesAux) + 1) +"-" : (parseInt(mesAux) + 1) +"-";
        fechaUltimoRegistro += diaAux.length < 2 ? "0"+ diaAux: diaAux;

        
        yearAux = String(fechaLimite.getFullYear());
        mesAux  = String(fechaLimite.getMonth());
        diaAux  = String(fechaLimite.getDate());

        fechaLimite = yearAux + "-";
        fechaLimite += mesAux.length < 2 ? "0"+ (parseInt(mesAux) + 1) +"-" : (parseInt(mesAux) + 1) +"-";
        fechaLimite += diaAux.length < 2 ? "0"+ diaAux: diaAux;
             
        this.buscarAltoTrafico(fechaLimite, fechaUltimoRegistro);
    },
    methods: {
        buscarAltoTrafico: function(fechaInicio, fechaFin){
            let tramos = [];

            $.ajax({
                url: "php/consulta_latitud_longitud.php",
                type: "POST",
                async: false,
                data:{
                    "fecha_inicio": fechaInicio,
                    "fecha_fin"   : fechaFin
                },
                success: function(respuesta){
                    let fila = JSON.parse(respuesta);

                    for(let i=0; i<fila.length; i++){
                        //Si existe otra fila y si el id de la fila actual es igual al 
                        //de la siguiente.
                        if(i+1<fila.length && fila[i][0]===fila[i+1][0]){

                            let tramo = {
                                id: fila[i][0],
                                lat1: parseFloat(fila[i][1]),
                                lon1: parseFloat(fila[i][2]),
                                velo1: parseInt(fila[i][3]),
                                fecha1: fila[i][4],
                                hora1: fila[i][5],

                                lat2: parseFloat(fila[i+1][1]),
                                lon2: parseFloat(fila[i+1][2]),
                                velo2: parseInt(fila[i+1][3]),
                                fecha2: fila[i+1][4],
                                hora2: fila[i+1][5],
                            }

                            tramos.push(tramo);
                        }
                    }
                }
            })

            let puntosInteres = []
            tramos.forEach(tramo => {
                let horaInicio = tramo.hora1.split(":");
                let horaFinal  = tramo.hora2.split(":");
                
                //Se convierten a milisegundos
                horaInicio = parseInt(horaInicio[0])*3600000 + 
                             parseInt(horaInicio[1])*60000  +
                             parseInt(horaInicio[2] *1000);

                horaFinal  = parseInt(horaFinal[0])*3600000 + 
                             parseInt(horaFinal[1])*60000  +
                             parseInt(horaFinal[2] *1000);
                
                let tiempoTranscurrido   = horaFinal-horaInicio;
                let latitudTranscurrida  = Math.abs(tramo.lat1-tramo.lat2);
                let longitudTranscurrida = Math.abs(tramo.lon1-tramo.lon2);

                
                //Si en el tramo han pasado 5 minutos o más y
                //solo se ha avanzado una calle o menos
                if(tiempoTranscurrido>=(5*60000) && latitudTranscurrida<0.00080 && longitudTranscurrida<0.00080){
                    puntosInteres.push(tramo);
                }
            })

            this.puntos = puntosInteres;
        }
    }
})