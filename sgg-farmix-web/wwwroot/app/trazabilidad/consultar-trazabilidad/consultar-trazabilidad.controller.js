(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarTrazabilidadController', consultarTrazabilidadController);

    consultarTrazabilidadController.$inject = ['$scope', 'tipoEventoService', 'toastr', 'consultarTrazabilidadService', '$state', '$sessionStorage', '$localStorage', 'portalService'];

    function consultarTrazabilidadController($scope, tipoEventoService, toastr, consultarTrazabilidadService, $state, $sessionStorage, $localStorage, portalService) {
        var vm = $scope;
        window.scrollTo(0, 0);
        $('.modal-backdrop').remove();
        $('[data-toggle="tooltip"]').tooltip();
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
        vm.numCaravanaFiltro;
        var ultimoIndiceVisto = 0;
        var idEventoAEliminar = 0;
        var idManejo = [];
        var idAlimenticio = [];
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();

        function inicializar() {
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
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function consultar() {
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
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            consultarTrazabilidadService.getListaEventos(angular.toJson(vm.filtro, false)).then(function success(data) {
                vm.numCaravanaFiltro = undefined;
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    vm.disabled = '';
                    vm.rowCollection = [];
                    $('#timeline').hide();
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;                    
                    if (vm.filtro.numCaravana !== undefined && vm.filtro.numCaravana !== null) {
                        vm.numCaravanaFiltro = angular.copy(vm.filtro.numCaravana);
                        cargarLineaTiempoEventos();
                    }                        
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();
                $('.modal-backdrop').remove();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
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
            $scope.$parent.blockSpinnerGenerarArchivo();
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
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            consultarTrazabilidadService.generarExcel(angular.toJson(vm.filtro, false)).then(function (data) {
                if (vm.filtro.numCaravana == 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path);
                });
                $(link).click();
                toastr.success('Excel generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
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
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            consultarTrazabilidadService.generarPDF(angular.toJson(vm.filtro, false)).then(function (data) {
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

        function openPopUp(tipoEvento, fecha, idEvento) {
            vm.tipoEventoPopUp = tipoEvento;
            vm.fecha = fecha;
            idEventoAEliminar = idEvento;
            $('#modalConfirmEliminar').modal('show');
        }

        function eliminar() {
            $scope.$parent.blockSpinnerSave();
            consultarTrazabilidadService.eliminarEvento(idEventoAEliminar).then(function success() {
                $('#modalConfirmEliminar').modal('hide');
                toastr.success('Evento eliminado con éxito', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminar').modal('hide');
                $scope.$parent.unBlockSpinnerSave();
                $scope.$parent.errorServicio(error.statusText);
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
                var options = {
                    height: 400
                };

                dataTable.addColumn({ type: 'string', id: 'Evento' });
                dataTable.addColumn({ type: 'string', id: 'Nombre' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });
                var fechaSiguiente, horaSiguiente;
                for (var i = 0; i < list.length; i++) {
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
                  [list[i].tipoEvento, list[i].nombre, new Date(fechaAnterior[2], parseInt(fechaAnterior[1]) - 1, fechaAnterior[0], horaAnterior[0], horaAnterior[1]), new Date(fechaSiguiente[2], parseInt(fechaSiguiente[1]) - 1, fechaSiguiente[0], horaSiguiente[0], horaSiguiente[1])]]);
                }
                chart.draw(dataTable, options);
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