(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarBovinoController', consultarBovinoController);

    consultarBovinoController.$inject = ['$scope', 'consultarBovinoService', 'toastr', 'exportador', '$localStorage', '$state', 'portalService'];

    function consultarBovinoController($scope, consultarBovinoService, toastr, exportador, $localStorage, $state, portalService) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.disabled = 'disabled';
        vm.disabledExportar = 'disabled';
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.exportarPDF = exportarPDF;
        vm.validarCantBovinos = validarCantBovinos;
        vm.changeEstados = changeEstados;
        vm.changeCategorias = changeCategorias;
        vm.openPopUp = openPopUp;
        vm.eliminar = eliminar;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        vm.establecimientos = [];
        vm.filtro = {};
        vm.cursor = '';
        var estados = [];
        var categorias = [];
        var idBovinoEliminar = 0;
        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            vm.itemsPorPagina = 9;
            consultarBovinoService.inicializar({ idAmbitoEstado: '1', idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                vm.estados = data.estados;
                estados = angular.copy(data.estados);
                vm.categorias = data.categorias;
                categorias = angular.copy(data.categorias);
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.filtro.idCategoria = '0';
                vm.filtro.genero = '2';
                vm.filtro.idRaza = '0';
                vm.filtro.idRodeo = '0';
                vm.filtro.idEstado = '0';
                vm.filtro.accionPeso = '0';
                vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
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
            if (vm.filtro.peso === '' || vm.filtro.peso === undefined) vm.filtro.peso = 0;
            if (vm.filtro.numCaravana === '' || vm.filtro.numCaravana === null) vm.filtro.numCaravana = 0;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            consultarBovinoService.obtenerListaBovinos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    vm.disabled = '';
                    vm.rowCollection = [];
                    vm.filtro.peso = '';
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    if (vm.filtro.peso === 0) vm.filtro.peso = '';
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
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
            vm.filtro.numCaravana = '';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
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
            titulos[6] = "Peso (Kg)";

            var propiedades = [];
            propiedades[0] = "numCaravana";
            propiedades[1] = "categoriaNombre";
            propiedades[2] = "sexo";
            propiedades[3] = "razaNombre";
            propiedades[4] = "rodeoNombre";
            propiedades[5] = "estadoNombre";
            propiedades[6] = "peso";

            if (vm.rowCollection.length > 0) {
                var i = 1;
                if (vm.filtro.numCaravana === undefined)
                    filtro[0] = '';
                else
                    filtro[0] = vm.filtro.numCaravana;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "numCaravana") {
                        if (property === "idCategoria") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.categorias.length; j++) {
                                    if (vm.filtro[property] === vm.categorias[j].idCategoria || parseInt(vm.filtro[property]) === vm.categorias[j].idCategoria) {
                                        filtro[i] = vm.categorias[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "genero") {
                            if (vm.filtro[property] === '2') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '0') {
                                filtro[i] = 'Hembra';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Macho';
                                i += 1;
                            }
                        }
                        else if (property === "idRaza") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.razas.length; j++) {
                                    if (vm.filtro[property] === vm.razas[j].idRaza || parseInt(vm.filtro[property]) === vm.razas[j].idRaza) {
                                        filtro[i] = vm.razas[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "idRodeo") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.rodeos.length; j++) {
                                    if (vm.filtro[property] === vm.rodeos[j].idRodeo || parseInt(vm.filtro[property]) === vm.rodeos[j].idRodeo) {
                                        filtro[i] = vm.rodeos[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "idEstado") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.estados.length; j++) {
                                    if (vm.filtro[property] === vm.estados[j].idEstado || parseInt(vm.filtro[property]) === vm.estados[j].idEstado) {
                                        filtro[i] = vm.estados[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "accionPeso") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === 'mayor') {
                                filtro[i] = 'Mayor';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Menor';
                                i += 1;
                            }
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.peso === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);                
                exportador.exportarExcel('Bovinos' + fecha, vm.rowCollection, titulos, filtro, propiedades, 'Bovinos', function () {
                    toastr.success("Se ha exportado con Éxito", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (vm.filtro.peso === '' || vm.filtro.peso === undefined) vm.filtro.peso = 0;
            if (vm.filtro.numCaravana === '' || vm.filtro.numCaravana === null) vm.filtro.numCaravana = 0;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            consultarBovinoService.generarPDF({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
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

        function validarCantBovinos() {
            $scope.$parent.blockSpinner();
            consultarBovinoService.validarCantBovinos({ campo: $localStorage.usuarioInfo.codigoCampo }, function success(data) {
                if (data.resultado)
                    $state.go('home.registrarBovino');
                else {
                    $scope.$parent.unBlockSpinner();
                    toastr.info("No puede agregar mas bovinos, verifique su plan contratado.", "Aviso");
                }
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function changeEstados() {
            if (vm.filtro.genero === '1') {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 1 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
            else if (vm.filtro.genero === '0') {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 0 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
        };

        function changeCategorias() {
            if (vm.filtro.genero === '1') {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 1)
                        vm.categorias.push(categorias[i]);
                }
            }
            else if (vm.filtro.genero === '0' || vm.filtro.genero === 0) {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 0)
                        vm.categorias.push(categorias[i]);
                }
            }
            else
                vm.categorias = categorias;
        };

        function openPopUp(numCaravana, idBovino) {
            vm.numCaravana = numCaravana;
            idBovinoEliminar = idBovino;
            $('#modalConfirmEliminar').modal('show');
        };

        function eliminar() {
            $scope.$parent.blockSpinnerSave();
            consultarBovinoService.eliminarBovino({ idBovino: idBovinoEliminar, codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function () {
                $('#modalConfirmEliminar').modal('hide');
                toastr.success('Bovino eliminado con éxito', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                vm.consultar();
            }, function (error) {
                $('#modalConfirmEliminar').modal('hide');
                $scope.$parent.unBlockSpinnerSave();
                $scope.$parent.errorServicio(error.statusText);
            })
        }
    }
})();