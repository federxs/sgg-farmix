(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarEventoController', modificarEventoController);

    modificarEventoController.$inject = ['$scope', 'modificarEventoService', '$stateParams', 'tipoEventoService', 'toastr'];

    function modificarEventoController($scope, modificarEventoService, $stateParams, tipoEventoService, toastr) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.habilitar = false;
        vm.habilitarBtnAceptar = false;
        vm.showBotones = true;
        //funciones
        vm.inicializar = inicializar();
        vm.modificar = modificar;
        vm.eliminar = eliminar;
        vm.changeCampos = changeCampos;
        vm.changeRodeos = changeRodeos;
        //variables
        vm.evento = {};
        vm.fechaDeHoy = new Date();

        function inicializar() {
            vm.showBotones = true;
            vm.showSpinner = true;
            vm.habilitar = false;
            vm.habilitarBtnAceptar = false;
            modificarEventoService.initModificacion($stateParams.id).then(function success(data) {
                vm.vacunas = data.vacunas;
                vm.tiposEventos = data.tipoEvento;
                vm.listaBovinos = data.listaBovinos.listaBovinos;
                vm.campos = data.campos;
                vm.rodeos = data.rodeos;
                modificarEventoService.getEventoForModificar($stateParams.id).then(function success(data) {
                    //evento
                    vm.evento = data;
                    vm.evento.idTipoEvento = vm.evento.idTipoEvento.toString();
                    vm.evento.idVacuna = vm.evento.idVacuna.toString();
                    vm.evento.idCampoDestino = vm.evento.idCampoDestino.toString();
                    vm.idRodeoDestino = vm.evento.idRodeoDestino.toString();
                    var fecha = vm.evento.fechaHora.substring(0, 10).split('/');
                    vm.evento.fechaHora = new Date(fecha[2], (parseInt(fecha[1]) - 1).toString(), fecha[0]);
                    //seteamos a "" las variables 0
                    angular.forEach(vm.evento, function (value, key) {
                        if (parseInt(value) === 0 && key !== 'idEvento') {
                            vm.evento[key] = '';
                        }
                    });
                    vm.showSpinner = false;
                    vm.habilitar = true;
                    vm.habilitarBtnAceptar = true;
                }, function error(error) {
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }, function error(error) {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }//fin inicializar

        function modificar() {
            if (vm.evento.cantidad === '')
                vm.evento.cantidad = 0;
            else
                vm.evento.cantidad = vm.evento.cantidad.toString().replace(',', '.');
            vm.evento.fechaHora = convertirFecha(vm.evento.fechaHora);
            if (vm.evento.idVacuna === '')
                vm.evento.idVacuna = 0;
            if (vm.evento.idAntibiotico === '')
                vm.evento.idAntibiotico = 0;
            if (vm.evento.idCampoDestino === '')
                vm.evento.idCampoDestino = 0;
            if (vm.evento.idRodeoDestino === '')
                vm.evento.idRodeoDestino = 0;
            if (vm.evento.idAlimento === '')
                vm.evento.idAlimento = 0;
            vm.evento.idRodeoDestino = vm.idRodeoDestino;
            var ids = [];
            for (var i = 0; i < vm.listaBovinos.length; i++) {
                ids.push(vm.listaBovinos[i].idBovino);
            }
            modificarEventoService.modificar(vm.evento, ids).then(function success(data) {
                vm.habilitar = false;
                vm.showBotones = false;
                vm.habilitarBtnAceptar = false;
                toastr.success('Se modificó el evento con éxito ', 'Éxito');
            }, function error(data) {
                toastr.error('La operación no se pudo completar', 'Error');
            })
        }

        function eliminar(id) {
            for (var i = 0; i < vm.listaBovinos.length; i++) {
                if (vm.listaBovinos[i].idBovino === id)
                    vm.listaBovinos.splice(i, 1);
            }
        }

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
        };

        function changeCampos() {
            var campo = '';
            vm.idRodeoDestino = vm.evento.idRodeoDestino.toString();
            for (var i = 0; i < vm.campos.length; i++) {
                if (vm.campos[i].idCampo === parseInt(vm.evento.idCampoDestino)) {
                    campo = vm.campos[i].nombre;
                    break;
                }
            }
            modificarEventoService.getRodeos(campo).then(function success(data) {
                vm.rodeos = data;
                var encontre = false;
                vm.habilitarBtnAceptar = true;
                for (var i = 0; i < vm.rodeos.length; i++) {
                    if (vm.rodeos[i].idRodeo === parseInt(vm.idRodeoDestino)) {
                        encontre = true;
                        break;
                    }
                }
                if (!encontre) {
                    vm.idRodeoDestino = '';
                    vm.habilitarBtnAceptar = false;
                }
            })
        }

        function changeRodeos() {
            if (parseInt(vm.evento.idRodeoDestino) > 0)
                vm.habilitarBtnAceptar = true;
        }

    }//fin archivo
})();