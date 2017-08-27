(function () {
    'use strict';

    angular
        .module('app')
        .controller('dashboardController', inicioController);

    inicioController.$inject = ['$scope', 'inicioService', '$stateParams'];

    function inicioController($scope, inicioService, toastr, $state) {
        var vm = this;
        vm.title = 'dashboard';

        activate();

        function activate() { }
    }
})();
