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
            eliminarInseminacion: eliminarInseminacion,
            generarPDFServSinConfirmar: generarPDFServSinConfirmar,
            generarExcelServSinConfirmar: generarExcelServSinConfirmar,
            generarPDFPreniadas: generarPDFPreniadas,
            generarExcelPreniadas: generarExcelPreniadas
        };

        return service;

        function inicializar(idCampo, periodo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Init',
                params: { idCampo: idCampo, periodo: periodo },
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarHembrasServicio() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/HembrasServicio',
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarServicioSinConfirmar(idCampo, periodo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/ServicioSinConfirmar',
                params: { idCampo: idCampo, periodo: periodo },
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function getInseminacionesXFechaInsem(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/GetInseminacionesAgrupadasXFechaInsem',
                params: { idCampo: idCampo },
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarPreniadasXParir(idCampo, periodo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/PreniadasPorParir',
                params: { idCampo: idCampo, periodo: periodo },
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function eliminarInseminacion(parametro) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Inseminacion/DeleteInseminacion',
                params: { parametro: parametro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function generarPDFServSinConfirmar(campo, codigoCampo, rango) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/ExportarServSinConfirmarPDF',
                params: { campo: campo, codigoCampo: codigoCampo, rango: rango },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function generarPDFPreniadas(campo, codigoCampo, periodo, rango) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/ExportarPreniadasPDF',
                params: { campo: campo, codigoCampo: codigoCampo, periodo: periodo, rango: rango },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function generarExcelServSinConfirmar(campo, codigoCampo, rango) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/ExportarServSinConfirmarExcel',
                params: { campo: campo, codigoCampo: codigoCampo, rango: rango },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function generarExcelPreniadas(campo, codigoCampo, periodo, rango) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/ExportarPreniadasExcel',
                params: { campo: campo, codigoCampo: codigoCampo, periodo: periodo, rango: rango },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
    }
})();