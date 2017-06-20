(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', controller);

    registrarBovinoController.$inject = ['$scope'];

    function registrarBovinoController($scope) {
        var ctrl = this;
        ctrl.nombre = 'prueba';

        activate();

        function activate() { }
    }
})();