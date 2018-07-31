(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarUsuariosController', consultarUsuariosController);

    consultarUsuariosController.$inject = ['$scope', 'consultarUsuariosService', 'toastr', 'exportador', '$localStorage', '$state', 'usuarioInfo', 'portalService', '$sessionStorage'];

    function consultarUsuariosController($scope, consultarUsuariosService, toastr, exportador, $localStorage, $state, usuarioInfo, portalService, $sessionStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        $('.modal-backdrop').remove();
        $('[data-toggle="tooltip"]').tooltip();
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

        vm.usuario = $sessionStorage.usuarioInfo.usuario;
        vm.rol = $sessionStorage.usuarioInfo.idRol;

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
                $('.modal-backdrop').remove();
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
            $scope.$parent.blockSpinnerGenerarArchivo();
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.filtro.rolLogueado = usuarioInfo.getRol();
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            consultarUsuariosService.generarExcel(angular.toJson(vm.filtro, false)).then(function (data) {
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
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.filtro.rolLogueado = usuarioInfo.getRol();
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
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