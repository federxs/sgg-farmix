(function () {
    'use strict';

    angular
        .module('app')
        .controller('resolverConflictoController', resolverConflictoController);

    resolverConflictoController.$inject = ['$scope'];

    function resolverConflictoController($scope) {
        var vm = this;

        /////VARIABLES
        vm.eventoAnterior = {};
        vm.eventoResultante = {};
        vm.eventoNuevo = {};
        vm.maxDate = new Date();

        /////METODOS
        vm.init = init();
        vm.seleccionarEvento = seleccionarEvento();

        init();

        function init() { }

        function seleccionarEvento(evento) {
            vm.eventoResultante.fecha = evento.fecha;
            vm.eventoResultante.cantidad = evento.cantidad;
            vm.eventoResultante.tipoEvento = evento.tipoEvento;
            vm.eventoResultante.vacuna = evento.vacuna;
            vm.eventoResultante.antibiotico = evento.antibiotico;
            vm.eventoResultante.alimento = evento.alimento;
            vm.eventoResultante.rodeoDestino = evento.rodeoDestino;
            vm.eventoResultante.campoDestino = evento.campoDestino;
        }
    }
})();
