(function () {
    'use strict';

    angular
        .module('app')
        .controller('resolverConflictoController', resolverConflictoController);

    resolverConflictoController.$inject = ['$scope', '$stateParams', 'resolverConflictoService', 'toastr'];

    function resolverConflictoController($scope, $stateParams, resolverConflictoService, toastr) {
        var vm = $scope;

        /////VARIABLES
        vm.eventoAnterior = {
            fecha: "01-01-1994",
            cantidad: 23,
            tipoEvento: "Manejo2",
            vacuna: "Antirrabica",
            campoDestino: "CampoLukiense",
            antibiotico: "Paracetamol",
            alimento: "Alfafafa",
            rodeoDestino: "Rodeopijudo"
        };
        //vm.eventoAnterior.fechaInseminacion = "01-01-1994";
        vm.eventoResultante = {};
        vm.eventoNuevo = {
            fecha: "01-01-1999",
            cantidad: 234,
            tipoEvento: "Manejo1",
            vacuna: "Antirrabica1",
            campoDestino: "CampoDeLurulu",
            antibiotico: "Merca",
            alimento: "Alfafita",
            rodeoDestino: "Rodeocacon"
        };
        vm.maxDate = new Date();

        /////METODOS
        vm.init = init();
        vm.seleccionarEvento = seleccionarEvento;
        vm.seleccionarPropiedad = seleccionarPropiedad;
        vm.isUndefinedOrNull = isUndefinedOrNull;

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

        function seleccionarPropiedad(evento, propiedad) {
            vm.eventoResultante[propiedad] = evento[propiedad];
        }

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null
        }
    }
})();
