(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarTrazabilidadController', consultarTrazabilidadController);

    consultarTrazabilidadController.$inject = ['$scope', 'tipoEventoService', 'toastr'];

    function consultarTrazabilidadController($scope, tipoEventoService, toastr) {
        var vm = $scope;
        //vm.showSpinner = true;
        //vm.disabled = 'disabled';
        vm.disabledSgte = 'cursor';
        vm.disabledAnt = 'cursor';
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.paginar = paginar;
        vm.anterior = anterior;
        vm.siguiente = siguiente;
        //variables       
        vm.filtro = {};
        vm.Paginas = [];
        vm.cursor = '';
        var registros = 5;
        var eventos = [];
        var ultimoIndiceVisto = 0;
        vm.fechaDeHoy = new Date();
        function inicializar() {
            //vm.showSpinner = true;
            //vm.disabled = 'disabled';
            vm.disabledSgte = 'cursor';
            vm.disabledAnt = 'cursor';
            tipoEventoService.inicializar({ }).then(function success(data){
                vm.Eventos = data;
                vm.filtro.idTipoEvento = '0';
                consultar();
            });
            //vm.bovino = new registrarBovinoService();
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
            vm.showSpinner = false;
            //vm.disabled = 'disabled';
            vm.disabledSgte = 'cursor';
            vm.disabledAnt = 'cursor';
            eventos = [];
            var cantPaginas = 0;
            vm.Paginas = [];
            vm.listaEventos = [];

            vm.listaEventos = [
                { tipoEvento: 'Vacunación', fechaEvento: '28/05/2017' },
                { tipoEvento: 'Vacunación', fechaEvento: '17/07/2017' },
                { tipoEvento: 'Manejo', fechaEvento: '07/01/2017' },
                { tipoEvento: 'Alimenticio', fechaEvento: '10/06/2017' },
            ]
            //registros = 5;
            //if (vm.filtro.peso === '') vm.filtro.peso = 0;
            //if (vm.filtro.numCaravana === '') vm.filtro.numCaravana = 0;
            //consultarBovinoService.obtenerListaBovinos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
            //    bovinos = data;
            //    cantPaginas = parseInt(data.length / registros);
            //    for (var i = 0; i < cantPaginas ; i++) {
            //        if (i === 0) vm.Paginas.push({ numPag: (i + 1), regInit: (registros * i), regFin: (registros * (i + 1)), seleccionada: true, clase: '#E4DFDF' });
            //        else vm.Paginas.push({ numPag: (i + 1), regInit: (registros * i), regFin: (registros * (i + 1)), seleccionada: false, clase: '' });
            //    }
            //    if (data.length < registros) registros = data.length;
            //    for (var i = 0; i < registros; i++) {
            //        vm.listaBovinos.push(data[i]);
            //    }
            //    //vm.listaBovinos = data;
            //    if (vm.filtro.peso === 0) vm.filtro.peso = '';
            //    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
            //    vm.showSpinner = false;
            //    vm.disabled = '';
            //    vm.disabledSgte = '';
            //    vm.disabledAnt = '';
            //}, function (error) {
            //    toastr.error('Error: ' + error, 'Error');
            //});
        };
    }
})();