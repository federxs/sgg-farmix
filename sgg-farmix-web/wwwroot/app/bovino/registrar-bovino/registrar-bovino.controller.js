(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope', 'registrarBovinoService', 'establecimientoOrigenService', 'rodeoService', 'estadoService', 'categoriaService', 'razaService', 'alimentoService', 'toastr', '$state', '$localStorage', '$sessionStorage'];

    function registrarBovinoController($scope, registrarBovinoService, establecimientoOrigenService, rodeoService, estadoService, categoriaService, razaService, alimentoService, toastr, $state, $localStorage, $sessionStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        vm.establecimientos = [];
        vm.alimentos = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.showMjeSuccess = false;
        vm.showMjeError = false;
        vm.mjeExiste = '';
        vm.maxCantidad = 0;
        vm.establecimiento = new establecimientoOrigenService();
        vm.rodeo = new rodeoService();
        vm.estado = new estadoService();
        vm.categoria = new categoriaService();
        vm.raza = new razaService();
        vm.alimento = new alimentoService();
        var categorias = [];
        var localidadesOriginales = [];
        var estados = [];
        $('#datetimepicker4').datetimepicker();
        vm.showCantAlimentoOptima = false;
        //funciones
        vm.registrar = registrar;
        vm.inicializar = inicializar();
        vm.idCaravanaChange = idCaravanaChange;
        vm.getFecha = getFecha;
        vm.getPeso = getPeso;
        vm.cargarProvinciasyLocalidades = cargarProvinciasyLocalidades;
        vm.getLocalidades = getLocalidades;
        vm.agregarEstabOrigen = agregarEstabOrigen;
        vm.agregarRodeo = agregarRodeo;
        vm.agregarEstado = agregarEstado;
        vm.agregarCategoria = agregarCategoria;
        vm.agregarRaza = agregarRaza;
        vm.agregarAlimento = agregarAlimento;
        vm.changeEstados = changeEstados;
        vm.changeCategorias = changeCategorias;
        vm.changeEstadosXEnfermo = changeEstadosXEnfermo;

        function inicializar() {
            //$scope.$parent.blockSpinner();
            vm.habilitar = false;
            registrarBovinoService.inicializar({ idAmbitoEstado: '1', idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                for (var i = 0; i < data.estados.length; i++) {
                    if (data.estados[i].idEstado === 4 || data.estados[i].idEstado === 5)
                        data.estados.splice(i, 1);
                }
                vm.estados = data.estados;
                estados = angular.copy(data.estados);
                vm.categorias = data.categorias;
                categorias = angular.copy(data.categorias);
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.alimentos = data.alimentos;
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
                vm.habilitar = true;
                vm.bovino = new registrarBovinoService();
                vm.bovino.genero = 0;
                vm.rodeo.confinado = 0;
                vm.changeCategorias();
                changeEstados();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function registrar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.bovino.peso = vm.bovino.peso.toString().replace(',', '.');
            if (vm.bovino.pesoAlNacer !== undefined && vm.bovino.pesoAlNacer !== '')
                vm.bovino.pesoAlNacer = vm.bovino.pesoAlNacer.toString().replace(',', '.');
            //vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            vm.bovino.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.bovino.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.bovino.$save(function (data) {
                toastr.success('Se agrego con éxito el bovino ', 'Éxito');
                //vm.habilitar = false;
                vm.btnVolver = "Volver";
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = false;
                if (error.statusText === 'Bovino ya existe') {
                    toastr.warning('Ya existe un bovino con ese número de caravana', 'Advertencia');
                    var fecha = vm.bovino.fechaNacimiento.split('/');
                    vm.bovino.fechaNacimiento = new Date(fecha[2], fecha[1], fecha[0]);
                    vm.habilitar = true;
                }
                else {
                    toastr.error('La operación no se pudo completar', 'Error');
                }
            });
        };

        function idCaravanaChange() {
            if (vm.bovino.numCaravana) {
                $scope.$parent.blockSpinner();
                //vm.showSpinner = true;
                vm.habilitar = false;
                registrarBovinoService.existeIdCaravana({ idCaravana: vm.bovino.numCaravana, codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                    if (data[0] === "1") {
                        vm.formRegistrarBovino.idCaravana.$setValidity("existeIdCaravana", false);
                    }
                    else {
                        vm.formRegistrarBovino.idCaravana.$setValidity("existeIdCaravana", true);
                    }
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    vm.habilitar = true;
                }, function (error) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        };

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = fecha.getMonth().toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

        function getPeso() {
            vm.maxCantidad = ((12 * vm.bovino.peso) / 100).toFixed(2);
            vm.showCantAlimentoOptima = true;
        };

        function getFecha() {
            vm.bovino.fechaNacimiento = $('#datetimepicker4')[0].value;
            var fechaNac = new Date(vm.bovino.fechaNacimiento.substring(6, 10), parseInt(vm.bovino.fechaNacimiento.substring(3, 5)) - 1, vm.bovino.fechaNacimiento.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaNac > fechaHoy) {
                vm.formRegistrarBovino.fechaNac.$setValidity("max", false);
            }
            else {
                vm.formRegistrarBovino.fechaNac.$setValidity("max", true);
            }
            if (fechaNac < fechaMin)
                vm.formRegistrarBovino.fechaNac.$setValidity("min", false);
            else
                vm.formRegistrarBovino.fechaNac.$setValidity("min", true);
        };

        function cargarProvinciasyLocalidades() {
            $scope.$parent.blockSpinner();
            registrarBovinoService.cargarProvinciasyLocalidades({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function getLocalidades() {
            vm.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt(vm.establecimiento.idProvincia);
            }).ToArray();
        };

        function agregarEstabOrigen() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.establecimiento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.establecimiento.$save(function (data) {
                toastr.success('Se agrego con éxito el establecimiento origen ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstablecimiento').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Establecimiento Origen ya existe')
                    toastr.warning('El establecimiento origen que intenta registrar, ya existe en este campo', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRodeo() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.rodeo.idCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.rodeo.$save(function (data) {
                toastr.success('Se agrego con éxito el rodeo', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRodeo').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Rodeo ya existe')
                    toastr.warning('El rodeo que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarEstado() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.estado.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.estado.$save(function (data) {
                toastr.success('Se agrego con éxito el estado ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstado').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Estado ya existe')
                    toastr.warning('El estado que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarCategoria() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.categoria.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.categoria.$save(function (data) {
                toastr.success('Se agrego con éxito la categoría ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoCategoria').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Categoria ya existe')
                    toastr.warning('La categoría que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRaza() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.raza.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.raza.$save(function (data) {
                toastr.success('Se agrego con éxito la raza ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRaza').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Raza ya existe')
                    toastr.warning('La raza que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarAlimento() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.alimento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.alimento.$save(function (data) {
                toastr.success('Se agrego con éxito el alimento ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoAlimento').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Alimento ya existe')
                    toastr.warning('El alimento que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function changeEstados() {
            if (vm.bovino.genero === '1' || vm.bovino.genero === 1) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 1 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
            else if (vm.bovino.genero === '0' || vm.bovino.genero === 0) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 0 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
        };

        function changeEstadosXEnfermo() {
            if (vm.bovino.enfermo === 1) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].idEstado !== 1)
                        vm.estados.push(estados[i]);
                }
                vm.bovino.idEstado = '3';
            }
            else {
                vm.estados = estados;
                if (vm.bovino.idEstado === '3')
                    vm.bovino.idEstado = '';
            }
        };

        function changeCategorias() {
            if (vm.bovino.genero === '1') {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 1)
                        vm.categorias.push(categorias[i]);
                }
            }
            else if (vm.bovino.genero === '0' || vm.bovino.genero === 0) {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 0)
                        vm.categorias.push(categorias[i]);
                }
            }
        };
    }
})();