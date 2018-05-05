(function () {
    'use strict';

    angular
        .module('app')
        .controller('resolverConflictoController', resolverConflictoController);

    resolverConflictoController.$inject = ['$scope'];

    function resolverConflictoController($scope) {
        var vm = this;

        activate();

        function activate() { }
    }
})();
