(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarBovinoController', consultarBovinoController);

    consultarBovinoController.$inject = ['$scope', 'consultarBovinoService', 'toastr', 'exportador'];

    function consultarBovinoController($scope, consultarBovinoService, toastr, exportador) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.disabled = 'disabled';
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
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        vm.establecimientos = [];
        vm.listaBovinos = [];
        vm.filtro = {};
        vm.Paginas = [];
        vm.cursor = '';
        var registros = 5;
        var bovinos = [];
        var ultimoIndiceVisto = 0;
        function inicializar() {
            vm.showSpinner = true;
            vm.disabled = 'disabled';
            vm.disabledSgte = 'cursor';
            vm.disabledAnt = 'cursor';
            consultarBovinoService.inicializar({ idAmbitoEstado: '1' }, function (data) {
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.filtro.idCategoria = '0';
                vm.filtro.genero = '2';
                vm.filtro.idRaza = '0';
                vm.filtro.idRodeo = '0';
                vm.filtro.idEstado = '0';
                vm.filtro.accionPeso = '0';
                consultar();
            });
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
            vm.listaBovinos = [];
            for (var i = pag.regInit; i < pag.regFin; i++) {
                vm.listaBovinos.push(bovinos[i]);
                if ((i + 1) === bovinos.length)
                    break;
            }
        };

        function consultar() {
            vm.showSpinner = true;
            vm.disabled = 'disabled';
            vm.disabledSgte = 'cursor';
            vm.disabledAnt = 'cursor';
            bovinos = [];
            var cantPaginas = 0;
            vm.Paginas = [];
            vm.listaBovinos = [];
            registros = 5;
            if (vm.filtro.peso === '') vm.filtro.peso = 0;
            if (vm.filtro.numCaravana === '') vm.filtro.numCaravana = 0;
            consultarBovinoService.obtenerListaBovinos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                bovinos = data;
                if (data.length > 0)
                    vm.showLista = true;
                else {
                    toastr.info("No se ah encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                cantPaginas = parseInt(data.length / registros);
                if (cantPaginas == 0) cantPaginas = 1;
                else {
                    vm.disabledSgte = '';
                    vm.disabledAnt = '';
                }
                for (var i = 0; i < cantPaginas ; i++) {
                    if (i === 0) vm.Paginas.push({ numPag: (i + 1), regInit: (registros * i), regFin: (registros * (i + 1)), seleccionada: true, clase: '#E4DFDF' });
                    else vm.Paginas.push({ numPag: (i + 1), regInit: (registros * i), regFin: (registros * (i + 1)), seleccionada: false, clase: '' });
                }
                if (data.length < registros) registros = data.length;
                for (var i = 0; i < registros; i++) {
                    vm.listaBovinos.push(data[i]);
                }
                //vm.listaBovinos = data;
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                vm.showSpinner = false;
                vm.disabled = '';
            }, function (error) {
                toastr.error('Error: ' + error, 'Error');
            });
        };

        function limpiarCampos() {
            vm.filtro = {};
            vm.filtro.idCategoria = '0';
            vm.filtro.genero = '2';
            vm.filtro.idRaza = '0';
            vm.filtro.idRodeo = '0';
            vm.filtro.idEstado = '0';
            vm.filtro.accionPeso = '0';
        }

        function exportarExcel() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Nro Caravana';
            filtro.Titulos[1] = 'Categoría';
            filtro.Titulos[2] = 'Sexo';
            filtro.Titulos[3] = 'Raza';
            filtro.Titulos[4] = 'Rodeo';
            filtro.Titulos[5] = 'Estado';
            filtro.Titulos[6] = 'Acción Peso';
            filtro.Titulos[7] = 'Peso (Kg)';

            var titulos = [];
            titulos[0] = "Nro Caravana";
            titulos[1] = "Categoría";
            titulos[2] = "Sexo";
            titulos[3] = "Raza";
            titulos[4] = "Rodeo";
            titulos[5] = "Estado";
            titulos[5] = "Peso (Kg)";

            var propiedades = [];
            propiedades[0] = "Eve_Id";
            propiedades[1] = "Eve_Titulo";
            propiedades[2] = "Eve_Fecha";
            propiedades[3] = "Pub_FechaVto";
            propiedades[4] = "Pub_Visitas";
            propiedades[5] = "Confirmaciones";

            if (vm.listaBovinos.length > 0) {
                var i = 0;
                for (var property in vm.filtro) {
                    var type = typeof $scope.filter[property];
                    if (($scope.filter[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "Emp_Id") {
                        if (property === "Pub_Activa") {
                            for (var j = 0; j < $scope.filter.Estados.length; j++) {
                                if ($scope.filter[property] === $scope.filter.Estados[j].Id || $scope.filter[property] === parseInt($scope.filter.Estados[j].Id)) {
                                    filtro[i] = $scope.filter.Estados[j].Text;
                                    i += 1;
                                    break;
                                }
                            }
                        }
                        else if (property === "Eve_Tipo") {
                            for (var k = 0; k < $scope.filter.Tipos.length; k++) {
                                if ($scope.filter[property] === parseInt($scope.filter.Tipos[k].Id)) {
                                    filtro[i] = $scope.filter.Tipos[k].Text;
                                    i += 1;
                                    break;
                                }
                            }
                        }
                        else {
                            filtro[i] = $scope.filter[property];
                            i += 1;
                        }
                    }
                }
                exportador.exportarExcel('Bovinos', vm.listaBovinos, titulos, filtro, propiedades, 'Bovinos', function () {
                    toastr.success("Se ha exportado con Éxito.", "EXITOSO");
                }, function (error) {
                    toastr.error("Ha ocurrido un error: " + error, "ERROR!");
                });
            }
        }

    }
})();