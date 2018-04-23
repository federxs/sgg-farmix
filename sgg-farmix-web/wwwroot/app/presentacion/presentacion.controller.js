(function () {
    'use strict';

    angular
        .module('app')
        .controller('presentacionController', presentacionController);

    presentacionController.$inject = ['$scope', 'presentacionService'];

    function presentacionController($scope, presentacionService) {
        var vm = $scope;
        vm.texto = "prueba";
        vm.init = init;

        function init() {
            vm.texto = vm.texto + "1";
        }
    }
})();
