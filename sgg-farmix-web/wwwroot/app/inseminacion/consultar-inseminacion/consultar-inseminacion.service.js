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
            eliminarInseminacion: eliminarInseminacion
        };

        return service;

        function inicializar(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Init',
                params: {idCampo: idCampo}
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

        function consultarServicioSinConfirmar(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/ServicioSinConfirmar',
                params: { idCampo: idCampo }
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function getInseminacionesXFechaInsem(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/GetInseminacionesAgrupadasXFechaInsem',
                params: { idCampo: idCampo }
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarPreniadasXParir(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/PreniadasPorParir',
                params: { idCampo: idCampo }
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

        function eliminarInseminacion(parametro) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Inseminacion/DeleteInseminacion',
                params: { parametro: parametro }
            }).then(
            function (data) {
                return data.data || [];
            });
        }
    }
})();