(function () {
    angular.module('app')
        .factory('consultarBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/BovinoConsultar/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/inicializar/:idAmbitoEstado/:idCampo',
                    headers: portalService.getHeadersServer(),
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado',
                        idCampo: '@idCampo'
                    },
                    isArray: false
                },
                obtenerListaBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/BovinoConsultar/getListaBovinos',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                },
                validarCantBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/verificarCantBovinosXAdmin',
                    params: {
                        campo: '@campo'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                eliminarBovino: {
                    method: 'PUT',
                    url: portalService.getUrlServer() + 'api/Bovino/Delete',
                    params: {
                        idBovino: '@idBovino',
                        codigoCampo: '@codigoCampo'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                generarPDF: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/BovinosExportarPDF',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                generarExcel: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/BovinosExportarExcel',
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