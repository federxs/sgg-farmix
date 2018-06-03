(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarInseminacionController', consultarInseminacionController);

    consultarInseminacionController.$inject = ['$scope', 'consultarInseminacionService', 'toastr', '$state', 'exportador', '$localStorage'];

    function consultarInseminacionController($scope, consultarInseminacionService, toastr, $state, exportador, $localStorage) {
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
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.showServSinConfirm = true;
            vm.showProxPartos = true;
            consultarInseminacionService.inicializar($localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                vm.init = data;
                serviciosSinConfirmar();
                proximosPartos();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
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
                consultarInseminacionService.consultarServicioSinConfirmar($localStorage.usuarioInfo.codigoCampo).then(
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
                    $scope.$parent.unBlockSpinner();
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
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function proximosPartos() {
            if (vistoPreniadas === 1) {
                vistoPreniadas = 0;
                vm.showProxPartos = true;
                var fechaHoy = new Date();
                vm.preniadasPorParir = {};
                fechaHoy = moment(convertirFecha(fechaHoy));
                consultarInseminacionService.consultarPreniadasXParir($localStorage.usuarioInfo.codigoCampo).then(
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
                    //vm.showSpinner = false;
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
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
                    tituloExcel = 'Partos en los próximos 10 días';
                    if (vm.rowCollection.length === 0) {
                        toastr.info("En este momento no hay próximos partos para ese rango de días", "Aviso");
                    }
                    break;
                case 'entre10y30dias':
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
            var propiedades = [];
            propiedades[0] = "tipoInseminacion";
            propiedades[1] = "fechaInseminacion";
            propiedades[2] = "cantidadVacas";

            if (vm.rowCollection.length > 0) {
                var fecha = new Date();
                fecha = convertirFecha(fecha);

                var tab_text = '<html><head></head><body>';
                tab_text += "<h1 style='align:center;'>" + tituloExcel + "</h1>";
                //tab_text = tab_text + "<div><table border='1px' style='font-size:6px; width:10px;'>";
                //if (vm.filtro !== null) {
                //    var $html_filtro = "<thead><tr><td></td>";
                //    //for (var i = 0; i < filtro.Titulos.length; i++) {
                //    //    $html_filtro += "<td bgcolor='black' style='text-align:center; vertical-align:center'><b><font color='white'>" + filtro.Titulos[i] + "</font></b></td>";
                //    //}
                //    $html_filtro += "</tr></thead>";
                //    var $body = "<tr>";
                //for (var i = 0; i < filtro.length; i++) {
                //    if (filtro[i] === null || typeof filtro[i] !== "object") {
                //        var campo = filtro[i] !== null ? filtro[i] : "";
                //        $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                //    }
                //}
                //    $body += "</tr></tbody>";
                //    var newhtml_filtro = $html_filtro.concat($body.toString()).concat("</table></div>");
                //    tab_text = tab_text + newhtml_filtro.toString();
                //    //tab_text = tab_text + "<tr></tr>" + "<tr></tr>";
                //}
                tab_text += "<div style='border-width: 2px; border-style: dotted; padding: 1em; font-size:120%;line-height: 1.5em;'><table border='1px' style='font-size:5px; width:6000px'>";
                var $html = "<thead><tr>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha Inseminación </font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Tipo de Inseminación</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Cantidad de bovinos que participaron</font></b></td>";
                $html += "</tr></thead><tbody>";
                var $body = "<tr>";
                var data = vm.rowCollection;
                for (var j = 0; j < data.length; j++) {
                    for (var property in data[j]) {
                        if (data[j].hasOwnProperty(property) && property !== "$$hashKey") {
                            if (propiedades.indexOf(property) > -1) {
                                var campo = data[j][property] !== "" ? data[j][property] : "";
                                $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                            }
                        }
                        else {
                            $body += "</tr>";
                            break;
                        }
                    }
                }
                tab_text += "</tbody>";
                var newhtml = $html.concat($body.toString()).concat("</table></div>");
                tab_text = tab_text + newhtml.toString();
                tab_text = tab_text + '</body></html>';

                exportador.exportarPDF(tituloExcel + fecha, tab_text, function () {
                    toastr.success("Se ha exportado con Éxito.", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

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
            var propiedades = [];
            propiedades[0] = "tipoInseminacion";
            propiedades[1] = "fechaInseminacion";
            propiedades[2] = "fechaEstimadaParto";

            if (vm.rowCollection.length > 0) {
                var fecha = new Date();
                fecha = convertirFecha(fecha);

                var tab_text = '<html><head></head><body>';
                tab_text += "<h1 style='align:center;'>" + tituloExcel + "</h1>";
                //tab_text = tab_text + "<div><table border='1px' style='font-size:6px; width:10px;'>";
                //if (vm.filtro !== null) {
                //    var $html_filtro = "<thead><tr><td></td>";
                //    //for (var i = 0; i < filtro.Titulos.length; i++) {
                //    //    $html_filtro += "<td bgcolor='black' style='text-align:center; vertical-align:center'><b><font color='white'>" + filtro.Titulos[i] + "</font></b></td>";
                //    //}
                //    $html_filtro += "</tr></thead>";
                //    var $body = "<tr>";
                //for (var i = 0; i < filtro.length; i++) {
                //    if (filtro[i] === null || typeof filtro[i] !== "object") {
                //        var campo = filtro[i] !== null ? filtro[i] : "";
                //        $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                //    }
                //}
                //    $body += "</tr></tbody>";
                //    var newhtml_filtro = $html_filtro.concat($body.toString()).concat("</table></div>");
                //    tab_text = tab_text + newhtml_filtro.toString();
                //    //tab_text = tab_text + "<tr></tr>" + "<tr></tr>";
                //}
                tab_text += "<div style='border-width: 2px; border-style: dotted; padding: 1em; font-size:120%;line-height: 1.5em;'><table border='1px' style='font-size:5px; width:6000px'>";
                var $html = "<thead><tr>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha Inseminación</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Tipo de Inseminación</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha estimada de parto</font></b></td>";
                $html += "</tr></thead><tbody>";
                var $body = "<tr>";
                var data = vm.rowCollection;
                for (var j = 0; j < data.length; j++) {
                    for (var property in data[j]) {
                        if (data[j].hasOwnProperty(property) && property !== "$$hashKey") {
                            if (propiedades.indexOf(property) > -1) {
                                var campo = data[j][property] !== "" ? data[j][property] : "";
                                $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                            }
                        }
                        else {
                            $body += "</tr>";
                            break;
                        }
                    }
                }
                tab_text += "</tbody>";
                var newhtml = $html.concat($body.toString()).concat("</table></div>");
                tab_text = tab_text + newhtml.toString();
                tab_text = tab_text + '</body></html>';

                exportador.exportarPDF(tituloExcel + fecha, tab_text, function () {
                    toastr.success("Se ha exportado con Éxito.", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function openPopUp(fecha, id) {
            vm.fecha = fecha;
            if (id !== '')
                idInseminacionAEliminar = id;
            $('#modalConfirmEliminar').modal('show');
        }

        function eliminar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            var parametro = '';
            if (idInseminacionAEliminar !== 0)
                parametro = idInseminacionAEliminar;
            else
                parametro = vm.fecha;
            consultarInseminacionService.eliminarInseminacion(parametro).then(function success() {
                $('#modalConfirmEliminar').modal('hide');
                toastr.success('Inseminación eliminada con éxito', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminar').modal('hide');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }
    }
})();
