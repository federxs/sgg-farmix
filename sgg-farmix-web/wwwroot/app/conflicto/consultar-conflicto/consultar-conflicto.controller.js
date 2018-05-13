(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarConflictoController', consultarConflictoController);

    consultarConflictoController.$inject = ['$scope', 'ConsultarConflictoService'];

    function consultarConflictoController($scope, ConsultarConflictoService) {
        var vm = this;

        vm.init = init();
        init();

        function init() {
            vm.showSpinner = true;

            /* ConsultarConflictoService.obtenerConflictos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                 if (data.length === 0) {
                     vm.disabledExportar = 'disabled';
                     vm.showSpinner = false;
                     vm.disabled = '';
                     vm.rowCollection = [];
                     toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
 
                 }
                 else {
                     vm.rowCollection = data;
                     vm.showSpinner = false;
                     vm.disabled = '';
                     vm.disabledExportar = '';
                 }, function (error) {
                     vm.showSpinner = false;
                     toastr.error('Ha ocurrido un error, reintentar', 'Error');
                 });
             });*/

            vm.rowCollection = [
                {
                    idConflicto:1,
                    fecha: "asdasd",
                    tipoEvento: "asdasd"

                }, {
                    idConflicto:2,
                    fecha: "asdasd1",
                    tipoEvento: "asdasd1"
                }, {
                    idConflicto:3,
                    fecha: "asdasd2",
                    tipoEvento: "asdasd2"
                }, {
                    idConflicto:4,
                    fecha: "asdasd3",
                    tipoEvento: "asdasd3"
                }, {
                    idConflicto:5,
                    fecha: "asdasd4",
                    tipoEvento: "asdasd4"
                }
            ];
        }
    }
})();
