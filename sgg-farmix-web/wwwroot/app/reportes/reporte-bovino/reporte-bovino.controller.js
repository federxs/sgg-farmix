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