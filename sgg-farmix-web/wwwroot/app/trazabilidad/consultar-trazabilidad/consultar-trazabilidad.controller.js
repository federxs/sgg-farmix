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
        vm.disabledSgte = 'cursor';
        vm.disabledAnt = 'cursor';
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.paginar = paginar;
        vm.anterior = anterior;
        vm.siguiente = siguiente;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.insert = insert;
        //variables       
        vm.filtro = {};
        vm.Paginas = [];
        vm.cursor = '';
        var registros = 5;
        var eventos = [];
        vm.listaEventos = [];
        var ultimoIndiceVisto = 0;
        vm.fechaDeHoy = new Date();
        function inicializar() {
            vm.showSpinner = true;
            vm.disabledExportar = 'disabled';
            vm.disabled = 'disabled';
            vm.disabledSgte = 'cursor';
            vm.disabledAnt = 'cursor';
            tipoEventoService.inicializar({}).then(function success(data) {
                vm.Eventos = data;
                vm.filtro.idTipoEvento = '0';
                consultar();
            });
            //vm.bovino = new registrarBovinoService();
        };

        function anterior() {
            var paginaSelecciona = 0;
            for (var i = 0; i < vm.Paginas.length; i++) {
                if (vm.Paginas[i].seleccionada) {
                    paginaSelecciona = vm.Paginas[i - 1];
                    break;
                }
            }
            if (paginaSelecciona.numPag === 1) {
                vm.disabledAnt = 'cursor';
                vm.disabledSgte = '';
            }
            paginar(paginaSelecciona);
        };

        function siguiente() {
            var paginaSelecciona = 0;
            for (var i = 0; i < vm.Paginas.length; i++) {
                if (vm.Paginas[i].seleccionada) {
                    paginaSelecciona = vm.Paginas[i + 1];
                    break;
                }
            }
            if (paginaSelecciona.numPag === vm.Paginas.length) {
                vm.disabledSgte = 'cursor';
                vm.disabledAnt = '';
            }
            paginar(paginaSelecciona);
        };

        function paginar(pag) {
            vm.disabledAnt = '';
            vm.disabledSgte = '';
            for (var i = 0; i < vm.Paginas.length; i++) {
                vm.Paginas[i].seleccionada = false;
                vm.Paginas[i].clase = '';
            };
            pag.seleccionada = true;
            pag.clase = '#E4DFDF';
            if (pag.numPag === vm.Paginas.length) {
                vm.disabledSgte = 'cursor';
                vm.disabledAnt = '';
            }
            if (pag.numPag === 1) {
                vm.disabledAnt = 'cursor';
                vm.disabledSgte = '';
            }
            vm.listaEventos = [];
            for (var i = pag.regInit; i < pag.regFin; i++) {
                vm.listaEventos.push(eventos[i]);
                if ((i + 1) === eventos.length)
                    break;
            }
        };

        function consultar() {
            vm.showSpinner = true;
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            vm.disabledSgte = 'cursor';
            vm.disabledAnt = 'cursor';
            eventos = [];
            var cantPaginas = 0;
            vm.Paginas = [];
            vm.listaEventos = [];
            registros = 5;
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
            if (vm.filtro.numCaravana === '')
                vm.filtro.numCaravana = undefined;
            consultarTrazabilidadService.getListaEventos(angular.toJson(vm.filtro, false)).then(function success(data) {
                eventos = data;
                cantPaginas = Math.round(data.length / registros);
                if (cantPaginas == 0)
                    cantPaginas = 1;
                else {
                    vm.disabledSgte = '';
                    vm.disabledAnt = '';
                }
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    vm.showSpinner = false;
                    vm.disabled = '';
                    toastr.info("No se ah encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    for (var i = 0; i < cantPaginas ; i++) {
                        if (i === 0) vm.Paginas.push({ numPag: (i + 1), regInit: (registros * i), regFin: (registros * (i + 1)), seleccionada: true, clase: '#E4DFDF' });
                        else vm.Paginas.push({ numPag: (i + 1), regInit: (registros * i), regFin: (registros * (i + 1)), seleccionada: false, clase: '' });
                    }
                    if (data.length < registros) registros = data.length;
                    for (var i = 0; i < registros; i++) {
                        vm.listaEventos.push(data[i]);
                    }
                    //vm.listaEventos = data;
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    vm.showSpinner = false;
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
            }), function (error) {
                toastr.error('Error: ' + error, 'Error');
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
            vm.filtro = {};
            vm.filtro.idTipoEvento = '0';
            consultar();
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

        function insert() {
            var evento = { idTipoEvento: 1, idVacuna: 1, cantidad: 100 };
            var lista = [12, 17];
            tipoEventoService.insert(evento, lista.toString()).then(function success(data) {
                var hola = data;
            })
        }
    }
})();