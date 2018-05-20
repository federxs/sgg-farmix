(function () {
    'use strict';

    angular
        .module('app')
        .controller('resolverConflictoController', resolverConflictoController);

    resolverConflictoController.$inject = ['$scope', '$stateParams', 'resolverConflictoService', 'toastr'];

    function resolverConflictoController($scope, $stateParams, resolverConflictoService, toastr) {
        var vm = $scope;

        /////VARIABLES
        vm.inseminacionResultante = {};
        vm.tactoResultante = {};

        /////METODOS
        vm.init = init();
        vm.seleccionarInseminacion = seleccionarInseminacion;
        vm.seleccionarTacto = seleccionarTacto;
        vm.seleccionarPropiedadInseminacion = seleccionarPropiedadInseminacion;
        vm.seleccionarPropiedadTacto = seleccionarPropiedadTacto;
        vm.isUndefinedOrNull = isUndefinedOrNull;

        function init() {
            vm.showSpinner = true;
            if (($stateParams.idTacto && $stateParams.idTactoConfl && $stateParams.fechaTacto && $stateParams.fechaTactoConfl) || ($stateParams.idInseminacion && $stateParams.idInseminConfl)) {
                if (!$stateParams.idTacto)
                    $stateParams.idTacto = 0;
                if (!$stateParams.idTactoConfl)
                    $stateParams.idTactoConfl = 0;
                if (!$stateParams.idInseminacion)
                    $stateParams.idInseminacion = 0;
                if (!$stateParams.idInseminConfl)
                    $stateParams.idInseminConfl = 0;
                if (!$stateParams.fechaTacto)
                    $stateParams.fechaTacto = '';
                if (!$stateParams.fechaTactoConfl)
                    $stateParams.fechaTactoConfl = '';
                resolverConflictoService.getDatos($stateParams.idTacto, $stateParams.fechaTacto, $stateParams.idTactoConfl, $stateParams.fechaTactoConfl, $stateParams.idInseminacion, $stateParams.idInseminConfl).then(function success(data) {
                    vm.tactoAnterior = data.tactoAnterior; //Es el ultimo tacto registrado en base
                    vm.tactoNuevo = data.tactoNuevo; //Es el tacto que se intento registrar en base, pero produjo un conflicto
                    vm.inseminacionAnterior = data.inseminacionAnterior; //Es la ultima inseminacion registrada en base
                    vm.inseminacionNueva = data.inseminacionNueva; //Es la inseminacion que se intento registrar pero produjo un conflicto
                    vm.showSpinner = false;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
            else
                vm.showSpinner = false;
        }

        function seleccionarInseminacion(inseminacion) {
            vm.inseminacionResultante.fechaInseminacion = inseminacion.fechaInseminacion;
            vm.inseminacionResultante.tipoInseminacion = inseminacion.tipoInseminacion;
        }

        function seleccionarTacto(tacto) {
            vm.tactoResultante.fechaTacto = tacto.fechaTacto;
            vm.tactoResultante.tipoTacto = tacto.tipoTacto;
            vm.tactoResultante.exitoso = tacto.exitoso;
        }

        function seleccionarPropiedadInseminacion(inseminacion, propiedad) {
            vm.inseminacionResultante[propiedad] = inseminacion[propiedad];
        }

        function seleccionarPropiedadTacto(tacto, propiedad) {
            vm.tactoResultante[propiedad] = tacto[propiedad];
        }

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null
        }
    }
})();
