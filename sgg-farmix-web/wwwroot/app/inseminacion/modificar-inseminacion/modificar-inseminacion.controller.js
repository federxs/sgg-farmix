(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarInseminacionController', modificarInseminacionController);

    modificarInseminacionController.$inject = ['$scope', 'modificarInseminacionService', 'toastr', '$stateParams'];

    function modificarInseminacionController($scope, modificarInseminacionService, toastr, $stateParams) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        //funciones
        vm.modificar = modificar;
        vm.inicializar = inicializar();
        vm.getFecha = getFecha;
        vm.getFechaParicion = getFechaParicion;
        vm.getFechaTacto = getFechaTacto;
        vm.openPopUp = openPopUp;
        vm.openPopUpToro = openPopUpToro;
        vm.eliminarToro = eliminarToro;
        vm.eliminar = eliminar;
        vm.antesDeModificar = antesDeModificar;
        //variables
        vm.fechaDeHoy = new Date();
        vm.desde = $stateParams.desde;
        vm.showEliminar = true;
        $('#datetimepicker4').datetimepicker();
        var idVacaEliminar = 0;
        var idToroEliminar = 0;
        var fechaInseminacionOriginal = '';
        var lista = [];
        var listaToros = [];

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.habilitar = false;
            vm.fecha = $stateParams.fecha;
            modificarInseminacionService.getInseminacion($stateParams.fecha).then(function success(data) {
                //inseminacion
                vm.inseminacion = data;
                vm.inseminacion.idTipoInseminacion = vm.inseminacion.idTipoInseminacion.toString();
                fechaInseminacionOriginal = vm.inseminacion.fechaInseminacion;
                if (vm.inseminacion.fechaEstimadaNacimiento !== '') {
                    $('#datetimepicker5').datetimepicker();
                    $('#datetimepicker6').datetimepicker();
                    vm.vaca = vm.inseminacion.listaBovinos[0];
                    if (vm.inseminacion.listaToros)
                        vm.toro = vm.inseminacion.listaToros[0];
                    vm.tacto = vm.inseminacion.tactos[0];
                    vm.tacto.idTipoTacto = vm.tacto.idTipoTacto.toString();
                }
                else {
                    vm.rowCollection = vm.inseminacion.listaBovinos;
                    vm.torosCollection = vm.inseminacion.listaToros;
                }
                vm.tituloTabla = 'Vacas que participaron de la inseminación';
                vm.tiposInseminacion = [
                    { idTipoInseminacion: '1', descripcion: 'Artificial' },
                    { idTipoInseminacion: '2', descripcion: 'Montura' }
                ];
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                vm.habilitar = true;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function antesDeModificar() {
            //vm.showSpinner = true;            
            vm.habilitar = false;
            vm.showEliminar = true;
            if (vm.rowCollection !== undefined) {
                for (var i = 0; i < vm.rowCollection.length; i++) {
                    lista.push(vm.rowCollection[i].idBovino);
                }
            }
            else
                lista.push(vm.vaca.idBovino);
            if (vm.torosCollection) {
                for (var i = 0; i < vm.torosCollection.length; i++) {
                    listaToros.push(vm.torosCollection[i].idBovino);
                }
            }
            else if (vm.inseminacion.idTipoInseminacion === '2' || vm.inseminacion.idTipoInseminacion === 2)
                listaToros.push(vm.toro.idBovino);
            vm.inseminacion.tipoInseminacion = vm.inseminacion.idTipoInseminacion;
            if ((lista.length === 0 && vm.inseminacion.tipoInseminacion === 1) || (lista.length === 0 && vm.inseminacion.tipoInseminacion === '2' && listaToros.length === 0))
                $('#modalConfirmEliminarInseminacion').modal('show');
            else if (lista.length > 0 && vm.inseminacion.tipoInseminacion === '2' && listaToros.length === 0)
                $('#modalConfirmEliminarInseminacionSinToros').modal('show');
            else
                modificar();
        };

        function modificar() {
            if (listaToros.length === 0)
                vm.inseminacion.tipoInseminacion = 1;
            $scope.$parent.blockSpinnerSave();
            if (vm.desde === 'servicioSinConfirm') {
                modificarInseminacionService.modificar(vm.inseminacion, lista.toString(), listaToros.toString(), fechaInseminacionOriginal).then(function success(data) {
                    //vm.habilitar = false;
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    $('#modalConfirmEliminarInseminacion').modal('hide');
                    $('#modalConfirmEliminarInseminacionSinToros').modal('hide');
                    vm.showEliminar = false;
                    toastr.success('Se modificó la inseminación con éxito ', 'Éxito');
                }, function error(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBllockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
            else {
                modificarInseminacionService.update(vm.inseminacion, vm.tacto).then(function success(data) {
                    //vm.habilitar = false;
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    $('#modalConfirmEliminarInseminacion').modal('hide');
                    toastr.success('Se modificó la inseminación con éxito ', 'Éxito');
                }, function error(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        }

        function openPopUp(id, caravana) {
            idVacaEliminar = id;
            vm.nroCaravana = caravana;
            $('#modalConfirmEliminarVaca').modal('show');
        }

        function eliminar() {
            for (var i = 0; i < vm.rowCollection.length; i++) {
                if (vm.rowCollection[i].idBovino === idVacaEliminar)
                    vm.rowCollection.splice(i, 1);
            }
            $('#modalConfirmEliminarVaca').modal('hide');
        }

        function openPopUpToro(id, caravana) {
            idToroEliminar = id;
            vm.nroCaravanaToro = caravana;
            $('#modalConfirmEliminarToro').modal('show');
        }

        function eliminarToro() {
            for (var i = 0; i < vm.torosCollection.length; i++) {
                if (vm.torosCollection[i].idBovino === idToroEliminar)
                    vm.torosCollection.splice(i, 1);
            }
            $('#modalConfirmEliminarToro').modal('hide');
        }

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

        function getFecha() {
            vm.inseminacion.fechaInseminacion = $('#datetimepicker4')[0].value;
            var fechaInseminacion = new Date(vm.inseminacion.fechaInseminacion.substring(6, 10), parseInt(vm.inseminacion.fechaInseminacion.substring(3, 5)) - 1, vm.inseminacion.fechaInseminacion.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaInseminacion > fechaHoy) {
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("max", false);
            }
            else {
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("max", true);
            }
            if (fechaInseminacion < fechaMin)
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("min", false);
            else
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("min", true);
        }

        function getFechaParicion() {
            vm.inseminacion.fechaEstimadaNacimiento = $('#datetimepicker5')[0].value;
            var fechaEstNacimiento = new Date(vm.inseminacion.fechaEstimadaNacimiento.substring(6, 10), parseInt(vm.inseminacion.fechaEstimadaNacimiento.substring(3, 5)) - 1, vm.inseminacion.fechaEstimadaNacimiento.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaEstNacimiento < fechaMin)
                vm.formModificarInseminacion.fechaParto.$setValidity("min", false);
            else
                vm.formModificarInseminacion.fechaParto.$setValidity("min", true);
        }

        function getFechaTacto() {
            vm.tacto.fechaTacto = $('#datetimepicker6')[0].value;
            var fechaTacto = new Date(vm.tacto.fechaTacto.substring(6, 10), parseInt(vm.tacto.fechaTacto.substring(3, 5)) - 1, vm.tacto.fechaTacto.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaTacto < fechaMin)
                vm.formModificarInseminacion.fechaTacto.$setValidity("min", false);
            else
                vm.formModificarInseminacion.fechaTacto.$setValidity("min", true);
        }
    }
})();