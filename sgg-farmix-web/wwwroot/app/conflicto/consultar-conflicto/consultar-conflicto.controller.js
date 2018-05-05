(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarConflictoController', consultarConflictoController);

    consultarConflictoController.$inject = ['$scope'];

    function consultarConflictoController($scope) {
        var vm = this;

        activate();

        function activate() { }
    }
})();
