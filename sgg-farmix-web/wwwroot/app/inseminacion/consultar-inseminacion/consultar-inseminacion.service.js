(function () {
    angular
        .module('app')
        .factory('consultarInseminacionService', consultarInseminacionService);

    consultarInseminacionService.$inject = ['$http', 'portalService'];

    function consultarInseminacionService($http, portalService) {
        var service = {
            inicializar: inicializar,
            consultarHembrasServicio,
            consultarServicioSinConfirmar,
            consultarPreniadasPorParir,
            consultarLactanciasActivas
        };

        return service;

        function inicializar() { }

        function consultarHembrasServicio() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/HembrasServicio'
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarServicioSinConfirmar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/ServicioSinConfirmar'
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarPreniadasPorParir() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/PreniadasPorParir'
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarLactanciasActivas() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/LactanciasActivas'
            }).then(
           function (data) {
               return data.data || [];
           });
        }
    }
})();