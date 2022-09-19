Vue.component("histogramas-ciudad", {
    template: `
        <div id="modal-ciudad">
            <div class="contenedor">
                <header>Ciudad de Temuco</header>
                <button @click="cerrarHistogramasCiudad" class="cerrar-ventana pushy__btn pushy__btn--sm pushy__btn--red">x</button>

                <div class="contenido container p-4">
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
                </div>
                
                <div class="container-fluid mt-2">
                    <div class="row d-flex align-items-center justify-content-center">
                        <div class="col-11 p-0">
                            <canvas id="histograma-ciudad"></canvas>
                        </div>
                    </div>  
                </div>

            </div>
        </div>
    `,
    props: ["fecha"],
    methods: {
        cerrarHistogramasCiudad: function(){
            let divHistogramasCiudad = document.getElementById("modal-ciudad");
            divHistogramasCiudad.style.opacity = 0;
            divHistogramasCiudad.style.visibility = "hidden";
        }
    }
})