Vue.component("histogramas-calles", {
    template: `
    <div id="modal-histogramas-calles">
        <div class="contenedor">
            <header>{{calle}}</header>
            <button @click="cerrarHistogramasCalles" class="cerrar-ventana pushy__btn pushy__btn--sm pushy__btn--red">x</button>

            <div class="contenido p-4">
                <button class="btn-control pushy__btn pushy__btn--sm"
                        @click="regresarMenuCalles">Regresar
                </button><br>

                <div class="d-flex justify-content-end">
                    <div style="width: 170px">
                        <div class="container">
                            <div class="row" style="border-radius: 10px !important;">
                                <div class="col-2 p-1 d-flex justify-content-center" 
                                    style="background: rgb(145, 67, 6)">
                                    
                                    <img src="img/fecha.png" width="20" height="20"></img>
                                </div>

                                <div class="col-7 p1" style="background: rgb(36, 36, 34)">
                                    {{this.fecha}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container-fluid mt-2">
                    <div class="row d-flex align-items-center justify-content-center">
                        <div class="col-11 p-0">
                            <canvas id="histograma-calle"></canvas>
                        </div>
                    </div>  
                </div>

                <div class="d-flex justify-content-end p-2">
                    <button class="pushy__btn pushy__btn--sm pushy__btn--blue">
                        Ver Ubicación
                    </button>
                </div>
            </div>
        </div>
    </div>
    `,
    props: ["calle","fecha"],
    methods: {
        cerrarHistogramasCalles: function(){
            let divHistogramasCalles = document.getElementById("modal-histogramas-calles");
            divHistogramasCalles.style.opacity = 0;
            divHistogramasCalles.style.visibility = "hidden";
        },
        regresarMenuCalles: function(){
            //Se hace invisible esta ventana y
            //se hace visible el menú.
            let divHistogramasCalles = document.getElementById("modal-histogramas-calles");
            divHistogramasCalles.style.opacity = 0;
            divHistogramasCalles.style.visibility = "hidden";

            let divMenuCalles = document.getElementById("modal-calles");
            divMenuCalles.style.opacity = 1;
            divMenuCalles.style.visibility = "visible";
        }
    }
})