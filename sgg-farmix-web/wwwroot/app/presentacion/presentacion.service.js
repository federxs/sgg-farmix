(function () {
    'use strict';

    angular
        .module('app')
        .factory('presentacion', presentacion);

    presentacion.$inject = ['$http'];

    function presentacion($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();