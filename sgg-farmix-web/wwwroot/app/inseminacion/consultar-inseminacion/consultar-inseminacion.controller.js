(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarInseminacionController', consultarInseminacionController);

    consultarInseminacionController.$inject = ['$scope', 'consultarInseminacionService', 'toastr'];

    function consultarInseminacionController($scope, consultarInseminacionService, toastr) {
        var vm = $scope;
        //variables
        vm.showSpinner = true;
        vm.showHembrasParaServicio = false;
        vm.showServiciosSinConfirm = false;
        vm.showHembrasPreniadas = false;
        vm.showServSinConfirm = true;
        vm.showProxPartos = true;
        vm.tablaHembrasParaServicio;
        var vistoServSinConfirm = 1;
        var vistoPreniadas = 1;
        var proxPartos = [];
        vm.itemsXPagHembrasServ = 10;
        vm.itemsXPagLactAct = 10;
        vm.options = [10, 20, 30, 50];
        //metodos
        vm.inicializar = inicializar;
        vm.hembrasParaServicio = hembrasParaServicio;
        vm.serviciosSinConfirmar = serviciosSinConfirmar;
        vm.proximosPartos = proximosPartos;
        vm.lactanciasActivas = lactanciasActivas;
        vm.obtenerServSinConfirm = obtenerServSinConfirm;
        vm.obtenerProxPartos = obtenerProxPartos;
        vm.insert = insert;
        inicializar();

        function inicializar() {
            vm.showSpinner = true;
            vm.showServSinConfirm = true;
            vm.showProxPartos = true;
            consultarInseminacionService.inicializar().then(function success(data) {
                vm.init = data;
                serviciosSinConfirmar();
                proximosPartos();
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function hembrasParaServicio() {
            mostrarTablaActual('HembrasServicio');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }

        function serviciosSinConfirmar() {
            if (vistoServSinConfirm === 1) {
                vistoServSinConfirm = 0;
                vm.showServSinConfirm = true;
                consultarInseminacionService.consultarServicioSinConfirmar().then(
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
                    //vm.showSpinner = false;
                }, function error(error) {
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
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
            vm.showServiciosSinConfirm = true;
            vm.showHembrasPreniadas = false;
            vm.itemsPorPagina = 10;
            vm.rowCollection = [];
            var fechaHoy = new Date();
            fechaHoy = moment(convertirFecha(fechaHoy));
            consultarInseminacionService.getInseminacionesXFechaInsem().then(function success(data) {
                switch (rango) {
                    case 'menor60':
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') < 60
                        }).ToArray();
                        break;
                    case 'entre90y60':
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') >= 60 && fechaHoy.diff(fechaInsem, 'days') < 90
                        }).ToArray();
                        break;
                    case 'mas90':
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') > 90
                        }).ToArray();
                        break;
                }
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function proximosPartos() {
            if (vistoPreniadas === 1) {
                vistoPreniadas = 0;
                vm.showProxPartos = true;
                consultarInseminacionService.consultarPreniadasXParir().then(
                function success(data) {
                    proxPartos = data;
                    var fechaHoy = new Date();
                    vm.preniadasPorParir = {};
                    fechaHoy = moment(convertirFecha(fechaHoy));
                    vm.preniadasPorParir.prox10dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') < 10
                    }).Count();
                    vm.preniadasPorParir.entre10y30dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 10 && fechaParto.diff(fechaHoy, 'days') < 30
                    }).Count();
                    vm.preniadasPorParir.entre30y60dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 30 && fechaParto.diff(fechaHoy, 'days') < 60
                    }).Count();
                    vm.showSpinner = false;
                }, function error(error) {
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
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
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') < 10
                    }).ToArray();
                    break;
                case 'entre10y30dias':
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 10 && fechaParto.diff(fechaHoy, 'days') < 30
                    }).ToArray();
                    break;
                case 'entre30y60dias':
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 30 && fechaParto.diff(fechaHoy, 'days') < 60
                    }).ToArray();
                    break;
            }
        }

        function lactanciasActivas() {
            mostrarTablaActual('LactanciasActivas');
            //consultarInseminacionService.consultarHembrasServicio().then(
            //function success(data){
            //
            //vm.showSpinner = false;
            //});
        }

        function insert() {
            var inseminacion = { tipoInseminacion: 1 };
            var lista = [33, 34];
            consultarInseminacionService.insert(inseminacion, lista.toString()).then(function success(data) {
                var hola = data;
            })
        }

        //Puede ser 'HembraServicio', 'ServiciosSinConfirmar','PreniadasPorParir' o 'LactanciasActivas'
        function mostrarTablaActual(tablaActual) {
            if (mostrarServiciosYVacas === true) {
                mostrarServiciosYVacas = false;
            }
            if (tablaActual === 'HembrasServicio') {
                mostrarTablaHembrasServicio = true;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'ServiciosSinConfirmar') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = true;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'PreniadasPorParir') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = true;
                mostrarTablaLactanciasActivas = false;
            }
            if (tablaActual === 'LactanciasActivas') {
                mostrarTablaHembrasServicio = false;
                mostrarTablaServiciosSinConfirmar = false;
                mostrarTablaPreniadasPorParir = false;
                mostrarTablaLactanciasActivas = true;
            }
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
    }
})();
