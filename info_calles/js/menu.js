Vue.component('barra-menu',{
    template: `
        <div class="barra-menu">
            <div class="opciones">
                <a class="modulo1">Zonas con Trafico</a>
                <a class="modulo2" @click="verPantallaHistogramas">Historial Transito</a>
                <a class="modulo3">Zonas de Riesgo</a>
            </div>
        </div>
    `,
    methods: {
        verPantallaHistogramas: function(){
            this.$emit("verHistogramas", 1);
        }
    }
})