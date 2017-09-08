(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarInseminacionController', consultarInseminacionController);

    consultarInseminacionController.$inject = ['$scope', 'consultarInseminacionService'];

    function consultarInseminacionController($scope, consultarInseminacionService) {
        var vm = $scope;
        //variables
        vm.itemsPorPagina = 9;
        //vm.rowCollection = [{col1: 'jajasd',col2: '123fda',col3: 'asdasd',col4: 'asdasd'},
        //    {col1: 'asdas',col2: 'ddsad',col3: 'cxcvz',col4: 'zxczxc'},
        //    {col1: 'czxcg',col2: 'fgdh',col3: '3242fsdf',col4: 'sdfsdfs'},
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' }];

        //vm.caca = [{ col1: 'jajasd', col2: '123fda', col3: 'asdasd', col4: 'asdasd' },
        //    { col1: 'asdas', col2: 'ddsad', col3: 'cxcvz', col4: 'zxczxc' },
        //    { col1: 'czxcg', col2: 'fgdh', col3: '3242fsdf', col4: 'sdfsdfs' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' },
        //    { col1: 'asdasf3', col2: '1243dfsdf', col3: '34234234', col4: 'asdasdasd' }];
        //metodos
        vm.inicializar = inicializar;
        inicializar();

        function inicializar() { }
    }
})();
