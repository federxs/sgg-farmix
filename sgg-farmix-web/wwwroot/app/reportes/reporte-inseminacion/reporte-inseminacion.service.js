(function () {
    angular.module('app')
        .factory('reporteInseminacionService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Inseminacion/', {}, {
                getHembrasParaServir: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Inseminacion/HembrasServir',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'                        
                    },
                    isArray: true
                },
                getServiciosSinConfirmar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Inseminacion/ServiciosSinConfirmar',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: true
                },
                getLactanciasActivas: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Inseminacion/LactanciasActivas',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: true
                },
                getPreniadas: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Inseminacion/Preniadas',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: true
                },
                generarPDFHembrasServicio: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/InseminacionHembrasParaServirExportarPDF',
                    headers: portalService.getHeadersServer(),
                    params: {
                        campo: '@campo',
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: false
                },
                generarPDFServiciosSinConfirmar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/InseminacionServiciosSinConfirmarExportarPDF',
                    headers: portalService.getHeadersServer(),
                    params: {
                        campo: '@campo',
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: false
                },
                generarPDFLactancias: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/InseminacionLactanciasExportarPDF',
                    headers: portalService.getHeadersServer(),
                    params: {
                        campo: '@campo',
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: false
                },
                generarPDFPreniadas: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/InseminacionPreniadasExportarPDF',
                    headers: portalService.getHeadersServer(),
                    params: {
                        campo: '@campo',
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: false
                }
            });
        });
})();