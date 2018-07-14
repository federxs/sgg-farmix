(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarUsuariosController', consultarUsuariosController);

    consultarUsuariosController.$inject = ['$scope', 'consultarUsuariosService', 'toastr', 'exportador', '$localStorage', '$state', 'usuarioInfo', 'portalService'];

    function consultarUsuariosController($scope, consultarUsuariosService, toastr, exportador, $localStorage, $state, usuarioInfo, portalService) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.deshabilitar = false;
        vm.disabledExportar = 'disabled';
        var idUsuarioEliminar = 0;
        var idUsuarioActivar = 0;
        //variables
        vm.usuarios = [];
        vm.filtro = {};

        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.exportarPDF = exportarPDF;
        vm.openPopUp = openPopUp;
        vm.openPopUpActivar = openPopUpActivar;
        vm.eliminar = eliminar;
        vm.activar = activar;
        vm.validarCantUsuarios = validarCantUsuarios;

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.deshabilitar = true;
            vm.disabledExportar = 'disabled';
            vm.itemsPorPagina = 9;
            consultarUsuariosService.inicializar().then(function success(data) {
                vm.roles = data.roles;
                vm.filtro.idRol = '0';
                consultar();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function consultar() {
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.filtro.rolLogueado = usuarioInfo.getRol();
            consultarUsuariosService.obtenerListaUsuarios(vm.filtro).then(function success(data) {
                if (data.length === 0) {
                    vm.rowCollection = [];
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }                    
                else {
                    vm.rowCollection = data;
                    vm.deshabilitar = false;
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();        
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

        function limpiarCampos() {
            vm.filtro = {};
            vm.filtro.nombre = '';
            vm.filtro.apellido = '';
            vm.filtro.idRol = '0';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
        }

        function exportarExcel() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Usuario';
            filtro.Titulos[1] = 'Nombre';
            filtro.Titulos[2] = 'Apellido';
            filtro.Titulos[3] = 'Fecha Alta';
            filtro.Titulos[4] = 'Fecha Baja';

            var titulos = [];
            titulos[0] = 'Usuario';
            titulos[1] = 'Nombre';
            titulos[2] = 'Apellido';
            titulos[3] = 'Fecha Alta';
            titulos[4] = 'Fecha Baja';

            var propiedades = [];
            propiedades[0] = "usuario"
            propiedades[1] = "nombre";
            propiedades[2] = "apellido";
            propiedades[3] = "fechaAlta";
            propiedades[4] = "fechaBaja";

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
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.filtro.rolLogueado = usuarioInfo.getRol();
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            consultarUsuariosService.generarPDF(vm.filtro).then(function (data) {
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

        function openPopUp(usuario) {
            vm.usuario = usuario.usuario;
            idUsuarioEliminar = usuario.idUsuario;
            $('#modalConfirmEliminacionUser').modal('show');
        }

        function eliminar() {
            $scope.$parent.blockSpinnerSave();
            consultarUsuariosService.darBajaUser(idUsuarioEliminar, $localStorage.usuarioInfo.codigoCampo).then(function success() {
                $('#modalConfirmEliminacionUser').modal('hide');
                toastr.success('Se ha dado de baja al usuario con éxito', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminacionUser').modal('hide');
                $scope.$parent.unBlockSpinnerSave();
                $scope.$parent.errorServicio(error.statusText);
            })
        }

        function openPopUpActivar(usuario) {
            vm.usuarioActivo = usuario.usuario;
            idUsuarioActivar = usuario.idUsuario;
            $('#modalConfirmActivacionUser').modal('show');
        }

        function activar() {
            $scope.$parent.blockSpinnerSave();
            consultarUsuariosService.activarUser(idUsuarioActivar, $localStorage.usuarioInfo.codigoCampo).then(function success() {
                $('#modalConfirmActivacionUser').modal('hide');
                toastr.success('Se ha activado al usuario con éxito', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $state.reload();
            }, function (error) {
                $('#modalConfirmActivacionUser').modal('hide');
                $scope.$parent.unBlockSpinnerSave();
                $scope.$parent.errorServicio(error.statusText);
            })
        }

        function validarCantUsuarios() {
            $scope.$parent.blockSpinner();
            consultarUsuariosService.validarCantidadUsuariosPlan($localStorage.usuarioInfo.codigoCampo ).then(function success(data) {
                if (data.resultado)
                    $state.go('home.registrarUsuario');
                else {
                    toastr.info("No puede agregar mas usuarios, verifique su plan contratado.", "Aviso");
                    $scope.$parent.unBlockSpinner();
                }                              
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            })
        };

    }
})();