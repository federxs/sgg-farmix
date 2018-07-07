(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteInseminacionController', reporteInseminacionController);

    reporteInseminacionController.$inject = ['$scope', 'reporteInseminacionService', '$stateParams', '$localStorage', '$state', 'toastr', 'portalService'];

    function reporteInseminacionController($scope, reporteInseminacionService, $stateParams, $localStorage, $state, toastr, portalService) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.itemsPorPagina = 50;
        vm.tablaActiva = $stateParams.tabla;

        vm.exportarHembrasServicioPDF = exportarHembrasServicioPDF;
        vm.exportarServiciosSinConfirmarPDF = exportarServiciosSinConfirmarPDF;
        vm.exportarLactanciasPDF = exportarLactanciasPDF;
        vm.exportarPreniadasPDF = exportarPreniadasPDF;
        inicializar()


        function inicializar() {
            if (vm.tablaActiva === 0) {
                reporteInseminacionService.getHembrasParaServir({
                    codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta
                }, function (data) {
                    vm.hembrasParaServir = data;
                    $scope.$parent.unBlockSpinner();
                    if (vm.hembrasParaServir.length === 0) {
                        toastr.info("No se ha encontrado ninguna Hembra para Servir", "Aviso");
                        $state.go('home.reportes');
                    }
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.tablaActiva === 1) {
                reporteInseminacionService.getLactanciasActivas({
                    codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta
                }, function (data) {
                    vm.lactanciasActivas = data;
                    $scope.$parent.unBlockSpinner();
                    if (vm.lactanciasActivas.length === 0) {
                        toastr.info("No se ha encontrado ninguna Lactancia activa", "Aviso");
                        $state.go('home.reportes');
                    }
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }

            else if (vm.tablaActiva === 2) {
                reporteInseminacionService.getPreniadas({
                    codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta
                }, function (data) {
                    vm.preniadas = data;
                    $scope.$parent.unBlockSpinner();
                    if (vm.preniadas.length === 0) {
                        toastr.info("No se ha encontrado ninguna vaca Preñada", "Aviso");
                        $state.go('home.reportes');
                    }
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.tablaActiva === 3) {
                reporteInseminacionService.getServiciosSinConfirmar({
                    codigoCampo: $localStorage.usuarioInfo.codigoCampo, periodo: $localStorage.usuarioInfo.periodoConsulta
                }, function (data) {
                    vm.serviciosSinConfirmar = data;
                    $scope.$parent.unBlockSpinner();
                    if (vm.serviciosSinConfirmar.length === 0) {
                        toastr.info("No se ha encontrado ningún Servicio sin Confirmar", "Aviso");
                        $state.go('home.reportes');
                    }
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
        };

        function exportarHembrasServicioPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarPDFHembrasServicio({
                campo: $localStorage.usuarioInfo.campoNombre,
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                    //window.location.href = portalService.getUrlServer() + '\\Archivos\\' + path;
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarServiciosSinConfirmarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarPDFServiciosSinConfirmar({
                campo: $localStorage.usuarioInfo.campoNombre,
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                    //window.location.href = portalService.getUrlServer() + '\\Archivos\\' + path;
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarLactanciasPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarPDFLactancias({
                campo: $localStorage.usuarioInfo.campoNombre,
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                    //window.location.href = portalService.getUrlServer() + '\\Archivos\\' + path;
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarPreniadasPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            reporteInseminacionService.generarPDFPreniadas({
                campo: $localStorage.usuarioInfo.campoNombre,
                codigoCampo: $localStorage.usuarioInfo.codigoCampo,
                periodo: $localStorage.usuarioInfo.periodoConsulta
            }, function (data) {
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                    //window.location.href = portalService.getUrlServer() + '\\Archivos\\' + path;
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };
    }
})();