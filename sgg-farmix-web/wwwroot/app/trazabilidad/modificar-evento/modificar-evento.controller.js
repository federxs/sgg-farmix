(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarEventoController', modificarEventoController);

    modificarEventoController.$inject = ['$scope', 'modificarEventoService', '$stateParams', 'tipoEventoService', 'toastr', '$localStorage'];

    function modificarEventoController($scope, modificarEventoService, $stateParams, tipoEventoService, toastr, $localStorage) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.habilitar = false;
        vm.habilitarBtnAceptar = false;
        vm.showBotones = true;
        //funciones
        vm.inicializar = inicializar();
        vm.modificar = modificar;
        vm.eliminar = eliminar;
        vm.openPopUp = openPopUp;
        vm.changeCampos = changeCampos;
        vm.changeRodeos = changeRodeos;
        vm.getFecha = getFecha;
        vm.modificarEvento = modificarEvento;
        //variables
        vm.evento = {};
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        var idBovinoEliminar = 0;

        function inicializar() {
            vm.showBotones = true;
            vm.showSpinner = true;
            vm.habilitar = false;
            vm.habilitarBtnAceptar = false;
            vm.itemsPorPagina = 9;
            modificarEventoService.initModificacion($stateParams.id, $localStorage.usuarioInfo.usuario).then(function success(data) {
                vm.vacunas = data.vacunas;
                vm.tiposEventos = data.tipoEvento;
                vm.rowCollection = data.listaBovinos.listaBovinos;
                vm.campos = data.campos;
                vm.rodeos = data.rodeos;
                modificarEventoService.getEventoForModificar($stateParams.id).then(function success(data) {
                    //evento
                    vm.evento = data;
                    vm.evento.idTipoEvento = vm.evento.idTipoEvento.toString();
                    vm.evento.idVacuna = vm.evento.idVacuna.toString();
                    vm.evento.idCampoDestino = vm.evento.idCampoDestino.toString();
                    vm.idRodeoDestino = vm.evento.idRodeoDestino.toString();
                    if (vm.evento.idCampoDestino !== "0") {
                        vm.changeCampos();
                    }
                    angular.forEach(vm.evento, function (value, key) {
                        if (parseInt(value) === 0 && key !== 'idEvento') {
                            vm.evento[key] = '';
                        }
                    });
                    vm.showSpinner = false;
                    vm.habilitar = true;
                    vm.habilitarBtnAceptar = true;
                }, function error(error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }, function error(error) {
                vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }//fin inicializar

        function modificar() {
            getFecha();
            if (vm.evento.cantidad === '')
                vm.evento.cantidad = 0;
            else
                vm.evento.cantidad = vm.evento.cantidad.toString().replace(',', '.');
            vm.evento.fechaHora = vm.evento.fechaHora.substring(6, 10) + '/' + vm.evento.fechaHora.substring(3, 5) + '/' + vm.evento.fechaHora.substring(0, 2) + ' ' + convertirHora(vm.evento.fechaHora.substring(11, 16), vm.evento.fechaHora.substring(17, 19));
            //vm.evento.fechaHora = convertirFecha(vm.evento.fechaHora);
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
            for (var i = 0; i < vm.rowCollection.length; i++) {
                ids.push(vm.rowCollection[i].idBovino);
            }
            if (ids.length === 0) {
                openPopUpConfirmElimEvento();
            }
            else
                modificarEvento(ids);
        }

        function modificarEvento(ids) {
            modificarEventoService.modificar(vm.evento, ids.toString()).then(function success(data) {
                vm.habilitar = false;
                vm.showBotones = false;
                vm.habilitarBtnAceptar = false;
                toastr.success('Se modificó el evento con éxito ', 'Éxito');
                $('#modalConfirmEliminEvento').modal('hide');
            }, function error(data) {
                vm.showSpinner = false;
                toastr.error('La operación no se pudo completar', 'Error');
                $('#modalConfirmEliminEvento').modal('hide');
            })
        }

        function openPopUp(id, caravana) {
            idBovinoEliminar = id;
            vm.nroCaravana = caravana;
            $('#modalConfirmEliminar').modal('show');
        }

        function openPopUpConfirmElimEvento() {
            $('#modalConfirmEliminEvento').modal('show');
        }

        function eliminar() {
            for (var i = 0; i < vm.rowCollection.length; i++) {
                if (vm.rowCollection[i].idBovino === idBovinoEliminar)
                    vm.rowCollection.splice(i, 1);
            }
            $('#modalConfirmEliminar').modal('hide');
        }

        function convertirHora(hora, momento) {
            var horaDevuelta = hora;
            if (momento === 'pm') {
                switch (hora.substring(0, 2)) {
                    case '01':
                        horaDevuelta = '13' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '02':
                        horaDevuelta = '14' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '03':
                        horaDevuelta = '15' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '04':
                        horaDevuelta = '16' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '05':
                        horaDevuelta = '17' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '06':
                        horaDevuelta = '18' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '07':
                        horaDevuelta = '19' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '08':
                        horaDevuelta = '20' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '09':
                        horaDevuelta = '21' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '10':
                        horaDevuelta = '22' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '11':
                        horaDevuelta = '23' + ':' + horaDevuelta.substring(3, 5);
                        break;
                }                
            }
            return horaDevuelta;
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
            return dia + '/' + mes + '/' + año + fecha.substring(12, 15);
        };

        function changeCampos() {
            var campo = '';
            vm.idRodeoDestino = vm.evento.idRodeoDestino.toString();
            for (var i = 0; i < vm.campos.length; i++) {
                if (vm.campos[i].idCampo === parseInt(vm.evento.idCampoDestino)) {
                    campo = vm.campos[i].codigoCampo;
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
            }, function error(error) {
                vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function changeRodeos() {
            if (parseInt(vm.evento.idRodeoDestino) > 0)
                vm.habilitarBtnAceptar = true;
        }

        function getFecha() {
            vm.evento.fechaHora = $('#datetimepicker4')[0].value;
            var fechaEvento = new Date(vm.evento.fechaHora.substring(6, 10), parseInt(vm.evento.fechaHora.substring(3, 5)) - 1, vm.evento.fechaHora.substring(0, 2));
            var fechaHoy = new Date();
            if (fechaEvento > fechaHoy) {
                vm.formModificarEvento.fechaEvento.$setValidity("max", false);
                vm.habilitarBtnAceptar = false;
            }
            else {
                vm.formModificarEvento.fechaEvento.$setValidity("max", true);
                vm.habilitarBtnAceptar = true;
            }            
        }
    }//fin archivo
})();