(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteBovinoController', reporteBovinoController);

    reporteBovinoController.$inject = ['$scope', 'reporteBovinoService', 'exportador'];

    function reporteBovinoController($scope, reporteBovinoService, exportador) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        vm.showSpinner = true;
        vm.disabledExportar = 'disabled';
        vm.bovinos = [];
        vm.itemsPorPagina = 50;


        inicializar()


        function inicializar() {
            //reporteBovinoService.inicializar({
            //    idAmbitoEstado: '1',
            //    idCampo: $localStorage.usuarioInfo.codigoCampo
            //}, function (data) {
            //    vm.rowCollection = data.bovinos;

            //    vm.showSpinner = true;
            //}, function error(error) {
            //    vm.showSpinner = false;
            //    toastr.error('Ha ocurrido un error, reintentar', 'Error');
            //});
        }//inicializar

        function exportarExcel() {
            var filtro = [];

            var titulos = [];
            titulos[0] = "N° Orden";
            titulos[1] = "N° Caravana";
            titulos[2] = "Sexo";
            titulos[3] = "Raza";
            titulos[4] = "Categoría";
            titulos[5] = "Edad";
            titulos[6] = "Peso (Kg)";
            titulos[7] = "Estado";
            titulos[8] = "Rodeo";

            var propiedades = [];
            propiedades[0] = "orden";
            propiedades[1] = "caravana";
            propiedades[2] = "sexo";
            propiedades[3] = "raza";
            propiedades[4] = "categoria";
            propiedades[5] = "edad";
            propiedades[6] = "peso";
            propiedades[7] = "estado";
            propiedades[8] = "rodeo";

            if (vm.rowCollection.length > 0) {
                var fecha = obtenerFechaDeHoy(fecha);
                exportador.exportarExcel('FARMIX-REPORTE DE BOVINOS ' + fecha, vm.rowCollection, titulos, filtro, propiedades, 'Bovinos', function () {
                    toastr.success("Se ha exportado con éxito", "Éxito");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDF() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Nro Caravana';
            filtro.Titulos[1] = 'Categoría';
            filtro.Titulos[2] = 'Sexo';
            filtro.Titulos[3] = 'Raza';
            filtro.Titulos[4] = 'Rodeo';
            filtro.Titulos[5] = 'Estado';
            filtro.Titulos[6] = 'Acción Peso';
            filtro.Titulos[7] = 'Peso (Kg)';

            var propiedades = [];
            propiedades[0] = "numCaravana";
            propiedades[1] = "categoriaNombre";
            propiedades[2] = "sexo";
            propiedades[3] = "razaNombre";
            propiedades[4] = "rodeoNombre";
            propiedades[5] = "estadoNombre";
            propiedades[6] = "peso";

           
                
            var fecha = new Date();
            fecha = convertirFecha(fecha);

            var tab_text = '<html><head></head><body>';
            tab_text += "<h1 style='align:center;'>Bovinos</h1>";
            tab_text = tab_text + "<div><table border='1px' style='font-size:6px; width:6000px;'>";
            //tab_text += "<tr><td style='text-align:center; font-size:20px' colspan='" + titulos.length + "'><b>" + tituloReporte + "</b></td></tr>" + "<tr></tr>";
            if (vm.filtro !== null) {
                var $html_filtro = "<thead><tr>";
                for (var i = 0; i < filtro.Titulos.length; i++) {
                    $html_filtro += "<td bgcolor='black' style='text-align:center; vertical-align:center'><b><font color='white'>" + filtro.Titulos[i] + "</font></b></td>";
                }
                $html_filtro += "</tr></thead>";
                var $body = "<tr>";
                for (var i = 0; i < filtro.length; i++) {
                    if (filtro[i] === null || typeof filtro[i] !== "object") {
                        var campo = filtro[i] !== null ? filtro[i] : "";
                        $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                    }
                }
                $body += "</tr></tbody>";
                var newhtml_filtro = $html_filtro.concat($body.toString()).concat("</table></div>");
                tab_text = tab_text + newhtml_filtro.toString();
                //tab_text = tab_text + "<tr></tr>" + "<tr></tr>";
            }
            tab_text += "<div style='border-width: 2px; border-style: dotted; padding: 1em; font-size:120%;line-height: 1.5em;'><table border='1px' style='font-size:5px; width:6000px'>";
            var $html = "<thead><tr>";
            $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Nro Caravana</font></b></td>";
            $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Categoría</font></b></td>";
            $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Sexo</font></b></td>";
            $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Raza</font></b></td>";
            $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Rodeo</font></b></td>";
            $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Estado</font></b></td>";
            $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Peso</font></b></td>";
            $html += "</tr></thead><tbody>";
            var $body = "<tr>";
            var data = vm.rowCollection;
            for (var j = 0; j < data.length; j++) {
                for (var property in data[j]) {
                    if (data[j].hasOwnProperty(property) && property !== "$$hashKey") {
                        if (propiedades.indexOf(property) > -1) {
                            var campo = data[j][property] !== "" ? data[j][property] : "";
                            $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                        }
                    }
                    else {
                        $body += "</tr>";
                        break;
                    }
                }
            }
            tab_text += "</tbody>";
            var newhtml = $html.concat($body.toString()).concat("</table></div>");
            tab_text = tab_text + newhtml.toString();
            tab_text = tab_text + '</body></html>';

            exportador.exportarPDF('Bovinos' + fecha, tab_text, function () {
                toastr.success("Se ha exportado con Éxito.", "ÉXITO");
            }, function (error) {
                vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }
    }

    function obtenerFechaDeHoy() {
        var fecha = new Date();
        var dia, mes, año;
        dia = fecha.getDate().toString();
        if (dia.length === 1)
            dia = '0' + dia;
        mes = (fecha.getMonth() + 1).toString();
        if (mes.length === 1)
            mes = '0' + mes;
        año = fecha.getFullYear().toString();
        return dia + '/' + mes + '/' + año;
    }

    vm.rowCollection = [
                {
                    "orden": 0,
                    "caravana": 25240,
                    "sexo": "male",
                    "raza": "Patti Tucker",
                    "categoria": "Dorothy Carver",
                    "edad": "1 años 12 meses",
                    "peso": 552,
                    "estado": "Lane Larsen",
                    "rodeo": "Connecticut"
                },
                {
                    "orden": 1,
                    "caravana": 12133,
                    "sexo": "male",
                    "raza": "Rosa Pennington",
                    "categoria": "Fran Tran",
                    "edad": "1 años 5 meses",
                    "peso": 326,
                    "estado": "Shelly Mclaughlin",
                    "rodeo": "Georgia"
                },
{
    "orden": 2,
    "caravana": 21973,
    "sexo": "female",
    "raza": "Holman Cooke",
    "categoria": "Terrell Goodwin",
    "edad": "3 años 5 meses",
    "peso": 300,
    "estado": "Carpenter Wiggins",
    "rodeo": "Indiana"
},
{
    "orden": 3,
    "caravana": 64729,
    "sexo": "male",
    "raza": "Petersen Greene",
    "categoria": "Wright Mcfadden",
    "edad": "3 años 4 meses",
    "peso": 417,
    "estado": "Francis Simon",
    "rodeo": "Idaho"
},
{
    "orden": 4,
    "caravana": 62834,
    "sexo": "female",
    "raza": "Morton Hanson",
    "categoria": "Hood Dominguez",
    "edad": "2 años 10 meses",
    "peso": 560,
    "estado": "Susanne Stevenson",
    "rodeo": "Delaware"
},
{
    "orden": 5,
    "caravana": 84504,
    "sexo": "female",
    "raza": "Justine Howard",
    "categoria": "Walls Johnson",
    "edad": "5 años 7 meses",
    "peso": 99,
    "estado": "Kennedy Rowland",
    "rodeo": "New York"
},
{
    "orden": 6,
    "caravana": 81637,
    "sexo": "male",
    "raza": "Kay James",
    "categoria": "Bishop Cooley",
    "edad": "4 años 1 meses",
    "peso": 680,
    "estado": "Rhea Oneil",
    "rodeo": "Minnesota"
},
{
    "orden": 7,
    "caravana": 5595,
    "sexo": "female",
    "raza": "Alexandria Swanson",
    "categoria": "Baldwin Nicholson",
    "edad": "2 años 5 meses",
    "peso": 648,
    "estado": "Christensen Brooks",
    "rodeo": "New Hampshire"
},
{
    "orden": 8,
    "caravana": 93355,
    "sexo": "male",
    "raza": "Powell Williamson",
    "categoria": "Noemi Walls",
    "edad": "3 años 7 meses",
    "peso": 287,
    "estado": "Sophia Holder",
    "rodeo": "Louisiana"
},
{
    "orden": 9,
    "caravana": 218,
    "sexo": "female",
    "raza": "Keller Santiago",
    "categoria": "Horne Miles",
    "edad": "5 años 3 meses",
    "peso": 635,
    "estado": "Velazquez Humphrey",
    "rodeo": "Federated States Of Micronesia"
},
{
    "orden": 10,
    "caravana": 65891,
    "sexo": "male",
    "raza": "Gena Castaneda",
    "categoria": "Leah Howell",
    "edad": "3 años 10 meses",
    "peso": 237,
    "estado": "Carey Bird",
    "rodeo": "South Dakota"
},
{
    "orden": 11,
    "caravana": 58320,
    "sexo": "male",
    "raza": "Hester Sutton",
    "categoria": "Lilly Daniels",
    "edad": "3 años 8 meses",
    "peso": 692,
    "estado": "Lott Fuentes",
    "rodeo": "Nevada"
},
{
    "orden": 12,
    "caravana": 13696,
    "sexo": "male",
    "raza": "Monique Rivera",
    "categoria": "Landry Irwin",
    "edad": "0 años 1 meses",
    "peso": 437,
    "estado": "Tania Duncan",
    "rodeo": "Rhode Island"
},
{
    "orden": 13,
    "caravana": 48749,
    "sexo": "female",
    "raza": "Helen Petty",
    "categoria": "Snider Meadows",
    "edad": "5 años 9 meses",
    "peso": 311,
    "estado": "Wilda Fox",
    "rodeo": "Northern Mariana Islands"
},
{
    "orden": 14,
    "caravana": 64846,
    "sexo": "female",
    "raza": "Roth Fields",
    "categoria": "Lelia Mckee",
    "edad": "4 años 0 meses",
    "peso": 551,
    "estado": "Ewing Huffman",
    "rodeo": "District Of Columbia"
},
{
    "orden": 15,
    "caravana": 89145,
    "sexo": "male",
    "raza": "Deann Ortega",
    "categoria": "Tamika Spence",
    "edad": "4 años 1 meses",
    "peso": 314,
    "estado": "Leonard Lopez",
    "rodeo": "Michigan"
},
{
    "orden": 16,
    "caravana": 96561,
    "sexo": "male",
    "raza": "Odessa Russell",
    "categoria": "Sheree Armstrong",
    "edad": "1 años 12 meses",
    "peso": 282,
    "estado": "Martinez Hopkins",
    "rodeo": "Kentucky"
},
{
    "orden": 17,
    "caravana": 22406,
    "sexo": "male",
    "raza": "Buckley Myers",
    "categoria": "Kristina Mcgowan",
    "edad": "1 años 0 meses",
    "peso": 128,
    "estado": "Marina Foster",
    "rodeo": "Vermont"
},
{
    "orden": 18,
    "caravana": 50288,
    "sexo": "female",
    "raza": "Gretchen Madden",
    "categoria": "Stone Webster",
    "edad": "1 años 6 meses",
    "peso": 260,
    "estado": "Leola Bennett",
    "rodeo": "Alaska"
}
    ];

}

})();