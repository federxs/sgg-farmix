(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarTrazabilidadController', consultarTrazabilidadController);

    consultarTrazabilidadController.$inject = ['$scope', 'tipoEventoService', 'toastr', 'consultarTrazabilidadService', '$state', 'exportador'];

    function consultarTrazabilidadController($scope, tipoEventoService, toastr, consultarTrazabilidadService, $state, exportador) {
        var vm = $scope;
        vm.showSpinner = true;
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
        vm.insert = insert;
        //variables       
        vm.filtro = {};
        vm.cursor = '';
        var ultimoIndiceVisto = 0;
        var idEventoAEliminar = 0;
        vm.fechaDeHoy = new Date();

        function inicializar() {
            vm.showSpinner = true;
            vm.disabledExportar = 'disabled';
            vm.disabled = 'disabled';
            vm.itemsPorPagina = 9;
            tipoEventoService.inicializar({}).then(function success(data) {
                vm.Eventos = data;
                vm.filtro.idTipoEvento = '0';
                vm.disabled = '';
                consultar();
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function consultar() {
            vm.showSpinner = true;
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
                    vm.showSpinner = false;
                    vm.disabled = '';
                    $('#timeline').hide();
                    toastr.info("No se ah encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    if (vm.filtro.numCaravana !== undefined && vm.filtro.numCaravana !== null)
                        cargarLineaTiempoEventos();
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    vm.showSpinner = false;
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
            }), function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            };
        };

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        }

        function limpiarCampos() {
            $state.reload();
            //vm.filtro = {};
            //vm.filtro.idTipoEvento = '0';
            //vm.filtro.numCaravana = '';
            //consultar();
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

            if (vm.listaEventos.length > 0) {
                var i = 1;
                if (vm.filtro.numCaravana === undefined)
                    filtro[0] = '';
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function") {
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
                            filtro[i] = $scope.filter[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.fechaDesde === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.fechaHasta === undefined)
                    filtro[filtro.length] = '';
                exportador.exportarExcel('Trazabilidad', vm.listaEventos, titulos, filtro, propiedades, 'Trazabilidad', function () {
                    toastr.success("Se ha exportado con Éxito.", "EXITOSO");
                }, function (error) {
                    toastr.error("Ha ocurrido un error: " + error, "ERROR!");
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
            vm.showSpinner = true;
            consultarTrazabilidadService.eliminarEvento(idEventoAEliminar).then(function success() {
                $('#modalConfirmEliminar').modal('hide');
                toastr.success('Evento eliminado con éxito', 'Error');
                vm.showSpinner = false;
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminar').modal('hide');
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function ordenarFechasMenorAMayor(lista) {
            var fechaInicial, fechaSgte, aux;
            for (var i = 0; i < lista.length; i++) {
                fechaInicial = new Date(lista[i].fechaHora.substring(6, 10), parseInt(lista[i].fechaHora.substring(3, 5)) - 1, lista[i].fechaHora.substring(0, 2));
                for (var j = i + 1; j < lista.length; j++) {
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
                        //i++;
                    }
                }
            }
            return lista;
        }

        function cargarLineaTiempoEventos() {
            var list = ordenarFechasMenorAMayor(vm.listaEventos);
            google.charts.load('current', { 'packages': ['timeline'] });
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var container = document.getElementById('timeline');
                var chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Evento' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });
                var fechaSiguiente;
                for (var i = 0; i < vm.listaEventos.length; i++) {
                    var fechaAnterior = vm.listaEventos[i].fechaHora.substring(0, 10).split('/');                    
                    if ((i + 1) < vm.listaEventos.length)
                        fechaSiguiente = vm.listaEventos[i + 1].fechaHora.substring(0, 10).split('/');
                    else
                        fechaSiguiente = fechaAnterior;
                    dataTable.addRows([
                  [vm.listaEventos[i].tipoEvento, new Date(fechaAnterior[2], parseInt(fechaAnterior[1]) - 1, fechaAnterior[0]), new Date(fechaSiguiente[2], parseInt(fechaSiguiente[1]) - 1, fechaSiguiente[0])]]);                  
                }
                chart.draw(dataTable);
            }
        }

        function insert() {
            var evento = { idTipoEvento: 1, idVacuna: 1, cantidad: 100 };
            var lista = [12, 17];
            tipoEventoService.insert(evento, lista.toString()).then(function success(data) {
                var hola = data;
            })
        }
    }
})();