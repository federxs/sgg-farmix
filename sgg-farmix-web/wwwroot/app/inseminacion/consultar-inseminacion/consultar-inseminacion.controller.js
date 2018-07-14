(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarInseminacionController', consultarInseminacionController);

    consultarInseminacionController.$inject = ['$scope', 'consultarInseminacionService', 'toastr', '$state', 'exportador', '$localStorage', '$location', '$anchorScroll', 'portalService'];

    function consultarInseminacionController($scope, consultarInseminacionService, toastr, $state, exportador, $localStorage, $location, $anchorScroll, portalService) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.showHembrasParaServicio = true;
        vm.showServiciosSinConfirm = false;
        vm.showHembrasPreniadas = false;
        vm.showServSinConfirm = true;
        vm.showProxPartos = true;
        vm.showLactanciasActivas = true;
        var vistoServSinConfirm = 1;
        var vistoPreniadas = 1;
        var proxPartos = [];
        var tituloExcel = ''
        var idInseminacionAEliminar = 0;
        var rangoConsulta = '';
        //metodos
        vm.inicializar = inicializar;
        vm.hembrasParaServicio = hembrasParaServicio;
        vm.serviciosSinConfirmar = serviciosSinConfirmar;
        vm.proximosPartos = proximosPartos;
        vm.lactanciasActivas = lactanciasActivas;
        vm.obtenerServSinConfirm = obtenerServSinConfirm;
        vm.obtenerProxPartos = obtenerProxPartos;
        vm.obtenerHembrasParaServicio = obtenerHembrasParaServicio;
        vm.obtenerLactanciasActivas = obtenerLactanciasActivas;
        vm.exportarExcelServSinConfirm = exportarExcelServSinConfirm;
        vm.exportarExcelVacasPreniadas = exportarExcelVacasPreniadas;
        vm.exportarPDFServSinConfirm = exportarPDFServSinConfirm;
        vm.exportarPDFVacasPreniadas = exportarPDFVacasPreniadas;
        vm.openPopUp = openPopUp;
        vm.eliminar = eliminar;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.showServSinConfirm = true;
            vm.showProxPartos = true;
            consultarInseminacionService.inicializar($localStorage.usuarioInfo.codigoCampo, $localStorage.usuarioInfo.periodoConsulta).then(function success(data) {
                vm.init = data;
                serviciosSinConfirmar();
                proximosPartos();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        }

        function hembrasParaServicio() {
            if (vm.showHembrasParaServicio)
                vm.showHembrasParaServicio = false;
            else
                vm.showHembrasParaServicio = true;
        }

        function serviciosSinConfirmar() {
            if (vistoServSinConfirm === 1) {
                vistoServSinConfirm = 0;
                vm.showServSinConfirm = true;
                consultarInseminacionService.consultarServicioSinConfirmar($localStorage.usuarioInfo.codigoCampo, $localStorage.usuarioInfo.periodoConsulta).then(
                function success(data) {
                    var fechaHoy = new Date();
                    fechaHoy = moment(convertirFecha(fechaHoy));
                    vm.serviciosSinConfirm = {};
                    vm.serviciosSinConfirm.menor60 = Enumerable.From(data).Where(function (x) {
                        var fechaInsem = x.fechaInseminacion.split('/');
                        fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                        return fechaHoy.diff(fechaInsem, 'days') < 60
                    }).Count();
                    vm.serviciosSinConfirm.entre90y60 = Enumerable.From(data).Where(function (x) {
                        var fechaInsem = x.fechaInseminacion.split('/');
                        fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                        return fechaHoy.diff(fechaInsem, 'days') >= 60 && fechaHoy.diff(fechaInsem, 'days') < 90
                    }).Count();
                    vm.serviciosSinConfirm.mas90 = Enumerable.From(data).Where(function (x) {
                        var fechaInsem = x.fechaInseminacion.split('/');
                        fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                        return fechaHoy.diff(fechaInsem, 'days') > 90
                    }).Count();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.init.serviciosSinConfirmar === 0) {
                toastr.info("En este momento no hay servicios sin confirmar", "Aviso");
                vm.showServSinConfirm = false;
            }
            else {
                vm.showServSinConfirm = false;
                vistoServSinConfirm = 1;
            }
        }

        //carga la tablita de servicios sin confirmar
        function obtenerServSinConfirm(rango) {
            $scope.$parent.blockSpinner();
            vm.showServiciosSinConfirm = true;
            vm.showHembrasPreniadas = false;
            vm.itemsPorPagina = 10;
            vm.rowCollection = [];
            var fechaHoy = new Date();
            fechaHoy = moment(convertirFecha(fechaHoy));
            consultarInseminacionService.getInseminacionesXFechaInsem($localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                switch (rango) {
                    case 'menor60':
                        rangoConsulta = 60;
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') < 60
                        }).ToArray();
                        tituloExcel = 'Servicios de menos de 60 días sin confirmar';
                        if (vm.rowCollection.length === 0) {
                            toastr.info("En este momento no hay servicios sin confirmar para ese rango de días", "Aviso");
                        }
                        break;
                    case 'entre90y60':
                        rangoConsulta = 6090;
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') >= 60 && fechaHoy.diff(fechaInsem, 'days') < 90
                        }).ToArray();
                        tituloExcel = 'Servicios de entre 60 y 90 días sin confirmar';
                        if (vm.rowCollection.length === 0) {
                            toastr.info("En este momento no hay servicios sin confirmar para ese rango de días", "Aviso");
                        }
                        break;
                    case 'mas90':
                        rangoConsulta = 90;
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') > 90
                        }).ToArray();
                        tituloExcel = 'Servicios de más de 90 días sin confirmar';
                        if (vm.rowCollection.length === 0) {
                            toastr.info("En este momento no hay servicios sin confirmar para ese rango de días", "Aviso");
                        }
                        break;
                }
                $location.hash('tablaServiciosSinConfirmar');
                $anchorScroll();
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        }

        function proximosPartos() {
            if (vistoPreniadas === 1) {
                vistoPreniadas = 0;
                vm.showProxPartos = true;
                var fechaHoy = new Date();
                vm.preniadasPorParir = {};
                fechaHoy = moment(convertirFecha(fechaHoy));
                consultarInseminacionService.consultarPreniadasXParir($localStorage.usuarioInfo.codigoCampo, $localStorage.usuarioInfo.periodoConsulta).then(
                function success(data) {
                    proxPartos = data;                    
                    vm.preniadasPorParir.prox10dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') < 10 && fechaParto.diff(fechaHoy, 'days') > 0
                    }).Count();
                    vm.preniadasPorParir.entre10y30dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 10 && fechaParto.diff(fechaHoy, 'days') < 30 && fechaParto.diff(fechaHoy, 'days') > 0
                    }).Count();
                    vm.preniadasPorParir.entre30y60dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 30 && fechaParto.diff(fechaHoy, 'days') < 60 && fechaParto.diff(fechaHoy, 'days') > 0
                    }).Count();
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.init.preniadasPorParir === 0) {
                vm.showProxPartos = false;
                toastr.info("En este momento no hay vacas preñadas por parir", "Aviso");
            }
            else {
                vm.showProxPartos = false;
                vistoPreniadas = 1;
            }

        }

        //carga a tablita de prox pariciones
        function obtenerProxPartos(rango) {            
            vm.showServiciosSinConfirm = false;
            vm.showHembrasPreniadas = true;
            vm.itemsPorPagina = 10;
            vm.rowCollection = [];
            var fechaHoy = new Date();
            fechaHoy = moment(convertirFecha(fechaHoy));
            switch (rango) {
                case 'prox10dias':
                    rangoConsulta = 10;
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') < 10
                    }).ToArray();
                    tituloExcel = 'Partos en los próximos 10 días';
                    if (vm.rowCollection.length === 0) {
                        toastr.info("En este momento no hay próximos partos para ese rango de días", "Aviso");
                    }
                    break;
                case 'entre10y30dias':
                    rangoConsulta = 1030;
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 10 && fechaParto.diff(fechaHoy, 'days') < 30
                    }).ToArray();
                    tituloExcel = 'Partos entre los próximos 10 y 30 días';
                    if (vm.rowCollection.length === 0) {
                        toastr.info("En este momento no hay próximos partos para ese rango de días", "Aviso");
                    }
                    break;
                case 'entre30y60dias':
                    rangoConsulta = 3060;
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 30 && fechaParto.diff(fechaHoy, 'days') < 60
                    }).ToArray();
                    tituloExcel = 'Partos entre los próximos 30 y 60 días';
                    if (vm.rowCollection.length === 0) {
                        toastr.info("En este momento no hay próximos partos para ese rango de días", "Aviso");
                    }
                    break;
            }
            $location.hash('tablaServiciosSinConfirmar');
            $anchorScroll();
        }

        function obtenerHembrasParaServicio() {
            if (vm.init.hembrasParaServicio)
                $state.go('home.detalleInseminacion', { fecha: null, desde: 'hembrasParaServ' });
            else
                toastr.info("En este momento no hay vacas listas para servicio", "Aviso");
        }

        function obtenerLactanciasActivas() {
            if (vm.init.lactanciasActivas > 0)
                $state.go('home.detalleInseminacion', { fecha: null, desde: 'lactanciasActivas' });
            else
                toastr.info("En este momento no hay vacas en lactancia para mostrar", "Aviso");
        }

        function lactanciasActivas() {
            if (vm.showLactanciasActivas)
                vm.showLactanciasActivas = false;
            else
                vm.showLactanciasActivas = true;
        }

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return año + '/' + mes + '/' + dia;
        }

        function exportarExcelServSinConfirm() {
            var titulos = [];
            titulos[0] = 'Tipo de Inseminación';
            titulos[1] = 'Fecha Inseminación';
            titulos[2] = 'Cantidad de bovinos que participaron';

            var propiedades = [];
            propiedades[0] = "tipoInseminacion";
            propiedades[1] = "fechaInseminacion";
            propiedades[2] = "cantidadVacas";

            if (vm.rowCollection.length > 0) {
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                exportador.exportarExcel(tituloExcel + fecha, vm.rowCollection, titulos, null, propiedades, tituloExcel, function () {
                    toastr.success("Se ha exportado con Éxito", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDFServSinConfirm() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            consultarInseminacionService.generarPDFServSinConfirmar($localStorage.usuarioInfo.campoNombre, $localStorage.usuarioInfo.codigoCampo, $localStorage.usuarioInfo.periodoConsulta, rangoConsulta)
                .then(function (data) {
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarExcelVacasPreniadas() {
            var titulos = [];
            titulos[0] = 'Tipo de Inseminación';
            titulos[1] = 'Fecha Inseminación';
            titulos[2] = 'Fecha estimada de parto';

            var propiedades = [];
            propiedades[0] = "tipoInseminacion";
            propiedades[1] = "fechaInseminacion";
            propiedades[2] = "fechaEstimadaParto";

            if (vm.rowCollection.length > 0) {
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                exportador.exportarExcel(tituloExcel + fecha, vm.rowCollection, titulos, null, propiedades, tituloExcel, function () {
                    toastr.success("Se ha exportado con Éxito", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDFVacasPreniadas() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            consultarInseminacionService.generarPDFPreniadas($localStorage.usuarioInfo.campoNombre, $localStorage.usuarioInfo.codigoCampo, $localStorage.usuarioInfo.periodoConsulta, rangoConsulta)
                .then(function (data) {
                    var path = data.nombre;
                    var link = document.createElement("a");
                    $(link).click(function (e) {
                        e.preventDefault();
                        window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                    });
                    $(link).click();
                    toastr.success('PDF generado con Éxito!', 'Éxito');
                    $scope.$parent.unBlockSpinnerGenerarArchivo();
                }, function error(error) {
                    $scope.$parent.unBlockSpinnerGenerarArchivo();
                    $scope.$parent.errorServicio(error.statusText);
                });
        };

        function openPopUp(fecha, id) {
            vm.fecha = fecha;
            if (id !== '')
                idInseminacionAEliminar = id;
            $('#modalConfirmEliminar').modal('show');
        }

        function eliminar() {
            $scope.$parent.blockSpinnerSave();
            var parametro = '';
            if (idInseminacionAEliminar !== 0)
                parametro = idInseminacionAEliminar;
            else
                parametro = vm.fecha;
            consultarInseminacionService.eliminarInseminacion(parametro).then(function success() {
                $('#modalConfirmEliminar').modal('hide');
                toastr.success('Inseminación eliminada con éxito', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminar').modal('hide');
                $scope.$parent.unBlockSpinnerSave();
                $scope.$parent.errorServicio(error.statusText);
            })
        }
    }
})();
