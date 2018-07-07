(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarReportesController', consultarReportesController);

    consultarReportesController.$inject = ['$scope', '$state'];

    function consultarReportesController($scope, $state) {
        var vm = $scope;
        vm.irAReportesInseminacion = irAReportesInseminacion;
        $scope.$parent.unBlockSpinner();

        function irAReportesInseminacion(tabla) {
            $scope.$parent.blockSpinner();
            $('#modalReporteInseminaciones').modal('hide');
            $state.go('home.reporteInseminacion', { tabla: tabla });
        }
    }
    
})();
