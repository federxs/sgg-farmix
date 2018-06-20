(function () {
    'use strict';

    angular
        .module('app')
        .factory('landingService', landingService);

    landingService.$inject = ['$http'];

    function landingService($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();