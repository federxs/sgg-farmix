(function () {
    angular
        .module('app')
        .factory('consultarInseminacionService', consultarInseminacionService);

    consultarInseminacionService.$inject = ['$http', 'portalService'];

    function consultarInseminacionService($http, portalService) {
        var service = {
            inicializar: inicializar,
            consultarHembrasServicio: consultarHembrasServicio,
            consultarServicioSinConfirmar: consultarServicioSinConfirmar,
            getInseminacionesXFechaInsem: getInseminacionesXFechaInsem,
            consultarPreniadasXParir: consultarPreniadasXParir,
            consultarLactanciasActivas,
            insert: insert,
            insertTacto: insertTacto
        };

        return service;

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Init'
            }).then(
           function (data) {
               return data.data || [];
           });
        }

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

        function getInseminacionesXFechaInsem() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/GetInseminacionesAgrupadasXFechaInsem'
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarPreniadasXParir() {
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

        function insert(inseminacion, listaVacas) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Inseminacion/Insert',
                params: {
                    inseminacion: inseminacion,
                    listaVacas: listaVacas,
                    listaToros: ''
                }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function insertTacto(tacto) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Tacto/Insert',
                params: {
                    tacto: tacto
                }
            }).then(
            function (data) {
                return data.data || [];
            });
        }
    }
})();