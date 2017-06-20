(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope'];

    function registrarBovinoController($scope) {
        var ctrl = $scope;
        ctrl.nombre = 'prueba';

        activate();

        function activate() { }
    }
})();