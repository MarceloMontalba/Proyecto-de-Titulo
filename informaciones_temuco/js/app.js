const app = new Vue({
    template:`
        <div class="pantalla">
            <!--Componentes-->
            <mapa :fecha="fecha"></mapa>

            <histogramas-calles :calle="calleDeseada" 
                                :fecha="this.fecha.split('-')[2]+'/'+
                                        this.fecha.split('-')[1]+'/'+
                                        this.fecha.split('-')[0]">
            </histogramas-calles>
            
            <menu-histogramas-calles @calle="verHistogramaCalle"></menu-histogramas-calles>
            
            <histogramas-ciudad :fecha="this.fecha.split('-')[2]+'/'+
                                        this.fecha.split('-')[1]+'/'+
                                        this.fecha.split('-')[0]">
            </histogramas-ciudad>
            
            <control-detalles @fecha="recibirFecha"></control-detalles>
        </div>
    `,
    data:{
        fecha: "AAAA-MM-DD",
        calleDeseada: ""
    },
    methods: {
        recibirFecha: function(respuesta){
            this.fecha = respuesta;
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
                    fechaUltimoRegistro = respuesta; 
                }
            })

            //Al iniciar el control la primera vez
            //se dan respectivos valores de la ultima fecha
            //registrada al control del mapa.
            this.fecha = fechaUltimoRegistro;
        },
        verHistogramaCalle(calle){
            this.calleDeseada = calle;
        }
    },
    mounted: function(){
        this.buscarFechaUltimoRegistro();
    },
    el: "#app"
})