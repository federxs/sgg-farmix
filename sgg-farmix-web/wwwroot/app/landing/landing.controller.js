(function () {
    'use strict';

    angular
        .module('app')
        .controller('landingController', landingController);

    landingController.$inject = ['$scope'];

    function landingController($scope) {
        $scope.title = 'controller';

        activate();

        function activate() { }
    }
})();
