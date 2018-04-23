(function () {
    'use strict';

    angular
        .module('app')
        .factory('presentacionService', presentacionService);

    presentacionService.$inject = ['$http'];

    function presentacionService($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();