(function () {
    'use strict';

    angular
        .module('app')
        .controller('resolverConflictoController', resolverConflictoController);

    resolverConflictoController.$inject = ['$scope', '$stateParams', 'resolverConflictoService', 'toastr'];

    function resolverConflictoController($scope, $stateParams, resolverConflictoService, toastr) {
        var vm = $scope;

        /////VARIABLES
        vm.eventoAnterior = {};
        vm.eventoResultante = {};
        vm.eventoNuevo = {};
        vm.maxDate = new Date();

        /////METODOS
        vm.init = init();
        vm.seleccionarEvento = seleccionarEvento;

        function init() {
            vm.showSpinner = true;
            if($stateParams)
            {
                if (!$stateParams.idInseminacion)
                    $stateParams.idInseminacion = 0;
                if (!$stateParams.idInseminConfl)
                    $stateParams.idInseminConfl = 0;
                resolverConflictoService.getDatos($stateParams.idEvento, $stateParams.idEventoConfl, $stateParams.idInseminacion, $stateParams.idInseminConfl).then(function success(data) {
                    vm.eventoAnterior = data.eventoAnterior;
                    vm.eventoNuevo = data.eventoNuevo;
                    vm.showSpinner = false;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function seleccionarEvento(evento) {
            vm.eventoResultante.fecha = evento.fecha;
            vm.eventoResultante.cantidad = evento.cantidad;
            vm.eventoResultante.tipoEvento = evento.tipoEvento;
            vm.eventoResultante.vacuna = evento.vacuna;
            vm.eventoResultante.antibiotico = evento.antibiotico;
            vm.eventoResultante.alimento = evento.alimento;
            vm.eventoResultante.rodeoDestino = evento.rodeoDestino;
            vm.eventoResultante.campoDestino = evento.campoDestino;
        }
    }
})();
