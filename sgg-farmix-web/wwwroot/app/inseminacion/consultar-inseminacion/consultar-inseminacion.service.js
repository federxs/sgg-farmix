(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultar_inseminacion', consultar_inseminacion);

    consultar_inseminacion.$inject = ['$http'];

    function consultar_inseminacion($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();