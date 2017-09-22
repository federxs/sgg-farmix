(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarBovinoController', modificarBovinoController);

    modificarBovinoController.$inject = ['$scope', 'modificarBovinoService', 'toastr', '$stateParams'];

    function modificarBovinoController($scope, modificarBovinoService, toastr, $stateParams) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.habilitar = false;
        //funciones
        vm.modificar = modificar;
        vm.inicializar = inicializar();
        vm.cambiarSexo = cambiarSexo;
        vm.idCaravanaChange = idCaravanaChange;
        vm.getFecha = getFecha;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        var categorias = [];
        var nroCaravanaOriginal = 0;
        //vm.habilitar = true;
        vm.inicializar = inicializar;
        vm.btnVolver = "Volver";
        vm.checkH = false;
        vm.checkM = false;
        $('#datetimepicker4').datetimepicker();

        function inicializar() {
            vm.showSpinner = true;
            vm.habilitar = false;
            modificarBovinoService.inicializar($stateParams.id).then(function success(data) {
                vm.categorias = [];
                vm.habilitar = false;
                //combos
                vm.estados = data.estados;
                categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;

                //bovino
                vm.bovino = data.bovino;
                nroCaravanaOriginal = vm.bovino.numCaravana;
                //if (vm.bovino.fechaNacimiento[8] === " ")
                  //  var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 8).split('/');
                //else
                  //  var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10).split('/');
                //vm.bovino.fechaNacimiento = new Date(fechaNacimiento[2], (parseInt(fechaNacimiento[1] - 1)).toString(), fechaNacimiento[0]);
                vm.bovino.fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10);
                if (vm.bovino.genero === 0) {
                    vm.checkH = true;
                    vm.checkM = false;
                    for (var i = 0; i < categorias.length; i++) {
                        if (categorias[i].genero === 0)
                            vm.categorias.push(categorias[i]);
                    }
                }
                else {
                    vm.checkH = false;
                    vm.checkM = true;
                    for (var i = 0; i < categorias.length; i++) {
                        if (categorias[i].genero === 1)
                            vm.categorias.push(categorias[i]);
                    }
                }
                //seteo combos
                vm.bovino.idRaza = data.bovino.idRaza.toString();
                vm.bovino.idCategoria = data.bovino.idCategoria.toString();
                vm.bovino.idEstado = data.bovino.idEstado.toString();
                vm.bovino.idRodeo = data.bovino.idRodeo.toString();
                if (data.bovino.idEstablecimientoOrigen != 0) {
                    vm.bovino.idEstablecimientoOrigen = data.bovino.idEstablecimientoOrigen.toString();
                } else {
                    vm.bovino.idEstablecimientoOrigen = "";
                }

                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                });
                vm.showSpinner = false;
                vm.habilitar = true;
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function cambiarSexo() {
            vm.categorias = [];
            if (vm.checkH === true) {
                vm.checkH = false;
                vm.checkM = true;
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 1)
                        vm.categorias.push(categorias[i]);
                }
            }
            else {
                vm.checkH = true;
                vm.checkM = false;
                for (var j = 0; j < categorias.length; j++) {
                    if (categorias[j].genero === 0)
                        vm.categorias.push(categorias[j]);
                }
            }
        };

        function modificar() {
            vm.showSpinner = true;
            vm.habilitar = false;
            vm.bovino.peso = vm.bovino.peso.toString().replace(',', '.');
            vm.bovino.pesoAlNacer = vm.bovino.pesoAlNacer.toString().replace(',', '.');
            //vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            if (vm.bovino.pesoAlNacer === '' || vm.bovino.pesoAlNacer === undefined)
                vm.bovino.pesoAlNacer = 0;
            if (vm.bovino.idBovinoMadre === '' || vm.bovino.idBovinoMadre === undefined)
                vm.bovino.idBovinoMadre = 0;
            if (vm.bovino.idBovinoPadre === '' || vm.bovino.idBovinoPadre === undefined)
                vm.bovino.idBovinoPadre = 0;
            if (vm.bovino.idEstablecimientoOrigen === '' || vm.bovino.idEstablecimientoOrigen === undefined)
                vm.bovino.idEstablecimientoOrigen = 0;
            if (vm.checkH === true) vm.bovino.genero = 0;
            else if (vm.checkM === true) vm.bovino.genero = 1;
            modificarBovinoService.modificar(vm.bovino).then(function success(data) {
                if (vm.bovino.pesoAlNacer === 0 || vm.bovino.pesoAlNacer === undefined)
                    vm.bovino.pesoAlNacer = '';
                if (vm.bovino.idBovinoMadre === 0 || vm.bovino.idBovinoMadre === undefined)
                    vm.bovino.idBovinoMadre = '';
                if (vm.bovino.idBovinoPadre === 0 || vm.bovino.idBovinoPadre === undefined)
                    vm.bovino.idBovinoPadre = '';
                if (vm.bovino.idEstablecimientoOrigen === 0 || vm.bovino.idEstablecimientoOrigen === undefined)
                    vm.bovino.idEstablecimientoOrigen = '';
                //vm.habilitar = false;
                vm.showSpinner = false;
                toastr.success('Se modificó el bovino con éxito ', 'Éxito');
            }, function error(data) {
                toastr.success('La operación no se pudo completar', 'Error');
            })
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

        function idCaravanaChange() {
            if (vm.bovino.numCaravana !== nroCaravanaOriginal) {
                modificarBovinoService.existeIdCaravana(vm.bovino.numCaravana).then(function success(data) {
                    if (data[0] === "1") {
                        vm.formModificarBovino.idCaravana.$setValidity("existeIdCaravana", false);
                    }
                    else {
                        vm.formModificarBovino.idCaravana.$setValidity("existeIdCaravana", true);
                    }
                }, function (error) {
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        };

        function getFecha() {
            vm.bovino.fechaNacimiento = $('#datetimepicker4')[0].value;
            var fechaNac = new Date(vm.bovino.fechaNacimiento.substring(6, 10), parseInt(vm.bovino.fechaNacimiento.substring(3, 5)) - 1, vm.bovino.fechaNacimiento.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaNac > fechaHoy) {
                vm.formModificarBovino.fechaNac.$setValidity("max", false);
            }
            else {
                vm.formModificarBovino.fechaNac.$setValidity("max", true);
            }
            if (fechaNac < fechaMin)
                vm.formModificarBovino.fechaNac.$setValidity("min", false);
            else
                vm.formModificarBovino.fechaNac.$setValidity("min", true);
        }
    }
})();