(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarTrazabilidadController', consultarTrazabilidadController);

    consultarTrazabilidadController.$inject = ['$scope', 'tipoEventoService', 'toastr', 'consultarTrazabilidadService', '$state', 'exportador', '$localStorage'];

    function consultarTrazabilidadController($scope, tipoEventoService, toastr, consultarTrazabilidadService, $state, exportador, $localStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.disabled = 'disabled';
        vm.disabledExportar = 'disabled';
        vm.tipoEventoPopUp = '';
        vm.fecha = '';
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.openPopUp = openPopUp;
        vm.eliminar = eliminar;
        vm.getFechaDesde = getFechaDesde;
        vm.getFechaHasta = getFechaHasta;
        vm.exportarPDF = exportarPDF;
        //variables       
        vm.filtro = {};
        vm.cursor = '';
        var ultimoIndiceVisto = 0;
        var idEventoAEliminar = 0;
        var idManejo = [];
        var idAlimenticio = [];
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabledExportar = 'disabled';
            vm.disabled = 'disabled';
            vm.itemsPorPagina = 9;
            tipoEventoService.inicializar({}).then(function success(data) {
                vm.Eventos = data;
                vm.filtro.idTipoEvento = '0';
                vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
                vm.disabled = '';
                consultar();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function consultar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            if (vm.filtro.fechaDesde !== undefined) {
                if (typeof vm.filtro.fechaDesde === "string")
                    vm.filtro.fechaDesde = new Date(vm.filtro.fechaDesde.split('/')[2], (parseInt(vm.filtro.fechaDesde.split('/')[1]) - 1).toString(), vm.filtro.fechaDesde.split('/')[0]);
                vm.filtro.fechaDesde = convertirFecha(vm.filtro.fechaDesde);
            }
            if (vm.filtro.fechaHasta !== undefined) {
                if (typeof vm.filtro.fechaHasta === "string")
                    vm.filtro.fechaHasta = new Date(vm.filtro.fechaHasta.split('/')[2], (parseInt(vm.filtro.fechaHasta.split('/')[1]) - 1).toString(), vm.filtro.fechaHasta.split('/')[0]);
                vm.filtro.fechaHasta = convertirFecha(vm.filtro.fechaHasta);
            }
            if (vm.filtro.numCaravana === null) {
                vm.filtro.numCaravana = undefined;
                $('#timeline').hide();
            }
            else if (vm.filtro.numCaravana !== undefined && vm.filtro.numCaravana !== null) {
                $('#timeline').show();
            }
            consultarTrazabilidadService.getListaEventos(angular.toJson(vm.filtro, false)).then(function success(data) {
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    //vm.showSpinner = false;
                    vm.disabled = '';
                    vm.rowCollection = [];
                    $('#timeline').hide();
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    if (vm.filtro.numCaravana !== undefined && vm.filtro.numCaravana !== null)
                        cargarLineaTiempoEventos();
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    //vm.showSpinner = false;
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();
            }), function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            };
        };

        function convertirFecha(fecha) {
            var dia, mes, año, hora, min;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            hora = fecha.getHours().toString();
            if (hora.length === 1)
                hora = '0' + hora;
            min = fecha.getMinutes().toString();
            if (min.length === 1)
                min = '0' + min;
            return dia + '/' + mes + '/' + año + ' ' + hora + ':' + min;
        }

        function limpiarCampos() {
            $state.reload();
        }

        function exportarExcel() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Nro Caravana';
            filtro.Titulos[1] = 'Tipo Evento';
            filtro.Titulos[2] = 'Fecha Desde';
            filtro.Titulos[3] = 'Fecha Hasta';

            var titulos = [];
            titulos[0] = "Tipo de Evento";
            titulos[1] = "Fecha Evento";
            titulos[2] = "Bovinos que participaron";

            var propiedades = [];
            propiedades[0] = "tipoEvento";
            propiedades[1] = "fechaHora";
            propiedades[2] = "cantidadBovinos";

            if (vm.rowCollection.length > 0) {
                var i = 1;
                if (vm.filtro.numCaravana === undefined)
                    filtro[0] = '';
                else
                    vm.filtro[0] = vm.filtro.numCaravana;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && type !== "numCaravana") {
                        if (property === "idTipoEvento") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.Eventos.length; j++) {
                                    if (vm.filtro[property] === vm.Eventos[j].idTipoEvento || parseInt(vm.filtro[property]) === vm.Eventos[j].idTipoEvento) {
                                        filtro[i] = vm.Eventos[j].descripcion;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "fechaDesde") {
                            if (vm.filtro[property] === '2') {
                                filtro[i] = '';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Hembra';
                                i += 1;
                            }
                        }
                        else if (property === "fechaHasta") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                        }
                        else if (property === "numCaravana") {
                            filtro[0] = $scope.filtro[property];
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.fechaDesde === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.fechaHasta === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                for (var i = 0; i < vm.rowCollection.length; i++) {
                    if (vm.rowCollection[i].$$hashKey === undefined)
                        vm.rowCollection[i].$$hashKey = '';
                }
                exportador.exportarExcel('Trazabilidad' + fecha, vm.rowCollection, titulos, filtro, propiedades, 'Trazabilidad', function () {
                    toastr.success("Se ha exportado con Éxito.", "EXITOSO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDF() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Nro Caravana';
            filtro.Titulos[1] = 'Tipo Evento';
            filtro.Titulos[2] = 'Fecha Desde';
            filtro.Titulos[3] = 'Fecha Hasta';

            var propiedades = [];
            propiedades[0] = "tipoEvento";
            propiedades[1] = "fechaHora";
            propiedades[2] = "cantidadBovinos";

            if (vm.rowCollection.length > 0) {
                var i = 1;
                if (vm.filtro.numCaravana === undefined)
                    filtro[0] = '';
                else
                    filtro[0] = vm.filtro.numCaravana;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "numCaravana") {
                        if (property === "idTipoEvento") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.Eventos.length; j++) {
                                    if (vm.filtro[property] === vm.Eventos[j].idTipoEvento || parseInt(vm.filtro[property]) === vm.Eventos[j].idTipoEvento) {
                                        filtro[i] = vm.Eventos[j].descripcion;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "fechaDesde") {
                            if (vm.filtro[property] === '2') {
                                filtro[i] = '';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Hembra';
                                i += 1;
                            }
                        }
                        else if (property === "fechaHasta") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.fechaDesde === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.fechaHasta === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                var tab_text = '<html><head></head><body>';
                tab_text += "<h1 style='align:center;'>Trazabilidad</h1>";
                tab_text = tab_text + "<div><table border='1px' style='font-size:6px; width:6000px;'>";
                //tab_text += "<tr><td style='text-align:center; font-size:20px' colspan='" + titulos.length + "'><b>" + tituloReporte + "</b></td></tr>" + "<tr></tr>";
                if (vm.filtro !== null) {
                    var $html_filtro = "<thead><tr>";
                    for (var i = 0; i < filtro.Titulos.length; i++) {
                        $html_filtro += "<td bgcolor='black' style='text-align:center; vertical-align:center'><b><font color='white'>" + filtro.Titulos[i] + "</font></b></td>";
                    }
                    $html_filtro += "</tr></thead>";
                    var $body = "<tr>";
                    for (var i = 0; i < filtro.length; i++) {
                        if (filtro[i] === null || typeof filtro[i] !== "object") {
                            var campo = filtro[i] !== null ? filtro[i] : "";
                            $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                        }
                    }
                    $body += "</tr></tbody>";
                    var newhtml_filtro = $html_filtro.concat($body.toString()).concat("</table></div>");
                    tab_text = tab_text + newhtml_filtro.toString();
                    //tab_text = tab_text + "<tr></tr>" + "<tr></tr>";
                }
                tab_text += "<div style='border-width: 2px; border-style: dotted; padding: 1em; font-size:120%;line-height: 1.5em;'><table border='1px' style='font-size:5px; width:6000px'>";
                var $html = "<thead><tr>";
                $html += "<td style='width:1000; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Tipo de Evento</font></b></td>";
                $html += "<td style='width:1000; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha Evento</font></b></td>";
                $html += "<td style='width:1000; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Bovinos que participaron</font></b></td>";
                $html += "</tr></thead><tbody>";
                var $body = "<tr>";
                for (var i = 0; i < vm.rowCollection.length; i++) {
                    if (vm.rowCollection[i].$$hashKey === undefined)
                        vm.rowCollection[i].$$hashKey = '';
                }
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

                exportador.exportarPDF('Trazabilidad' + fecha, tab_text, function () {
                    toastr.success("Se ha exportado con Éxito.", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function openPopUp(tipoEvento, fecha, idEvento) {
            vm.tipoEventoPopUp = tipoEvento;
            vm.fecha = fecha;
            idEventoAEliminar = idEvento;
            $('#modalConfirmEliminar').modal('show');
        }

        function eliminar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            consultarTrazabilidadService.eliminarEvento(idEventoAEliminar).then(function success() {
                $('#modalConfirmEliminar').modal('hide');
                toastr.success('Evento eliminado con éxito', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                //vm.showSpinner = false;
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminar').modal('hide');
                $scope.$parent.unBlockSpinnerSave();
                //vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function ordenarFechasMenorAMayor(lista) {
            var listaARetornar = [];
            for (var i = lista.length - 1; i >= 0; i--) {
                listaARetornar.push(lista[i]);
            }
            /*var fechaInicial, fechaSgte, aux;
            for (var i = lista.length - 1; i > 0 ; i--) {
                fechaInicial = new Date(lista[i].fechaHora.substring(6, 10), parseInt(lista[i].fechaHora.substring(3, 5)) - 1, lista[i].fechaHora.substring(0, 2));
                for (var j = i - 1; j > 0; j--) {
                    fechaSgte = new Date(lista[j].fechaHora.substring(6, 10), parseInt(lista[j].fechaHora.substring(3, 5)) - 1, lista[j].fechaHora.substring(0, 2));
                    if (fechaSgte < fechaInicial) {
                        aux = lista[i];
                        lista[i] = lista[j];
                        lista[j] = aux;
                        fechaInicial = new Date(lista[i].fechaHora.substring(6, 10), parseInt(lista[i].fechaHora.substring(3, 5)) - 1, lista[i].fechaHora.substring(0, 2));
                    }
                    else if (fechaSgte <= fechaInicial) {
                        aux = lista[i + 1];
                        lista[i + 1] = lista[j];
                        lista[j] = aux;
                    }
                }
            }*/
            return listaARetornar;
        }

        function cargarLineaTiempoEventos() {
            var list = ordenarFechasMenorAMayor(vm.rowCollection);
            google.charts.load('current', { 'packages': ['timeline'] });
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var container = document.getElementById('timeline');
                var chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Evento' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });
                var fechaSiguiente, horaSiguiente;
                for (var i = 0; i < list.length; i++) {
                    var descrEvento = "";
                    var fechaAnterior = list[i].fechaHora.substring(0, 10).split('/');
                    var horaAnterior = list[i].fechaHora.substring(11, 16).split(':');
                    switch (list[i].tipoEvento) {
                        case 'Vacunación':
                        case 'Antibiótico':
                            fechaSiguiente = new Date(fechaAnterior[2], parseInt(fechaAnterior[1]) - 1, fechaAnterior[0], horaAnterior[0], horaAnterior[1]);
                            fechaSiguiente.setDate(fechaSiguiente.getDate() + 1);                            
                            fechaSiguiente = convertirFecha(fechaSiguiente);
                            horaSiguiente = fechaSiguiente.substring(11, 16).split(':');
                            fechaSiguiente = fechaSiguiente.substring(0, 10).split('/');
                            break;
                        case 'Manejo':
                            idManejo.push(list[i].idEvento);
                            var index = list.findIndex(encontrarManejo);
                            if (index !== -1) {
                                fechaSiguiente = list[index].fechaHora.substring(0, 10).split('/');
                                horaSiguiente = list[index].fechaHora.substring(11, 16).split(':');
                            }
                            else {
                                fechaSiguiente = convertirFecha(new Date());
                                horaSiguiente = fechaSiguiente.substring(11, 16).split(':');
                                fechaSiguiente = fechaSiguiente.substring(0, 10).split('/');
                            }
                            break;
                        case 'Alimenticio':
                            idAlimenticio.push(list[i].idEvento);
                            var index = list.findIndex(encontrarAlimenticio);
                            if (index !== -1){
                                fechaSiguiente = list[index].fechaHora.substring(0, 10).split('/');
                                horaSiguiente = list[index].fechaHora.substring(11, 16).split(':');
                            }
                            else {
                                fechaSiguiente = convertirFecha(new Date());
                                horaSiguiente = fechaSiguiente.substring(11, 16).split(':');
                                fechaSiguiente = fechaSiguiente.substring(0, 10).split('/');
                            }
                            break;
                    }
                    dataTable.addRows([
                  [list[i].tipoEvento, new Date(fechaAnterior[2], parseInt(fechaAnterior[1]) - 1, fechaAnterior[0], horaAnterior[0], horaAnterior[1]), new Date(fechaSiguiente[2], parseInt(fechaSiguiente[1]) - 1, fechaSiguiente[0], horaSiguiente[0], horaSiguiente[1])]]);
                }
                chart.draw(dataTable);
            }
        }

        function encontrarManejo(evento) {
            return evento.tipoEvento === 'Manejo' && idManejo.indexOf(evento.idEvento) === -1;
        }
        
        function encontrarAlimenticio(evento) {
            return evento.tipoEvento === 'Alimenticio' && idAlimenticio.indexOf(evento.idEvento) === -1;
        }

        function getFechaDesde() {
            vm.filtro.fechaDesde = $('#datetimepicker4')[0].value;
            var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
            var fechaMin = new Date(2000, 1, 1);
            if (fechaDesde < fechaMin) {
                vm.formConsultarTrazabilidad.fechaDesde.$setValidity("min", false);
            }
            else {
                vm.formConsultarTrazabilidad.fechaDesde.$setValidity("min", true);
            }
        }

        function getFechaHasta() {
            vm.filtro.fechaHasta = $('#datetimepicker5')[0].value;
            if (vm.filtro.fechaDesde !== undefined) {
                var fechaHasta = new Date(vm.filtro.fechaHasta.substring(6, 10), parseInt(vm.filtro.fechaHasta.substring(3, 5)) - 1, vm.filtro.fechaHasta.substring(0, 2));
                var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
                if (fechaHasta < fechaDesde) {
                    vm.formConsultarTrazabilidad.fechaHasta.$setValidity("min", false);
                }
                else {
                    vm.formConsultarTrazabilidad.fechaHasta.$setValidity("min", true);
                }
            }
        }
    }
})();