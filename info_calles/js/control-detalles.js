Vue.component("control-detalles", {
    template: `
        <div class="control-detalles">
            <div class="container-fluid">
                <div class="row control-titulo">
                    <div class="col-12 p-1 d-flex justify-content-center">
                        <label>Control de Detalles</label>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-12 control-subtitulo d-flex justify-content-center mb-2">
                        <label>Intervalo de fechas a Observar</label>
                    </div>

                    <div class="col-12">
                            <div class="form-group row d-flex justify-content-center">
                                <label class="col-1 p-1 col-form-label">Inicio</label>
                                <div class="col-4">
                                    <input type="text" 
                                        class="mi-control form-control form-control-sm" 
                                        id="fecha-inicio"
                                    >
                                </div>

                                <label class="col-1  p-1 col-form-label">Final</label>
                                <div class="col-4">
                                    <input type="text" 
                                        class="mi-control form-control form-control-sm"
                                        id="fecha-final"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    `,
    mounted: function(){
        const fechaInicio = new Pikaday({
            field: document.getElementById("fecha-inicio"),
            format: 'DD/MM/YYYY'
        });

        const fechaFinal = new Pikaday({
            field: document.getElementById("fecha-final"),
            format: 'DD/MM/YYYY'
        });
    }
})