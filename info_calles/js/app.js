const app = new Vue({
    template:`
        <div class="pantalla">
            <mapa></mapa>
            <barra-menu @verHistogramas="abrirCerrar"></barra-menu>
            <histogramas @verHistogramas="abrirCerrar" v-if="verHistogramas === 1"></histogramas>
            <control-detalles></control-detalles>
        </div>
    `,
    data:{
        verHistogramas: 0
    },
    methods: {
        abrirCerrar: function(respuesta){
            this.verHistogramas = respuesta;
        }
    },
    el: "#app"
})