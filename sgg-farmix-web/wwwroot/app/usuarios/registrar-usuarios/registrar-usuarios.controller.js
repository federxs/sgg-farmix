(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarUsuariosController', registrarUsuariosController);

    registrarUsuariosController.$inject = ['$scope'];

    function registrarUsuariosController($scope) {
        var vm = $scope;

        activate();

        function activate() { }
    }
})();
