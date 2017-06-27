(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarBovinoController', consultarBovinoController);

    consultarBovinoController.$inject = ['$scope'];

    function consultarBovinoController($scope) {
        var vm = $scope;
        vm.list = [{
            index: 1,
            name: 'Fede',
            email: 'fpradomaca@gma.com'
        }, {
            index: 2,
            name: 'loco',
            email: 'fsddomaca@gma.com'
        }];
        vm.config = {
            itemsPerPage: 5,
            fillLastPage: true
        }
    }
})();