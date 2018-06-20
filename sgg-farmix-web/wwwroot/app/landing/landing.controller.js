(function () {
    'use strict';

    angular
        .module('app')
        .controller('presentacionController', presentacionController);

    presentacionController.$inject = ['$scope'];

    function presentacionController($scope) {
        var vm = this;
        vm.title = 'caca';

        activate();

        function activate() { }
    }
})();
