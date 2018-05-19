(function () {
    'use strict';

    angular
        .module('app')
        .controller('resolverConflictoController', resolverConflictoController);

    resolverConflictoController.$inject = ['$scope', '$stateParams', 'resolverConflictoService', 'toastr'];

    function resolverConflictoController($scope, $stateParams, resolverConflictoService, toastr) {
        var vm = $scope;

        /////VARIABLES
        vm.inseminacionAnterior = {
            fechaInseminacion: new Date(),
            tipoInseminacion: 'Montura'
        };
        vm.inseminacionResultante = {};
        vm.inseminacionNueva = {
            fechaInseminacion: new Date(),
            tipoInseminacion: 'Artificial'
        };
        vm.tactoAnterior = {
            fechaTacto: '',
            exitoso: '',
            tipoTacto: ''
        };
        vm.tactoResultante = {};
        vm.tactoNuevo = {
            fechaTacto: '',
            exitoso: '',
            tipoTacto: ''
        };
        //vm.inseminacionAnterior.fechaInseminacion = "01-01-1994";

        /////METODOS
        vm.init = init();
        vm.seleccionarInseminacion = seleccionarInseminacion;
        vm.seleccionarTacto = seleccionarTacto;
        vm.seleccionarPropiedadInseminacion = seleccionarPropiedadInseminacion;
        vm.seleccionarPropiedadTacto = seleccionarPropiedadTacto;
        vm.isUndefinedOrNull = isUndefinedOrNull;

        function init() {
            vm.showSpinner = true;
            if ($stateParams) {
                if (!$stateParams.idInseminacion)
                    $stateParams.idInseminacion = 0;
                if (!$stateParams.idInseminConfl)
                    $stateParams.idInseminConfl = 0;
                resolverConflictoService.getDatos($stateParams.idinseminacion, $stateParams.idinseminacionConfl, $stateParams.idInseminacion, $stateParams.idInseminConfl).then(function success(data) {
                    vm.inseminacionAnterior = data.inseminacionAnterior;
                    vm.inseminacionNueva = data.inseminacionNueva;
                    vm.showSpinner = false;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
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
