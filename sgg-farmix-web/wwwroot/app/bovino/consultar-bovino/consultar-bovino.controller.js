(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarBovinoController', consultarBovinoController);

    consultarBovinoController.$inject = ['$scope', 'consultarBovinoService', 'toastr'];

    function consultarBovinoController($scope, consultarBovinoService, toastr) {
        var vm = $scope;
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.paginar = paginar;
        vm.anterior = anterior;
        vm.siguiente = siguiente;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        vm.establecimientos = [];
        vm.listaBovinos = [];
        vm.filtro = {};
        vm.Paginas = [];
        vm.disabledSgte = '';
        vm.disabledAnt = '';
        vm.cursor = '';
        var registros = 5;
        var bovinos = [];
        var ultimoIndiceVisto = 0;
        function inicializar() {
            consultarBovinoService.inicializar({ idAmbitoEstado: '1' }, function (data) {
                vm.estados = data.estados;
                vm.categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.filtro.idCategoria = '0';
                vm.filtro.genero = '2';
                vm.filtro.idRaza = '0';
                vm.filtro.idRodeo = '0';
                vm.filtro.idEstado = '0';
                vm.filtro.accionPeso = '0';
                consultar();
            });
            //vm.bovino = new registrarBovinoService();
        };

        function anterior() {
            var paginaSelecciona = 0;
            for (var i = 0; i < vm.Paginas.length; i++) {
                if(vm.Paginas[i].seleccionada)
                {
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
            bovinos = [];
            var cantPaginas = 0;
            vm.Paginas = [];
            vm.listaBovinos = [];
            registros = 10;
            if (vm.filtro.peso === '') vm.filtro.peso = 0;
            if (vm.filtro.numCaravana === '') vm.filtro.numCaravana = 0;
            consultarBovinoService.obtenerListaBovinos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                bovinos = data;
                cantPaginas = parseInt(data.length / registros);
                for (var i = 0; i < (cantPaginas + 1) ; i++) {
                    if (i === 0) vm.Paginas.push({ numPag: (i + 1), regInit: (registros * i), regFin: (registros * (i + 1)), seleccionada: true, clase: '#E4DFDF'});
                    else vm.Paginas.push({ numPag: (i + 1), regInit: (registros * i), regFin: (registros * (i + 1)), seleccionada: false, clase: '' });
                }
                if (data.length < registros) registros = data.length;
                for (var i = 0; i < registros; i++) {
                    vm.listaBovinos.push(data[i]);
                }
                //vm.listaBovinos = data;
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
            }, function (error) {
                toastr.error('Error: ' + error, 'Error');
            });
        };        
    }
})();