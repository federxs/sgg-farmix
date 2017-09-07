(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultar_inseminacion', consultar_inseminacion);

    consultar_inseminacion.$inject = ['$location']; 

    function consultar_inseminacion($location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'consultar_inseminacion';

        activate();

        function activate() { }
    }
})();
